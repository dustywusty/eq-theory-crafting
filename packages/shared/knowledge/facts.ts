import type {
  KnowledgeDomain,
  KnowledgeFact,
  KnowledgeRuleset,
} from "./types";

export const CORE_KNOWLEDGE_FACTS: KnowledgeFact[] = [
  {
    id: "everquest-classic-launch-date",
    domain: "ruleset",
    subject: "everquest",
    predicate: "launch_date",
    value: "1999-03-16",
    rulesets: ["classic"],
    eras: ["Classic"],
    sourceIds: ["official-everquest-expansions"],
    confidence: "high",
    lastReviewed: "2026-03-30",
    notes: "Use this exact date whenever a user says original or launch-era classic EverQuest.",
  },
  {
    id: "alternate-advancement-introduced-with-luclin",
    domain: "aa",
    subject: "alternate-advancement",
    predicate: "introduced_in",
    value: "Shadows of Luclin",
    rulesets: ["luclin", "pop", "live", "custom-multiclass", "eql"],
    eras: ["Luclin", "PoP", "Modern", "Custom"],
    sourceIds: ["official-everquest-luclin-primer"],
    confidence: "high",
    lastReviewed: "2026-03-30",
    notes: "AA analysis belongs to AA-enabled rulesets, not automatically to original launch-era classic.",
  },
  {
    id: "classic-launch-era-has-no-aa",
    domain: "aa",
    subject: "alternate-advancement",
    predicate: "available_at_launch",
    value: false,
    rulesets: ["classic", "kunark", "velious", "p99"],
    eras: ["Classic", "Kunark", "Velious"],
    sourceIds: ["official-everquest-expansions", "official-everquest-luclin-primer"],
    confidence: "high",
    lastReviewed: "2026-03-30",
    derived: true,
    notes: "Derived from the original 1999 launch timeline and the official Luclin AA introduction note.",
  },
  {
    id: "project1999-wiki-is-community-maintained",
    domain: "mechanic",
    subject: "project1999-wiki",
    predicate: "maintenance_model",
    value: "community-maintained wiki",
    rulesets: ["classic", "kunark", "velious", "p99", "custom-multiclass"],
    eras: ["Classic", "Kunark", "Velious", "Custom"],
    sourceIds: ["project1999-wiki"],
    confidence: "high",
    lastReviewed: "2026-03-30",
    notes: "Treat it as the best practical baseline for classic content, but corroborate edge cases and disputes.",
  },
  {
    id: "eql-launch-window",
    domain: "ruleset",
    subject: "everquest-legends",
    predicate: "launch_target",
    value: "2026-07",
    rulesets: ["eql"],
    eras: ["Custom"],
    sourceIds: ["eqlfaq"],
    confidence: "medium",
    lastReviewed: "2026-03-30",
    notes: "Roadmap-style statement from the FAQ; treat launch timing as subject to change.",
  },
  {
    id: "eql-beta-window",
    domain: "ruleset",
    subject: "everquest-legends",
    predicate: "closed_beta_target",
    value: "2026-04",
    rulesets: ["eql"],
    eras: ["Custom"],
    sourceIds: ["eqlfaq"],
    confidence: "medium",
    lastReviewed: "2026-03-30",
    notes: "Also roadmap-style and likely to move as launch planning changes.",
  },
  {
    id: "eql-launch-races",
    domain: "race",
    subject: "everquest-legends",
    predicate: "launch_races",
    value: [
      "Human",
      "Barbarian",
      "Half-Elf",
      "Wood Elf",
      "High Elf",
      "Dark Elf",
      "Dwarf",
      "Gnome",
      "Erudite",
      "Halfling",
      "Ogre",
      "Troll",
      "Kerran",
      "Iksar",
      "Froglok",
    ],
    rulesets: ["eql"],
    eras: ["Custom"],
    sourceIds: ["eqlfaq"],
    confidence: "high",
    lastReviewed: "2026-03-30",
    notes: "Legends launch race availability diverges from original 1999 launch-era EverQuest.",
  },
  {
    id: "eql-passive-aa-from-level-one",
    domain: "aa",
    subject: "everquest-legends",
    predicate: "passive_aa_available_from_level_1",
    value: true,
    rulesets: ["eql"],
    eras: ["Custom"],
    sourceIds: ["eqlfaq"],
    confidence: "high",
    lastReviewed: "2026-03-30",
    notes: "This is a Legends-specific override and should never be generalized back into classic or P99.",
  },
  {
    id: "eql-active-aa-level-gated",
    domain: "aa",
    subject: "everquest-legends",
    predicate: "active_aa_unlock_model",
    value: "Active AAs unlock at appropriate levels",
    rulesets: ["eql"],
    eras: ["Custom"],
    sourceIds: ["eqlfaq"],
    confidence: "medium",
    lastReviewed: "2026-03-30",
    notes: "The FAQ confirms level-gated active AAs but does not yet publish a full unlock table.",
  },
  {
    id: "eql-kunark-planned-later",
    domain: "ruleset",
    subject: "everquest-legends",
    predicate: "kunark_status",
    value: "planned_later",
    rulesets: ["eql"],
    eras: ["Custom"],
    sourceIds: ["eqlfaq"],
    confidence: "medium",
    lastReviewed: "2026-03-30",
    notes: "The FAQ says Kunark is in the works with dates still to be determined.",
  },
];

export interface KnowledgeFactFilter {
  domain?: KnowledgeDomain;
  ruleset?: KnowledgeRuleset;
  subject?: string;
}

export function filterKnowledgeFacts(filter: KnowledgeFactFilter = {}): KnowledgeFact[] {
  return CORE_KNOWLEDGE_FACTS.filter((fact) => {
    if (filter.domain && fact.domain !== filter.domain) return false;
    if (filter.ruleset && !fact.rulesets.includes(filter.ruleset)) return false;
    if (filter.subject && fact.subject !== filter.subject) return false;
    return true;
  });
}

export function getKnowledgeFactsByRuleset(ruleset: KnowledgeRuleset): KnowledgeFact[] {
  return filterKnowledgeFacts({ ruleset });
}

export function getKnowledgeFactsByDomain(domain: KnowledgeDomain): KnowledgeFact[] {
  return filterKnowledgeFacts({ domain });
}
