import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "dotenv/config";

import comboRoutes from "./routes/combos";
import dataRoutes from "./routes/data";
import evaluateRoutes from "./routes/evaluate";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ["Content-Type"],
}));

// Health check
app.get("/", (c) => c.json({
  name: "EQ Theory API",
  version: "1.0.0",
  status: "ok"
}));

// Mount routes
app.route("/api/combos", comboRoutes);
app.route("/api/data", dataRoutes);
app.route("/api/evaluate", evaluateRoutes);

const port = parseInt(process.env.PORT || "3001");
console.log(`EQ Theory API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
