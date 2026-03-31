import { Hono } from "hono";
import { EQ_CLASSES } from "@eq/shared/classes";
import { EQ_RACES } from "@eq/shared/races";
import { EQ_SPELLS, P99_SPELL_RECORDS, getSpellById } from "@eq/shared/spells";
import { SYNERGY_RULES } from "@eq/shared/synergy-rules";
import { EQ_ZONES, getZoneById, searchZones } from "@eq/shared/zones";
import {
  CORE_KNOWLEDGE_FACTS,
  KNOWLEDGE_SOURCES,
  filterKnowledgeFacts,
  isKnowledgeDomain,
  isKnowledgeRuleset,
} from "@eq/shared/knowledge";
import type { KnowledgeDomain, KnowledgeRuleset } from "@eq/shared/knowledge";

const app = new Hono();

app.get("/classes", (c) => c.json(EQ_CLASSES));
app.get("/classes/:id", (c) => {
  const cls = EQ_CLASSES[c.req.param("id").toUpperCase()];
  if (!cls) return c.json({ error: "Class not found" }, 404);
  return c.json(cls);
});

app.get("/races", (c) => c.json(EQ_RACES));
app.get("/races/:id", (c) => {
  const race = EQ_RACES[c.req.param("id").toUpperCase()];
  if (!race) return c.json({ error: "Race not found" }, 404);
  return c.json(race);
});

app.get("/rules", (c) => c.json(SYNERGY_RULES));

app.get("/spells", (c) => {
  const classId = c.req.query("classId")?.toUpperCase();
  const query = c.req.query("q")?.trim().toLowerCase();
  const kind = c.req.query("kind");
  const raw = c.req.query("raw") === "1";
  const maxLevelParam = c.req.query("maxLevel");
  const maxLevel = maxLevelParam ? Number.parseInt(maxLevelParam, 10) : null;

  if (kind && kind !== "spell" && kind !== "song") {
    return c.json({ error: "Invalid kind" }, 400);
  }

  if (maxLevelParam && Number.isNaN(maxLevel)) {
    return c.json({ error: "Invalid maxLevel" }, 400);
  }

  if (raw) {
    const spellRows = P99_SPELL_RECORDS.filter((record) => {
      if (classId && record.classId !== classId) return false;
      if (kind && record.kind !== kind) return false;
      if (maxLevel !== null && record.level > maxLevel) return false;
      if (query) {
        const haystack = `${record.name} ${record.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    return c.json(spellRows);
  }

  const spells = EQ_SPELLS.filter((spell) => {
    if (classId && !spell.classAccess.some((access) => access.classId === classId)) return false;
    if (kind && spell.kind !== kind) return false;
    if (
      maxLevel !== null &&
      !spell.classAccess.some((access) => (!classId || access.classId === classId) && access.level <= maxLevel)
    ) {
      return false;
    }
    if (query) {
      const haystack = `${spell.name} ${spell.description}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return c.json(spells);
});

app.get("/spells/:id", (c) => {
  const spell = getSpellById(c.req.param("id"));
  if (!spell) return c.json({ error: "Spell not found" }, 404);
  return c.json(spell);
});

app.get("/zones", (c) => {
  const query = c.req.query("q")?.trim();
  const era = c.req.query("era")?.trim().toLowerCase();

  let zones = query ? searchZones(query) : EQ_ZONES;
  if (era) {
    zones = zones.filter((zone) => zone.era.toLowerCase() === era);
  }

  return c.json(zones);
});

app.get("/zones/:id", (c) => {
  const zone = getZoneById(c.req.param("id"));
  if (!zone) return c.json({ error: "Zone not found" }, 404);
  return c.json(zone);
});

app.get("/knowledge/sources", (c) => c.json(KNOWLEDGE_SOURCES));

app.get("/knowledge/facts", (c) => {
  const rulesetParam = c.req.query("ruleset");
  const domainParam = c.req.query("domain");
  const subject = c.req.query("subject");

  if (rulesetParam && !isKnowledgeRuleset(rulesetParam)) {
    return c.json({ error: "Invalid ruleset" }, 400);
  }

  if (domainParam && !isKnowledgeDomain(domainParam)) {
    return c.json({ error: "Invalid domain" }, 400);
  }

  if (!rulesetParam && !domainParam && !subject) {
    return c.json(CORE_KNOWLEDGE_FACTS);
  }

  const ruleset = rulesetParam as KnowledgeRuleset | undefined;
  const domain = domainParam as KnowledgeDomain | undefined;

  return c.json(
    filterKnowledgeFacts({
      ruleset,
      domain,
      subject,
    })
  );
});

export default app;
