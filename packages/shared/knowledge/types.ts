export const KNOWLEDGE_RULESETS = [
  "classic",
  "kunark",
  "velious",
  "luclin",
  "pop",
  "p99",
  "eql",
  "custom-multiclass",
  "live",
] as const;

export type KnowledgeRuleset = (typeof KNOWLEDGE_RULESETS)[number];

export const KNOWLEDGE_ERAS = [
  "Classic",
  "Kunark",
  "Velious",
  "Luclin",
  "PoP",
  "Modern",
  "Custom",
] as const;

export type KnowledgeEra = (typeof KNOWLEDGE_ERAS)[number];

export const KNOWLEDGE_DOMAINS = [
  "ruleset",
  "mechanic",
  "class",
  "race",
  "aa",
  "spell",
  "item",
  "zone",
  "quest",
  "faction",
] as const;

export type KnowledgeDomain = (typeof KNOWLEDGE_DOMAINS)[number];

export const KNOWLEDGE_SOURCE_IDS = [
  "official-everquest-expansions",
  "official-everquest-luclin-primer",
  "project1999-wiki",
  "eqlfaq",
  "allakhazam",
] as const;

export type KnowledgeSourceId = (typeof KNOWLEDGE_SOURCE_IDS)[number];

export type KnowledgeConfidence = "high" | "medium" | "low";
export type KnowledgeAuthority = "official" | "community" | "database";

export type KnowledgeValue =
  | string
  | number
  | boolean
  | string[];

export interface KnowledgeSource {
  id: KnowledgeSourceId;
  name: string;
  homepage: string;
  authority: KnowledgeAuthority;
  summary: string;
}

export interface KnowledgeFact {
  id: string;
  domain: KnowledgeDomain;
  subject: string;
  predicate: string;
  value: KnowledgeValue;
  rulesets: KnowledgeRuleset[];
  eras: KnowledgeEra[];
  sourceIds: KnowledgeSourceId[];
  confidence: KnowledgeConfidence;
  lastReviewed: string;
  notes?: string;
  derived?: boolean;
}

export interface SourcePriorityPolicy {
  ruleset: KnowledgeRuleset;
  sources: KnowledgeSourceId[];
  notes: string;
}

export function isKnowledgeRuleset(value: string): value is KnowledgeRuleset {
  return KNOWLEDGE_RULESETS.includes(value as KnowledgeRuleset);
}

export function isKnowledgeDomain(value: string): value is KnowledgeDomain {
  return KNOWLEDGE_DOMAINS.includes(value as KnowledgeDomain);
}
