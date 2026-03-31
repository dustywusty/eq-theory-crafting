import { pgTable, serial, text, integer, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";

export const combos = pgTable("combos", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  class1: varchar("class1", { length: 3 }).notNull(),
  class2: varchar("class2", { length: 3 }).notNull(),
  class3: varchar("class3", { length: 3 }).notNull(),
  race: varchar("race", { length: 3 }).notNull(),
  tier: varchar("tier", { length: 1 }).notNull().default("B"),
  summary: text("summary").notNull(),
  synergies: jsonb("synergies").$type<string[]>().notNull().default([]),
  playstyle: text("playstyle").notNull(),
  weakness: text("weakness").notNull(),
  tank: integer("tank").notNull().default(5),
  heal: integer("heal").notNull().default(5),
  dps: integer("dps").notNull().default(5),
  utility: integer("utility").notNull().default(5),
  solo: integer("solo").notNull().default(5),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type ComboInsert = typeof combos.$inferInsert;
export type ComboSelect = typeof combos.$inferSelect;
