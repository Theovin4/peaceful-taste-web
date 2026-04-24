// @ts-nocheck
import express from "express";
import { readAdminSessionFromRequest } from "./_core/adminSession";
import {
  prepareInquiriesWorkbookBuffer,
  prepareOrdersWorkbookBuffer,
} from "./excel-storage";

const app = express();

app.get("*", async (req, res) => {
  if (!readAdminSessionFromRequest(req)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const sheet = req.path.split("/").filter(Boolean).pop();

  if (sheet === "orders") {
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
    return;
  }

  if (sheet === "inquiries") {
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
    return;
  }

  res.status(404).json({ error: "Export not found" });
});

export default app;
