import { Hono } from "hono";
import { z } from "zod";
import { evaluateCombo } from "@eq/shared/evaluate";

const evaluateSchema = z.object({
  classes: z.array(z.string()).length(3),
  race: z.string().optional(),
});

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = evaluateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const result = evaluateCombo(
    parsed.data.classes as [string, string, string],
    parsed.data.race
  );
  return c.json(result);
});

export default app;
