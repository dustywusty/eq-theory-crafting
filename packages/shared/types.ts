export interface EQClass {
  id: string;
  name: string;
  archetype: "Tank" | "Priest" | "Caster" | "Melee";
  armor: "Plate" | "Chain" | "Leather" | "Cloth";
  mana_stat: "INT" | "WIS" | null;
  has_pet: boolean;
  has_fd: boolean;
  has_ports: boolean;
  has_tracking: boolean;
  color: string;
  synergy_tags: string[];
  anti_synergy: string[];
  abilities: string[];
  strengths: string;
  weakness: string;
  key_abilities: {
    name: string;
    category: string;
    why_it_matters: string;
  }[];
}

export interface EQRace {
  id: string;
  name: string;
  size: "Small" | "Medium" | "Large";
  alignment: "Good" | "Neutral" | "Evil";
  traits: string;
  classes_primary: string[];
  base_stats?: {
    str: number; sta: number; agi: number;
    dex: number; wis: number; int: number; cha: number;
  };
}

export interface ComboRatings {
  tank: number;
  heal: number;
  dps: number;
  utility: number;
  solo: number;
}

export interface Combo {
  id: number;
  name: string;
  classes: [string, string, string];
  race: string;
  tier: "S" | "A" | "B" | "C";
  summary: string;
  synergies: string[];
  playstyle: string;
  weakness: string;
  ratings: ComboRatings;
  created_at?: string;
  updated_at?: string;
}

export interface SynergyRule {
  id: string;
  description: string;
  implication: string;
}

export interface AAOverlapSummary {
  totalUniqueAAs: number;
  totalRawAAs: number;
  overlapCount: number;
  overlapPercent: number;
  archetypeCoverage: string[];
  aaEfficiency: number;
  overlapAnalysis: string;
  /** Key unique AAs each class brings */
  keyUniqueAAs: { classId: string; aas: string[] }[];
  /** AAs shared by all 3 classes (wasted) */
  sharedBy3: string[];
  /** AAs shared by exactly 2 classes */
  sharedBy2: string[];
  /** AAs exclusive to each class in this combo */
  exclusiveAAs: { classId: string; aas: string[] }[];
}

export interface EQSpellClassAccess {
  classId: string;
  level: number;
  pageTitle: string;
}

export interface P99SpellRecord {
  id: string;
  name: string;
  classId: string;
  className: string;
  kind: "spell" | "song";
  level: number;
  description: string;
  era: string;
  school: string | null;
  location: string;
  mana: number | null;
  instrument: string | null;
  pageTitle: string;
  sourceUrl: string;
}

export interface EQSpell {
  id: string;
  name: string;
  kind: "spell" | "song";
  description: string;
  descriptions: string[];
  eras: string[];
  schools: string[];
  locations: string[];
  manaValues: number[];
  instruments: string[];
  classAccess: EQSpellClassAccess[];
  sourceUrls: string[];
}

export interface EQZone {
  id: string;
  name: string;
  pageTitle: string;
  era: string;
  summary: string;
  levelRange: string | null;
  monsterTypes: string[];
  notableNpcs: string[];
  uniqueItems: string[];
  relatedQuests: string[];
  adjacentZones: string[];
  whoName: string | null;
  zoneSpawnTimer: string | null;
  succorEvac: string | null;
  zem: string | null;
  sourceUrl: string;
  mapImageUrl: string | null;
  mapLocations: string[];
  dangers: string;
  benefits: string;
  travelInfo: string;
}

export interface EvaluationResult {
  ratings: ComboRatings;
  synergies: string[];
  anti_synergies: string[];
  warnings: string[];
  suggested_races: string[];
  missing: string[];
  aa?: AAOverlapSummary;
}
