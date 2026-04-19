// @ts-nocheck
import express from "express";
import fs from "node:fs";
import {
  prepareInquiriesWorkbookDownload,
  prepareOrdersWorkbookDownload,
} from "./excel-storage";

const app = express();

app.get("*", async (req, res) => {
  const sheet = req.path.split("/").filter(Boolean).pop();

  if (sheet === "orders") {
    const ordersFile = await prepareOrdersWorkbookDownload();
    if (!fs.existsSync(ordersFile)) {
      res.status(404).json({ error: "Orders workbook not found" });
      return;
    }

    res.download(ordersFile, "peaceful-taste-orders.xlsx");
    return;
  }

  if (sheet === "inquiries") {
    const inquiriesFile = await prepareInquiriesWorkbookDownload();
    if (!fs.existsSync(inquiriesFile)) {
      res.status(404).json({ error: "Inquiries workbook not found" });
      return;
    }

    res.download(inquiriesFile, "peaceful-taste-inquiries.xlsx");
    return;
  }

  res.status(404).json({ error: "Export not found" });
});

export default app;
