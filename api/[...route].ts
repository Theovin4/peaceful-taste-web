// @ts-nocheck
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { createContext } from "../server/_core/context";
import { appRouter } from "../server/routers";
import { getInquiriesFilePath, getOrdersFilePath, initializeAllWorkbooks } from "../server/excel-storage";
import fs from "node:fs";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

initializeAllWorkbooks().catch((err) => console.error("[Excel] Initialization error:", err));

registerOAuthRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/api/admin/export/orders", (_req, res) => {
  const ordersFile = getOrdersFilePath();

  if (!fs.existsSync(ordersFile)) {
    res.status(404).json({ error: "Orders workbook not found" });
    return;
  }

  res.download(ordersFile, "peaceful-taste-orders.xlsx");
});

app.get("/api/admin/export/inquiries", (_req, res) => {
  const inquiriesFile = getInquiriesFilePath();

  if (!fs.existsSync(inquiriesFile)) {
    res.status(404).json({ error: "Inquiries workbook not found" });
    return;
  }

  res.download(inquiriesFile, "peaceful-taste-inquiries.xlsx");
});

export default app;
