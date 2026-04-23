// @ts-nocheck
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { readAdminSessionFromRequest } from "./_core/adminSession";
import { registerOAuthRoutes } from "./_core/oauth";
import { createContext } from "./_core/context";
import { appRouter } from "./routers";
import {
  initializeAllWorkbooks,
  prepareInquiriesWorkbookDownload,
  prepareOrdersWorkbookDownload,
} from "./excel-storage";
import fs from "node:fs";

export function createVercelApp() {
  const app = express();
  const apiRouter = express.Router();

  app.disable('x-powered-by');

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "img-src 'self' data: blob: https:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "script-src 'self' 'unsafe-inline'",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self' https://wa.me mailto:",
      ].join('; ')
    );

    if (req.path === '/health' || req.path === '/api/health') {
      res.setHeader('Cache-Control', 'no-store');
    }

    next();
  });

  const warmWorkbooks = async () => {
    try {
      await initializeAllWorkbooks();
    } catch (err) {
      console.error("[Excel] Initialization error:", err);
    }
  };

  registerOAuthRoutes(apiRouter);

  apiRouter.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  apiRouter.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  apiRouter.get("/admin/export/orders", async (_req, res) => {
    if (!readAdminSessionFromRequest(_req)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await warmWorkbooks();
    const ordersFile = await prepareOrdersWorkbookDownload();

    if (!fs.existsSync(ordersFile)) {
      res.status(404).json({ error: "Orders workbook not found" });
      return;
    }

    res.download(ordersFile, "peaceful-taste-orders.xlsx");
  });

  apiRouter.get("/admin/export/inquiries", async (_req, res) => {
    if (!readAdminSessionFromRequest(_req)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await warmWorkbooks();
    const inquiriesFile = await prepareInquiriesWorkbookDownload();

    if (!fs.existsSync(inquiriesFile)) {
      res.status(404).json({ error: "Inquiries workbook not found" });
      return;
    }

    res.download(inquiriesFile, "peaceful-taste-inquiries.xlsx");
  });

  // Vercel's Node function path can arrive either already stripped of `/api`
  // or with the original prefix, depending on how the function is invoked.
  app.use(apiRouter);
  app.use("/api", apiRouter);

  return app;
}

export default createVercelApp();
