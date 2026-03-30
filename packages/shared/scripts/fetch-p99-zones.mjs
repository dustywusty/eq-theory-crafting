import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CATEGORY_API = "https://wiki.project1999.com/api.php?action=query&list=categorymembers&cmtitle=Category:Zones&cmtype=page&cmlimit=max&format=json";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanWikiText(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, ", ")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\{\{Loc\|([^|}]+)\|([^}]+)\}\}/g, "$1 $2")
    .replace(/\{\{([^{}]+)\}\}/g, (_, inner) => inner.trim().replace(/\s+Era$/, ""))
    .replace(/'''/g, "")
    .replace(/''/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

function splitList(value) {
  const cleaned = cleanWikiText(value);
  if (!cleaned || cleaned.toLowerCase() === "n/a") return [];
  return cleaned
    .split(/\s*,\s*/u)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function extractZoneTable(rawText) {
  const start = rawText.indexOf('{| class="zoneTopTable"');
  if (start === -1) return null;

  const end = rawText.indexOf("|}", start);
  if (end === -1) return null;

  return rawText.slice(start, end + 2);
}

function normalizeKey(key) {
  return cleanWikiText(key)
    .toLowerCase()
    .replace(/[^a-z0-9/ ]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseZoneFields(rawText) {
  const zoneTable = extractZoneTable(rawText);
  if (!zoneTable) return {};

  const fields = {};
  const lines = zoneTable.split(/\r?\n/u);
  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("!")) {
      currentKey = normalizeKey(trimmed.slice(1));
      continue;
    }

    if (trimmed.startsWith("|") && currentKey && trimmed !== "|-" && !trimmed.startsWith("{|")) {
      fields[currentKey] = cleanWikiText(trimmed.slice(1));
      currentKey = null;
    }
  }

  return fields;
}

function extractSummary(rawText) {
  const beforeZoneTable = rawText.split('{| class="zoneTopTable"')[0] ?? rawText;
  const withoutEra = beforeZoneTable.replace(/\{\{[^}]+ Era\}\}/g, "");
  const summary = cleanWikiText(withoutEra);
  return summary.replace(/\{?\|?rowspan=.*$/u, "").trim();
}

function extractEra(rawText) {
  const eraMatch = rawText.match(/\{\{([^}]+) Era\}\}/u);
  return eraMatch ? eraMatch[1].trim() : "Unknown";
}

async function fetchJson(url, attempt = 1) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; EQTheoryCraftingBot/1.0)" },
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (attempt >= 4) throw error;
    await delay(400 * attempt);
    return fetchJson(url, attempt + 1);
  }
}

async function fetchText(url, attempt = 1) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; EQTheoryCraftingBot/1.0)" },
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch text: ${response.status}`);
    }

    return response.text();
  } catch (error) {
    if (attempt >= 4) throw error;
    await delay(400 * attempt);
    return fetchText(url, attempt + 1);
  }
}

async function fetchZoneTitles() {
  const titles = [];
  let nextUrl = CATEGORY_API;

  while (nextUrl) {
    const payload = await fetchJson(nextUrl);
    const members = payload?.query?.categorymembers ?? [];
    titles.push(...members.map((member) => member.title));

    if (!payload?.continue?.cmcontinue) {
      nextUrl = null;
      continue;
    }

    nextUrl = `${CATEGORY_API}&cmcontinue=${encodeURIComponent(payload.continue.cmcontinue)}`;
  }

  return titles.filter((title) => title !== "Plane of Hate cleanupproject");
}

function buildZoneRecord(title, rawText) {
  const fields = parseZoneFields(rawText);

  return {
    id: slugify(title.replace(/\s+\(Zone\)$/u, "")),
    name: title.replace(/\s+\(Zone\)$/u, ""),
    pageTitle: title,
    era: extractEra(rawText),
    summary: extractSummary(rawText),
    levelRange: fields["level of monsters"] ?? null,
    monsterTypes: splitList(fields["types of monsters"] ?? ""),
    notableNpcs: splitList(fields["notable npcs"] ?? ""),
    uniqueItems: splitList(fields["unique items"] ?? ""),
    relatedQuests: splitList(fields["related quests"] ?? ""),
    adjacentZones: splitList(fields["adjacent zones"] ?? ""),
    whoName: fields["name in /who"] ?? null,
    zoneSpawnTimer: fields["zone spawn timer"] ?? null,
    succorEvac: fields["succor/evacuate"] ?? null,
    zem: fields["zem value"] ?? fields["zem"] ?? null,
    sourceUrl: `https://wiki.project1999.com/${encodeURIComponent(title).replace(/%20/g, "_")}`,
  };
}

async function main() {
  const zoneTitles = await fetchZoneTitles();
  const zones = [];

  for (const title of zoneTitles) {
    console.log(`Fetching ${title}...`);
    const rawText = await fetchText(
      `https://wiki.project1999.com/index.php?title=${encodeURIComponent(title)}&action=raw`
    );
    const zone = buildZoneRecord(title, rawText);
    zones.push(zone);
    await delay(100);
  }

  zones.sort((left, right) => left.name.localeCompare(right.name));

  const outputPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../zones.generated.ts"
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    [
      'import type { EQZone } from "./types";',
      "",
      `const zones: EQZone[] = ${JSON.stringify(zones, null, 2)};`,
      "",
      "export default zones;",
      "",
    ].join("\n"),
    "utf8"
  );

  console.log(`Wrote ${zones.length} zones to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
