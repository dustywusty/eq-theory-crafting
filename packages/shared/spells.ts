import spellRecordsJson from "./spells.generated";
import type { EQSpell, EQSpellClassAccess, P99SpellRecord } from "./types";

const rawSpellRecords = spellRecordsJson as P99SpellRecord[];

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values)].sort((left, right) => left - right);
}

function toSpellId(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortClassAccess(access: EQSpellClassAccess[]): EQSpellClassAccess[] {
  return [...access].sort((left, right) => {
    if (left.level !== right.level) return left.level - right.level;
    return left.classId.localeCompare(right.classId);
  });
}

function buildSpellIndex(records: P99SpellRecord[]): EQSpell[] {
  const byId = new Map<string, EQSpell>();

  for (const record of records) {
    const id = toSpellId(record.name);
    const current = byId.get(id);

    if (!current) {
      byId.set(id, {
        id,
        name: record.name,
        kind: record.kind,
        description: record.description,
        descriptions: [record.description],
        eras: [record.era],
        schools: record.school ? [record.school] : [],
        locations: [record.location],
        manaValues: record.mana === null ? [] : [record.mana],
        instruments: record.instrument ? [record.instrument] : [],
        classAccess: [
          {
            classId: record.classId,
            level: record.level,
            pageTitle: record.pageTitle,
          },
        ],
        sourceUrls: [record.sourceUrl],
      });
      continue;
    }

    current.kind = current.kind === "song" || record.kind === "song" ? "song" : "spell";
    current.descriptions.push(record.description);
    current.eras.push(record.era);
    if (record.school) current.schools.push(record.school);
    current.locations.push(record.location);
    if (record.mana !== null) current.manaValues.push(record.mana);
    if (record.instrument) current.instruments.push(record.instrument);
    current.classAccess.push({
      classId: record.classId,
      level: record.level,
      pageTitle: record.pageTitle,
    });
    current.sourceUrls.push(record.sourceUrl);
  }

  return [...byId.values()]
    .map((spell) => ({
      ...spell,
      description: spell.descriptions[0] ?? "",
      descriptions: uniqueStrings(spell.descriptions),
      eras: uniqueStrings(spell.eras),
      schools: uniqueStrings(spell.schools),
      locations: uniqueStrings(spell.locations),
      manaValues: uniqueNumbers(spell.manaValues),
      instruments: uniqueStrings(spell.instruments),
      classAccess: sortClassAccess(spell.classAccess),
      sourceUrls: uniqueStrings(spell.sourceUrls),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export const P99_SPELL_RECORDS: P99SpellRecord[] = [...rawSpellRecords].sort((left, right) => {
  if (left.classId !== right.classId) return left.classId.localeCompare(right.classId);
  if (left.level !== right.level) return left.level - right.level;
  return left.name.localeCompare(right.name);
});

export const EQ_SPELLS: EQSpell[] = buildSpellIndex(P99_SPELL_RECORDS);

export const EQ_SPELLS_BY_ID: Record<string, EQSpell> = Object.fromEntries(
  EQ_SPELLS.map((spell) => [spell.id, spell])
);

export function getSpellById(spellId: string): EQSpell | undefined {
  return EQ_SPELLS_BY_ID[spellId] ?? EQ_SPELLS_BY_ID[toSpellId(spellId)];
}

export function getSpellsByClass(classId: string): EQSpell[] {
  const normalizedClassId = classId.toUpperCase();
  return EQ_SPELLS.filter((spell) =>
    spell.classAccess.some((access) => access.classId === normalizedClassId)
  );
}

export function searchSpells(query: string): EQSpell[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return EQ_SPELLS;

  return EQ_SPELLS.filter((spell) =>
    spell.name.toLowerCase().includes(normalizedQuery) ||
    spell.description.toLowerCase().includes(normalizedQuery) ||
    spell.classAccess.some((access) => access.classId.toLowerCase().includes(normalizedQuery))
  );
}
