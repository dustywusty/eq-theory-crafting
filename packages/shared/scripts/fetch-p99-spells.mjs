import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CLASS_PAGE_CONFIG = [
  { classId: "BRD", className: "Bard", pageTitle: "Bard" },
  { classId: "CLR", className: "Cleric", pageTitle: "Cleric" },
  { classId: "DRU", className: "Druid", pageTitle: "Druid" },
  { classId: "ENC", className: "Enchanter", pageTitle: "Enchanter" },
  { classId: "MAG", className: "Magician", pageTitle: "Magician" },
  { classId: "NEC", className: "Necromancer", pageTitle: "Necromancer" },
  { classId: "PAL", className: "Paladin", pageTitle: "Paladin" },
  { classId: "RNG", className: "Ranger", pageTitle: "Ranger" },
  { classId: "SHD", className: "Shadow Knight", pageTitle: "Shadow Knight" },
  { classId: "SHM", className: "Shaman", pageTitle: "Shaman" },
  { classId: "WIZ", className: "Wizard", pageTitle: "Wizard" },
];

const ERA_MAP = {
  "Classic Short": "Classic",
  "Kunark Short": "Kunark",
  "Velious Short": "Velious",
  "Luclin Short": "Luclin",
  "PoP Short": "PoP",
};

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanWikiText(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, ", ")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\{\{([^{}]+)\}\}/g, (_, inner) => ERA_MAP[inner.trim()] ?? inner.trim().replace(/\s+Short$/, ""))
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

function parseTemplateFields(block) {
  const body = block
    .replace(/^\{\{(?:Template:)?[A-Za-z0-9_]*?(?:SpellRow\d*|SongRow)\s*/iu, "")
    .replace(/\}\}\s*$/u, "");

  const fields = {};
  for (const line of body.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(1, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    fields[key] = cleanWikiText(value);
  }
  return fields;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseRows(rawText, pageConfig) {
  const rows = [];
  const lines = rawText.split(/\r?\n/u);
  let currentLevel = null;
  let activeLines = [];
  let activeType = null;
  let depth = 0;

  for (const line of lines) {
    const levelMatch = line.match(/^==Level\s+(\d+)==\s*$/u);
    if (levelMatch) {
      currentLevel = Number(levelMatch[1]);
    }

    const isSpellRow = /^\{\{(?:Template:)?[A-Za-z0-9_]*SpellRow\d*\b/iu.test(line);
    const isSongRow = /^\{\{(?:Template:)?[A-Za-z0-9_]*SongRow\b/iu.test(line);
    if (!activeType && (isSpellRow || isSongRow)) {
      activeLines = [line];
      activeType = isSongRow ? "song" : "spell";
      depth = countMatches(line, /\{\{/gu) - countMatches(line, /\}\}/gu);
      if (depth <= 0) {
        const fields = parseTemplateFields(activeLines.join("\n"));
        rows.push(buildRecord(fields, pageConfig, currentLevel, activeType));
        activeLines = [];
        activeType = null;
        depth = 0;
      }
      continue;
    }

    if (!activeType) continue;

    activeLines.push(line);
    depth += countMatches(line, /\{\{/gu) - countMatches(line, /\}\}/gu);
    if (depth <= 0) {
      const fields = parseTemplateFields(activeLines.join("\n"));
      rows.push(buildRecord(fields, pageConfig, currentLevel, activeType));
      activeLines = [];
      activeType = null;
      depth = 0;
    }
  }

  return rows.filter(Boolean);
}

function buildRecord(fields, pageConfig, currentLevel, kind) {
  const level = kind === "song"
    ? Number.parseInt(fields.level ?? "", 10)
    : currentLevel;

  if (!fields.name || Number.isNaN(level) || level === null) {
    return null;
  }

  const manaValue = kind === "spell" && fields.mana
    ? Number.parseInt(fields.mana, 10)
    : null;

  return {
    id: `${pageConfig.classId}-${level}-${slugify(fields.name)}`,
    name: fields.name,
    classId: pageConfig.classId,
    className: pageConfig.className,
    kind,
    level,
    description: fields.description ?? "",
    era: fields.era ?? "Classic",
    school: kind === "spell" ? (fields.school ?? null) : null,
    location: fields.location ?? "",
    mana: Number.isNaN(manaValue) ? null : manaValue,
    instrument: kind === "song" ? (fields.instrument ?? null) : null,
    pageTitle: pageConfig.pageTitle,
    sourceUrl: `https://wiki.project1999.com/${encodeURIComponent(pageConfig.pageTitle).replace(/%20/g, "_")}`,
  };
}

async function fetchClassPage(pageTitle, attempt = 1) {
  const url = `https://wiki.project1999.com/index.php?title=${encodeURIComponent(pageTitle)}&action=raw`;

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; EQTheoryCraftingBot/1.0)",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${pageTitle}: ${response.status}`);
    }

    return response.text();
  } catch (error) {
    if (attempt >= 4) {
      throw error;
    }

    await delay(400 * attempt);
    return fetchClassPage(pageTitle, attempt + 1);
  }
}

async function main() {
  const allRows = [];

  for (const pageConfig of CLASS_PAGE_CONFIG) {
    console.log(`Fetching ${pageConfig.pageTitle}...`);
    const rawText = await fetchClassPage(pageConfig.pageTitle);
    const rows = parseRows(rawText, pageConfig);
    if (rows.length === 0) {
      throw new Error(`No spell rows found for ${pageConfig.pageTitle}`);
    }
    allRows.push(...rows);
    console.log(`Parsed ${rows.length} rows for ${pageConfig.pageTitle}`);
    await delay(150);
  }

  allRows.sort((left, right) => {
    if (left.classId !== right.classId) return left.classId.localeCompare(right.classId);
    if (left.level !== right.level) return left.level - right.level;
    return left.name.localeCompare(right.name);
  });

  const outputPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../spells.generated.ts"
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    [
      'import type { P99SpellRecord } from "./types";',
      "",
      `const spellRecords: P99SpellRecord[] = ${JSON.stringify(allRows, null, 2)};`,
      "",
      "export default spellRecords;",
      "",
    ].join("\n"),
    "utf8"
  );

  const uniqueSpellNames = new Set(allRows.map((row) => row.name));
  console.log(
    `Wrote ${allRows.length} class spell rows covering ${uniqueSpellNames.size} unique spell names to ${outputPath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
