// @ts-nocheck
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./_core/context";
import { appRouter } from "./routers";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
});

app.use(trpcMiddleware);
app.use("/trpc", trpcMiddleware);
app.use("/api/trpc", trpcMiddleware);

export default app;
