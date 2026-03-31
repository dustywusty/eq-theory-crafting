import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db";
import { combos } from "../db/schema";
import { eq } from "drizzle-orm";

const comboSchema = z.object({
  name: z.string().min(1).max(255),
  class1: z.string().length(3),
  class2: z.string().length(3),
  class3: z.string().length(3),
  race: z.string().length(3),
  tier: z.enum(["S", "A", "B", "C"]).default("B"),
  summary: z.string().min(1),
  synergies: z.array(z.string()).default([]),
  playstyle: z.string().min(1),
  weakness: z.string().min(1),
  tank: z.number().int().min(0).max(10).default(5),
  heal: z.number().int().min(0).max(10).default(5),
  dps: z.number().int().min(0).max(10).default(5),
  utility: z.number().int().min(0).max(10).default(5),
  solo: z.number().int().min(0).max(10).default(5),
});

const app = new Hono();

// List all combos
app.get("/", async (c) => {
  if (!db) return c.json({ error: "Database not configured" }, 503);
  const allCombos = await db.select().from(combos);
  return c.json(allCombos);
});

// Get single combo
app.get("/:id", async (c) => {
  if (!db) return c.json({ error: "Database not configured" }, 503);
  const id = parseInt(c.req.param("id"));
  const [combo] = await db.select().from(combos).where(eq(combos.id, id));
  if (!combo) return c.json({ error: "Not found" }, 404);
  return c.json(combo);
});

// Create combo
app.post("/", async (c) => {
  if (!db) return c.json({ error: "Database not configured" }, 503);
  const body = await c.req.json();
  const parsed = comboSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const [created] = await db.insert(combos).values(parsed.data).returning();
  return c.json(created, 201);
});

// Update combo
app.put("/:id", async (c) => {
  if (!db) return c.json({ error: "Database not configured" }, 503);
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const parsed = comboSchema.partial().safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const [updated] = await db.update(combos).set({ ...parsed.data, updated_at: new Date() }).where(eq(combos.id, id)).returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// Delete combo
app.delete("/:id", async (c) => {
  if (!db) return c.json({ error: "Database not configured" }, 503);
  const id = parseInt(c.req.param("id"));
  const [deleted] = await db.delete(combos).where(eq(combos.id, id)).returning();
  if (!deleted) return c.json({ error: "Not found" }, 404);
  return c.json({ success: true });
});

export default app;
