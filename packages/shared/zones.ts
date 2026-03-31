import zoneRecords from "./zones.generated";
import type { EQZone } from "./types";

export const EQ_ZONES: EQZone[] = [...zoneRecords].sort((left, right) =>
  left.name.localeCompare(right.name)
);

export const EQ_ZONES_BY_ID: Record<string, EQZone> = Object.fromEntries(
  EQ_ZONES.map((zone) => [zone.id, zone])
);

export function getZoneById(zoneId: string): EQZone | undefined {
  const normalized = zoneId
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return EQ_ZONES_BY_ID[normalized];
}

export function searchZones(query: string): EQZone[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return EQ_ZONES;

  return EQ_ZONES.filter((zone) => {
    const haystack = [
      zone.name,
      zone.summary,
      zone.era,
      zone.levelRange ?? "",
      zone.monsterTypes.join(" "),
      zone.notableNpcs.join(" "),
      zone.adjacentZones.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
