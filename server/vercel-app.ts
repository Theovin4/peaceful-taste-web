// @ts-nocheck
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
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

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
    await warmWorkbooks();
    const ordersFile = await prepareOrdersWorkbookDownload();

    if (!fs.existsSync(ordersFile)) {
      res.status(404).json({ error: "Orders workbook not found" });
      return;
    }

    res.download(ordersFile, "peaceful-taste-orders.xlsx");
  });

  apiRouter.get("/admin/export/inquiries", async (_req, res) => {
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
