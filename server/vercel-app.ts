// @ts-nocheck
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { readAdminSessionFromRequest } from "./_core/adminSession";
import { registerOAuthRoutes } from "./_core/oauth";
import { createContext } from "./_core/context";
import { appRouter } from "./routers";
import {
  initializeAllWorkbooks,
  prepareInquiriesWorkbookBuffer,
  prepareOrdersWorkbookBuffer,
} from "./excel-storage";

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

    if (req.path.startsWith('/trpc') || req.path.startsWith('/api/trpc') || req.path === '/health' || req.path === '/api/health') {
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
    const buffer = await prepareOrdersWorkbookBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="peaceful-taste-orders.xlsx"'
    );
    res.setHeader("Content-Length", String(buffer.length));
    res.send(buffer);
  });

  apiRouter.get("/admin/export/inquiries", async (_req, res) => {
    if (!readAdminSessionFromRequest(_req)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await warmWorkbooks();
    const buffer = await prepareInquiriesWorkbookBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="peaceful-taste-inquiries.xlsx"'
    );
    res.setHeader("Content-Length", String(buffer.length));
    res.send(buffer);
  });

  // Vercel's Node function path can arrive either already stripped of `/api`
  // or with the original prefix, depending on how the function is invoked.
  app.use(apiRouter);
  app.use("/api", apiRouter);

  return app;
}

export default createVercelApp();
