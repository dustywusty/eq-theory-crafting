import type {
  KnowledgeRuleset,
  KnowledgeSource,
  KnowledgeSourceId,
  SourcePriorityPolicy,
} from "./types";

export const KNOWLEDGE_SOURCES: Record<KnowledgeSourceId, KnowledgeSource> = {
  "official-everquest-expansions": {
    id: "official-everquest-expansions",
    name: "Official EverQuest Expansion Dates",
    homepage: "https://help.daybreakgames.com/hc/en-us/articles/230631687-Where-can-I-find-a-list-of-EverQuest-launch-expansion-dates",
    authority: "official",
    summary: "Official Daybreak chronology for original EverQuest launch and expansions.",
  },
  "official-everquest-luclin-primer": {
    id: "official-everquest-luclin-primer",
    name: "Official Luclin Progression Primer",
    homepage: "https://www.everquest.com/news/eq-shadows-of-luclin-progression-primer",
    authority: "official",
    summary: "Official overview of Shadows of Luclin and its signature systems, including Alternate Advancement.",
  },
  "project1999-wiki": {
    id: "project1999-wiki",
    name: "Project 1999 Wiki",
    homepage: "https://wiki.project1999.com/",
    authority: "community",
    summary: "Best practical coverage for classic/P99 classes, races, zones, items, quests, and mechanics.",
  },
  eqlfaq: {
    id: "eqlfaq",
    name: "The Unofficial EQ Legends FAQ",
    homepage: "https://eqlfaq.com/",
    authority: "community",
    summary: "Primary companion source for EverQuest Legends-specific launch rules, races, and AA behavior.",
  },
  allakhazam: {
    id: "allakhazam",
    name: "Allakhazam EverQuest Database",
    homepage: "https://everquest.allakhazam.com/",
    authority: "database",
    summary: "Useful secondary database for long-tail item, quest, NPC, spell, and zone details.",
  },
};

export const SOURCE_PRIORITY_POLICIES: SourcePriorityPolicy[] = [
  {
    ruleset: "classic",
    sources: ["project1999-wiki", "official-everquest-expansions", "allakhazam"],
    notes: "Use Project 1999 for day-to-day classic content coverage, then official timelines for dated historical facts.",
  },
  {
    ruleset: "kunark",
    sources: ["project1999-wiki", "official-everquest-expansions", "allakhazam"],
    notes: "Kunark-era facts should stay distinct from original launch-era classic and from Luclin AA-era rules.",
  },
  {
    ruleset: "velious",
    sources: ["project1999-wiki", "official-everquest-expansions", "allakhazam"],
    notes: "Velious still predates AA systems in original EQ timelines.",
  },
  {
    ruleset: "luclin",
    sources: ["official-everquest-luclin-primer", "official-everquest-expansions", "allakhazam", "project1999-wiki"],
    notes: "AA-era questions should start with official Luclin material, then use databases and community references for specifics.",
  },
  {
    ruleset: "pop",
    sources: ["official-everquest-luclin-primer", "allakhazam", "project1999-wiki"],
    notes: "PoP inherits AA-era assumptions; use era-aware sources and avoid back-porting those rules into classic.",
  },
  {
    ruleset: "p99",
    sources: ["project1999-wiki", "allakhazam", "official-everquest-expansions"],
    notes: "Project 1999 is primary for server-specific implementations and omissions.",
  },
  {
    ruleset: "eql",
    sources: ["eqlfaq", "official-everquest-expansions", "project1999-wiki", "allakhazam"],
    notes: "Use EQLFAQ first for Legends-specific overrides, then classic references only where Legends has not diverged.",
  },
  {
    ruleset: "custom-multiclass",
    sources: ["project1999-wiki", "allakhazam", "official-everquest-luclin-primer"],
    notes: "Fallback policy for custom theorycrafting until a server-specific design document exists.",
  },
  {
    ruleset: "live",
    sources: ["official-everquest-expansions", "official-everquest-luclin-primer", "allakhazam"],
    notes: "Live-era answers should start with official materials and current documentation.",
  },
];

export function getSourcePriorityForRuleset(ruleset: KnowledgeRuleset): SourcePriorityPolicy {
  return SOURCE_PRIORITY_POLICIES.find((policy) => policy.ruleset === ruleset) ?? SOURCE_PRIORITY_POLICIES[0];
}
