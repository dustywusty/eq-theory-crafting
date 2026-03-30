export interface AA {
  name: string;
  ranks: number;
  cost: number[]; // cost per rank, e.g. [2,4,6] or [3,3,3]
  description: string;
  era: "Luclin" | "PoP";
  category: "general" | "archetype" | "class";
  /** Which classes have access to this AA */
  classes: string[];
  /** For archetype AAs, which grouping */
  archetype_group?: string;
}

// --- GENERAL AAs (ALL classes) ---

const ALL_CLASSES = ["WAR","PAL","SHD","CLR","DRU","SHM","ENC","MAG","NEC","WIZ","BRD","MNK","RNG","ROG"];

export const GENERAL_AAS: AA[] = [
  { name: "First Aid", ranks: 3, cost: [1,1,1], description: "+10% bind wound cap per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Agility", ranks: 5, cost: [1,1,1,1,1], description: "+2 AGI per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Charisma", ranks: 5, cost: [1,1,1,1,1], description: "+2 CHA per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Cold Protection", ranks: 5, cost: [1,1,1,1,1], description: "+2 SvCold per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Dexterity", ranks: 5, cost: [1,1,1,1,1], description: "+2 DEX per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Disease Protection", ranks: 5, cost: [1,1,1,1,1], description: "+2 SvDisease per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Fire Protection", ranks: 5, cost: [1,1,1,1,1], description: "+2 SvFire per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Intelligence", ranks: 5, cost: [1,1,1,1,1], description: "+2 INT per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Lung Capacity", ranks: 5, cost: [1,1,1,1,1], description: "Increased air supply", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Magic Protection", ranks: 5, cost: [1,1,1,1,1], description: "+2 SvMagic per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Metabolism", ranks: 5, cost: [1,1,1,1,1], description: "Reduced food/drink consumption", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Poison Protection", ranks: 5, cost: [1,1,1,1,1], description: "+2 SvPoison per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Regeneration", ranks: 5, cost: [1,1,1,1,1], description: "+1 HP regen per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Run Speed", ranks: 5, cost: [1,1,1,1,1], description: "Increased base run speed (doesn't stack with spells)", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Stamina", ranks: 5, cost: [1,1,1,1,1], description: "+2 STA per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Strength", ranks: 5, cost: [1,1,1,1,1], description: "+2 STR per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Innate Wisdom", ranks: 5, cost: [1,1,1,1,1], description: "+2 WIS per rank", era: "Luclin", category: "general", classes: ALL_CLASSES },
  { name: "Natural Durability", ranks: 3, cost: [2,4,6], description: "+2/5/10% max HP", era: "Luclin", category: "general", classes: ALL_CLASSES },
  // PoP General
  { name: "Planar Power", ranks: 5, cost: [2,2,2,2,2], description: "+5 stat cap per rank", era: "PoP", category: "general", classes: ALL_CLASSES },
  { name: "Innate Defense", ranks: 5, cost: [3,3,3,3,3], description: "Melee damage mitigation", era: "PoP", category: "general", classes: ALL_CLASSES },
  { name: "Lightning Reflexes", ranks: 5, cost: [3,3,3,3,3], description: "Melee damage avoidance", era: "PoP", category: "general", classes: ALL_CLASSES },
];

// --- ARCHETYPE AAs ---

const MELEE_HYBRID = ["WAR","PAL","SHD","MNK","ROG","RNG","BRD"];
const MANA_CLASSES = ["CLR","DRU","SHM","ENC","MAG","NEC","WIZ","PAL","SHD","RNG","BRD"];
const CASTER_ARCHETYPE = ["BRD","ENC","MAG","NEC","SHD","WIZ"];
const HEALERS = ["CLR","DRU","SHM","PAL","RNG"];
const BUFF_CASTERS = ["CLR","DRU","SHM","ENC","PAL","RNG"];
const TANKS_ONLY = ["WAR","PAL","SHD"];

export const ARCHETYPE_AAS: AA[] = [
  // Universal archetype (all melee/hybrid)
  { name: "Combat Agility", ranks: 3, cost: [2,4,6], description: "+2/5/10% melee avoidance", era: "Luclin", category: "archetype", classes: ALL_CLASSES, archetype_group: "Universal" },
  { name: "Combat Stability", ranks: 3, cost: [2,4,6], description: "+2/5/10% melee mitigation", era: "Luclin", category: "archetype", classes: ALL_CLASSES, archetype_group: "Universal" },

  // Melee/Hybrid archetype
  { name: "Combat Fury", ranks: 3, cost: [2,4,6], description: "Increased melee critical hit chance", era: "Luclin", category: "archetype", classes: MELEE_HYBRID, archetype_group: "Melee" },
  { name: "Fear Resistance", ranks: 3, cost: [2,4,6], description: "+5/10/25% fear resistance + early break", era: "Luclin", category: "archetype", classes: MELEE_HYBRID, archetype_group: "Melee" },
  { name: "Finishing Blow", ranks: 3, cost: [2,4,6], description: "Chance to kill fleeing NPC below 10% HP", era: "Luclin", category: "archetype", classes: MELEE_HYBRID, archetype_group: "Melee" },
  { name: "Natural Healing", ranks: 3, cost: [2,4,6], description: "+1 HP regen per rank", era: "Luclin", category: "archetype", classes: MELEE_HYBRID, archetype_group: "Melee" },
  { name: "Fury of the Ages", ranks: 3, cost: [3,3,3], description: "Further increased melee critical chance", era: "PoP", category: "archetype", classes: MELEE_HYBRID, archetype_group: "Melee" },

  // Mana class archetype
  { name: "Channeling Focus", ranks: 3, cost: [2,4,6], description: "-5/10/15% spell interrupt chance", era: "Luclin", category: "archetype", classes: MANA_CLASSES, archetype_group: "Mana" },
  { name: "Mental Clarity", ranks: 3, cost: [2,4,6], description: "+1 mana regen per rank", era: "Luclin", category: "archetype", classes: MANA_CLASSES, archetype_group: "Mana" },
  { name: "Spell Casting Fury", ranks: 3, cost: [2,4,6], description: "+2/4/7% DD spell critical chance", era: "Luclin", category: "archetype", classes: MANA_CLASSES, archetype_group: "Mana" },
  { name: "Spell Casting Mastery", ranks: 3, cost: [2,4,6], description: "Improved specialization, reduced fizzle, mana savings", era: "Luclin", category: "archetype", classes: ["CLR","DRU","SHM","ENC","MAG","NEC","WIZ","PAL","SHD","RNG"], archetype_group: "Mana" },

  // Caster archetype (specialized casters)
  { name: "Spell Casting Deftness", ranks: 3, cost: [2,4,6], description: "-5/15/25% beneficial spell cast time", era: "Luclin", category: "archetype", classes: CASTER_ARCHETYPE, archetype_group: "Caster" },
  { name: "Spell Casting Expertise", ranks: 3, cost: [2,4,6], description: "No fizzle on spells below level 20/35/52", era: "Luclin", category: "archetype", classes: CASTER_ARCHETYPE, archetype_group: "Caster" },
  { name: "Spell Casting Subtlety", ranks: 3, cost: [2,4,6], description: "-5/10/20% spell aggro", era: "Luclin", category: "archetype", classes: CASTER_ARCHETYPE, archetype_group: "Caster" },
  { name: "Mastery of the Past", ranks: 3, cost: [3,3,3], description: "No fizzle on spells below level 54/56/58", era: "PoP", category: "archetype", classes: CASTER_ARCHETYPE, archetype_group: "Caster" },

  // Healer archetype
  { name: "Healing Adept", ranks: 3, cost: [2,4,6], description: "+2/5/10% healing effectiveness", era: "Luclin", category: "archetype", classes: HEALERS, archetype_group: "Healer" },
  { name: "Healing Gift", ranks: 3, cost: [2,4,6], description: "+3/6/10% chance for critical (double) heal", era: "Luclin", category: "archetype", classes: HEALERS, archetype_group: "Healer" },
  { name: "Advanced Healing Adept", ranks: 3, cost: [2,4,6], description: "+3% healing per rank", era: "PoP", category: "archetype", classes: HEALERS, archetype_group: "Healer" },
  { name: "Advanced Healing Gift", ranks: 3, cost: [2,3,4], description: "+2% critical heal chance per rank", era: "PoP", category: "archetype", classes: HEALERS, archetype_group: "Healer" },

  // Buff caster archetype
  { name: "Spell Casting Reinforcement", ranks: 3, cost: [2,4,6], description: "+5/15/30% beneficial spell duration", era: "Luclin", category: "archetype", classes: BUFF_CASTERS, archetype_group: "Buff" },

  // PoP tank-only
  { name: "Planar Durability", ranks: 3, cost: [3,3,3], description: "+1.5% max HP per rank (tanks only)", era: "PoP", category: "archetype", classes: TANKS_ONLY, archetype_group: "Tank" },

  // PoP caster/priest
  { name: "Innate Enlightenment", ranks: 5, cost: [3,3,3,3,3], description: "+10 INT/WIS cap per rank", era: "PoP", category: "archetype", classes: ["CLR","DRU","SHM","ENC","MAG","NEC","WIZ"], archetype_group: "Mana" },
];

// --- CLASS-SPECIFIC AAs ---
// These include AAs shared by a small number of classes (noted in classes array)

export const CLASS_AAS: AA[] = [
  // WARRIOR
  { name: "Area Taunt", ranks: 1, cost: [5], description: "AE taunt in small radius", era: "Luclin", category: "class", classes: ["WAR"] },
  { name: "Bandage Wound", ranks: 3, cost: [3,6,9], description: "+10/25/50% bandage healing", era: "Luclin", category: "class", classes: ["WAR"] },
  { name: "Flurry", ranks: 3, cost: [3,6,9], description: "Up to 2 extra primary hand attacks per round", era: "Luclin", category: "class", classes: ["WAR"] },
  { name: "Rampage", ranks: 1, cost: [5], description: "Strike everything in melee range", era: "Luclin", category: "class", classes: ["WAR"] },
  { name: "Warcry", ranks: 3, cost: [3,6,9], description: "Group fear immunity 10/20/30 seconds", era: "Luclin", category: "class", classes: ["WAR"] },
  { name: "Raging Flurry", ranks: 3, cost: [2,4,6], description: "Increased Flurry chance on triple attack", era: "PoP", category: "class", classes: ["WAR"] },
  { name: "Tactical Mastery", ranks: 3, cost: [2,3,4], description: "Bypass opponent dodge/block/parry/riposte", era: "PoP", category: "class", classes: ["WAR"] },
  { name: "Stalwart Endurance", ranks: 3, cost: [2,4,6], description: "Resist stunning blows from any angle", era: "PoP", category: "class", classes: ["WAR"] },
  { name: "Furious Rampage", ranks: 3, cost: [2,2,2], description: "-10% Rampage reuse per rank", era: "PoP", category: "class", classes: ["WAR"] },

  // PALADIN
  { name: "Act of Valor", ranks: 1, cost: [3], description: "Transfer all HP to target player, killing yourself", era: "Luclin", category: "class", classes: ["PAL"] },
  { name: "Divine Stun", ranks: 1, cost: [9], description: "Fast-cast interrupt on NPCs level 68 and below", era: "Luclin", category: "class", classes: ["PAL"] },
  { name: "Improved Lay on Hands", ranks: 1, cost: [5], description: "Lay on Hands becomes a complete heal", era: "Luclin", category: "class", classes: ["PAL"] },
  { name: "Holy Steed", ranks: 1, cost: [5], description: "Summon ultimate holy mount", era: "Luclin", category: "class", classes: ["PAL"] },
  { name: "Slay Undead", ranks: 3, cost: [3,6,9], description: "Massively improved crit damage vs undead", era: "Luclin", category: "class", classes: ["PAL"] },
  { name: "Hand of Piety", ranks: 3, cost: [3,3,3], description: "AE group heal 750+250/rank HP", era: "PoP", category: "class", classes: ["PAL"] },
  { name: "Feverent Blessing", ranks: 3, cost: [3,3,3], description: "-12 min/rank Lay on Hands cooldown", era: "PoP", category: "class", classes: ["PAL"] },

  // SHADOW KNIGHT
  { name: "Improved Harm Touch", ranks: 1, cost: [6], description: "Low-resist Harm Touch", era: "Luclin", category: "class", classes: ["SHD"] },
  { name: "Leech Touch", ranks: 1, cost: [6], description: "Harm Touch becomes a lifetap (damage + heal)", era: "Luclin", category: "class", classes: ["SHD"] },
  { name: "Soul Abrasion", ranks: 3, cost: [3,6,9], description: "Increased lifetap proc damage", era: "Luclin", category: "class", classes: ["SHD"] },
  { name: "Unholy Steed", ranks: 1, cost: [5], description: "Summon ultimate unholy mount", era: "Luclin", category: "class", classes: ["SHD"] },
  { name: "Consumption of the Soul", ranks: 3, cost: [3,3,3], description: "+200 damage/heal per rank on Leech Touch", era: "PoP", category: "class", classes: ["SHD"] },
  { name: "Touch of the Wicked", ranks: 3, cost: [2,4,6], description: "-12 min/rank Harm Touch cooldown", era: "PoP", category: "class", classes: ["SHD"] },

  // CLERIC
  { name: "Bestow Divine Aura", ranks: 1, cost: [6], description: "Cast Divine Aura on another player", era: "Luclin", category: "class", classes: ["CLR"] },
  { name: "Celestial Regeneration", ranks: 1, cost: [5], description: "Large free Heal over Time spell", era: "Luclin", category: "class", classes: ["CLR"] },
  { name: "Divine Resurrection", ranks: 1, cost: [5], description: "100% XP resurrection, full HP/mana restore", era: "Luclin", category: "class", classes: ["CLR"] },
  { name: "Purify Soul", ranks: 1, cost: [5], description: "Cure most ailments instantly", era: "Luclin", category: "class", classes: ["CLR"] },
  { name: "Turn Undead", ranks: 3, cost: [3,6,9], description: "30-sec DoT on undead, chance to destroy", era: "Luclin", category: "class", classes: ["CLR"] },
  { name: "Divine Arbitration", ranks: 3, cost: [3,3,3], description: "Balance all group members' HP equally", era: "PoP", category: "class", classes: ["CLR"] },
  { name: "Unfailing Divinity", ranks: 3, cost: [2,4,6], description: "Death pact — second-chance auto-heal on death", era: "PoP", category: "class", classes: ["CLR"] },

  // DRUID
  { name: "Enhanced Root", ranks: 1, cost: [5], description: "-50% root break chance from damage", era: "Luclin", category: "class", classes: ["DRU"] },
  { name: "Spirit of the Wood", ranks: 3, cost: [4,3,2], description: "Group regen + protective shield + thorns", era: "PoP", category: "class", classes: ["DRU"] },
  { name: "Viscid Roots", ranks: 1, cost: [5], description: "Roots much less likely to break", era: "PoP", category: "class", classes: ["DRU"] },
  { name: "Wrath of the Wild", ranks: 3, cost: [3,3,3], description: "Thorn damage shield 350/500/650", era: "PoP", category: "class", classes: ["DRU"] },

  // SHAMAN
  { name: "Cannibalization", ranks: 1, cost: [5], description: "Massive HP-to-mana conversion spell", era: "Luclin", category: "class", classes: ["SHM"] },
  { name: "Rabid Bear", ranks: 1, cost: [5], description: "Transform into bear with boosted offensive stats", era: "Luclin", category: "class", classes: ["SHM"] },
  { name: "Virulent Paralysis", ranks: 3, cost: [3,3,3], description: "Paralyze target mob", era: "PoP", category: "class", classes: ["SHM"] },

  // ENCHANTER
  { name: "Gather Mana", ranks: 1, cost: [5], description: "Recover up to 10,000 mana instantly", era: "Luclin", category: "class", classes: ["ENC"] },
  { name: "Permanent Illusion", ranks: 1, cost: [3], description: "Illusions persist through zoning", era: "Luclin", category: "class", classes: ["ENC"] },
  { name: "Total Domination", ranks: 3, cost: [2,4,6], description: "Stronger charm, less frequent breaks", era: "PoP", category: "class", classes: ["ENC"] },
  { name: "Eldritch Rune", ranks: 3, cost: [3,3,3], description: "Self-only rune absorb shield", era: "PoP", category: "class", classes: ["ENC"] },
  { name: "Project Illusion", ranks: 1, cost: [4], description: "Cast illusion on group members", era: "PoP", category: "class", classes: ["ENC"] },

  // MAGICIAN
  { name: "Elemental Pact", ranks: 1, cost: [5], description: "No component consumption for pet summons", era: "Luclin", category: "class", classes: ["MAG"] },
  { name: "Frenzied Burnout", ranks: 1, cost: [6], description: "Pet berserk buff — massive damage increase", era: "Luclin", category: "class", classes: ["MAG"] },
  { name: "Quick Summoning", ranks: 3, cost: [3,6,9], description: "-10/25/50% summoning cast time", era: "Luclin", category: "class", classes: ["MAG"] },
  { name: "Host of the Elements", ranks: 3, cost: [5,4,3], description: "Summon 5-9 temporary elemental minions", era: "PoP", category: "class", classes: ["MAG"] },
  { name: "Servant of Ro", ranks: 3, cost: [3,3,3], description: "Summon fire-hurling servant for 45-90 seconds", era: "PoP", category: "class", classes: ["MAG"] },

  // NECROMANCER
  { name: "Call to Corpse", ranks: 1, cost: [6], description: "No-component summon corpse", era: "Luclin", category: "class", classes: ["NEC"] },
  { name: "Dead Mesmerization", ranks: 1, cost: [3], description: "AE low-resist mez vs undead", era: "Luclin", category: "class", classes: ["NEC"] },
  { name: "Fearstorm", ranks: 1, cost: [5], description: "AE low-resist fear", era: "Luclin", category: "class", classes: ["NEC"] },
  { name: "Lifeburn", ranks: 1, cost: [9], description: "Non-resistable DD equal to current HP (nearly kills you)", era: "Luclin", category: "class", classes: ["NEC"] },
  { name: "Wake the Dead", ranks: 3, cost: [5,4,3], description: "Summon corpse shade to fight for 60-90 seconds", era: "PoP", category: "class", classes: ["NEC"] },
  { name: "Feigned Minion", ranks: 3, cost: [3,3,3], description: "Pet feign death 25/50/75% success", era: "PoP", category: "class", classes: ["NEC"] },

  // WIZARD
  { name: "Manaburn", ranks: 1, cost: [5], description: "Non-resistable nuke equal to mana pool (cap ~9500)", era: "Luclin", category: "class", classes: ["WIZ"] },
  { name: "Nexus Gate", ranks: 1, cost: [6], description: "Instant self-gate to Nexus", era: "Luclin", category: "class", classes: ["WIZ"] },
  { name: "Strong Root", ranks: 1, cost: [5], description: "Extremely low-resist root spell", era: "Luclin", category: "class", classes: ["WIZ"] },
  { name: "Spell Casting Fury Mastery", ranks: 3, cost: [3,6,9], description: "Further increased DD spell crit chance", era: "Luclin", category: "class", classes: ["WIZ","MAG"] },
  { name: "Harvest of Druzzil", ranks: 1, cost: [2], description: "Mana recovery ability", era: "PoP", category: "class", classes: ["WIZ"] },

  // BARD
  { name: "Extended Notes", ranks: 3, cost: [3,6,9], description: "+10/15/25% song range", era: "Luclin", category: "class", classes: ["BRD"] },
  { name: "Instrument Mastery", ranks: 3, cost: [3,6,9], description: "Improved instrument modifier effectiveness", era: "Luclin", category: "class", classes: ["BRD"] },
  { name: "Jam Fest", ranks: 3, cost: [3,6,9], description: "Sing songs at higher apparent level", era: "Luclin", category: "class", classes: ["BRD"] },
  { name: "Singing Mastery", ranks: 3, cost: [3,6,9], description: "Improved singing voice specialization", era: "Luclin", category: "class", classes: ["BRD"] },
  { name: "Fading Memories", ranks: 1, cost: [6], description: "NPC memory wipe + invisibility", era: "PoP", category: "class", classes: ["BRD"] },
  { name: "Fleet of Foot", ranks: 2, cost: [2,4], description: "Exceptional run speed (fastest in game)", era: "PoP", category: "class", classes: ["BRD"] },
  { name: "Harmonious Attack", ranks: 5, cost: [2,2,2,2,2], description: "Double attack chance per round", era: "PoP", category: "class", classes: ["BRD"] },
  { name: "Sionachie's Crescendo", ranks: 3, cost: [2,2,2], description: "Greater group song range extension", era: "PoP", category: "class", classes: ["BRD"] },

  // MONK
  { name: "Critical Mend", ranks: 3, cost: [3,6,9], description: "5/10/25% chance for superior mend heal", era: "Luclin", category: "class", classes: ["MNK"] },
  { name: "Dragon Punch", ranks: 1, cost: [5], description: "Knockback on Dragon Punch/Tail Rake", era: "Luclin", category: "class", classes: ["MNK"] },
  { name: "Purify Body", ranks: 1, cost: [9], description: "Remove all negative effects (not fear/charm)", era: "Luclin", category: "class", classes: ["MNK"] },
  { name: "Rapid Feign", ranks: 3, cost: [3,6,9], description: "-10/25/50% feign death reuse time", era: "Luclin", category: "class", classes: ["MNK"] },
  { name: "Return Kick", ranks: 3, cost: [3,6,9], description: "25/35/50% bonus flying kick on riposte", era: "Luclin", category: "class", classes: ["MNK"] },
  { name: "Technique of Master Wu", ranks: 5, cost: [2,2,2,2,2], description: "2nd/3rd strike chance on special attacks", era: "PoP", category: "class", classes: ["MNK"] },

  // RANGER
  { name: "Archery Mastery", ranks: 3, cost: [3,6,9], description: "+30/60/100% archery damage", era: "Luclin", category: "class", classes: ["RNG"] },
  { name: "Endless Quiver", ranks: 1, cost: [9], description: "Never-ending arrow supply", era: "Luclin", category: "class", classes: ["RNG"] },
  { name: "Headshot", ranks: 1, cost: [4], description: "Instant kill humanoid below level 46 with bow", era: "PoP", category: "class", classes: ["RNG"] },

  // ROGUE
  { name: "Chaotic Stab", ranks: 1, cost: [6], description: "Backstab from any position (minimum damage)", era: "Luclin", category: "class", classes: ["ROG"] },
  { name: "Escape", ranks: 1, cost: [9], description: "All NPCs forget you + invisibility", era: "Luclin", category: "class", classes: ["ROG"] },
  { name: "Poison Mastery", ranks: 3, cost: [3,6,9], description: "-10/25/50% poison failure, faster apply", era: "Luclin", category: "class", classes: ["ROG"] },
  { name: "Shroud of Stealth", ranks: 1, cost: [6], description: "Hide from see-invis mobs — true stealth", era: "PoP", category: "class", classes: ["ROG"] },
  { name: "Nimble Evasion", ranks: 5, cost: [1,1,1,1,1], description: "Hide/evade while moving", era: "PoP", category: "class", classes: ["ROG"] },

  // SHARED CLASS AAs (appear on multiple class tabs)
  { name: "Ambidexterity", ranks: 1, cost: [9], description: "Increased dual wield success rate", era: "Luclin", category: "class", classes: ["WAR","MNK","ROG","RNG","BRD"] },
  { name: "Double Riposte", ranks: 3, cost: [3,6,9], description: "15/35/50% chance to double riposte", era: "Luclin", category: "class", classes: ["WAR","PAL","SHD","MNK","ROG","RNG"] },
  { name: "Flash of Steel", ranks: 3, cost: [3,3,3], description: "+10% double riposte per rank", era: "PoP", category: "class", classes: ["WAR","PAL","SHD","MNK","ROG","RNG"] },
  { name: "Ferocity", ranks: 3, cost: [3,3,3], description: "Double attack chance per round", era: "PoP", category: "class", classes: ["WAR","MNK","ROG","RNG"] },
  { name: "Punishing Blade", ranks: 3, cost: [2,4,6], description: "Extra hit chance with 2H weapons", era: "PoP", category: "class", classes: ["WAR","MNK","RNG","PAL"] },
  { name: "Acrobatics", ranks: 3, cost: [3,6,9], description: "Reduced falling damage", era: "Luclin", category: "class", classes: ["BRD","MNK","ROG"] },
  { name: "Fearless", ranks: 1, cost: [6], description: "Permanent fear immunity", era: "Luclin", category: "class", classes: ["PAL","SHD"] },
  { name: "Two Hand Bash", ranks: 1, cost: [6], description: "Bash with 2-handed weapons", era: "Luclin", category: "class", classes: ["PAL","SHD"] },
  { name: "Knight's Advantage", ranks: 3, cost: [2,4,6], description: "Double attack chance (knights)", era: "PoP", category: "class", classes: ["PAL","SHD"] },
  { name: "Speed of the Knight", ranks: 3, cost: [3,3,3], description: "Additional 2H weapon attacks", era: "PoP", category: "class", classes: ["PAL","SHD"] },
  { name: "Mass Group Buff", ranks: 1, cost: [9], description: "Next group buff becomes AE (2x mana cost)", era: "Luclin", category: "class", classes: ["CLR","DRU","SHM","ENC","MAG","NEC","PAL","RNG"] },
  { name: "Mend Companion", ranks: 1, cost: [5], description: "Lay on Hands for pet — full pet heal", era: "Luclin", category: "class", classes: ["MAG","NEC","SHM"] },
  { name: "Pet Discipline", ranks: 1, cost: [6], description: "Pet hold command — stop pet from attacking", era: "Luclin", category: "class", classes: ["MAG","NEC","SHD","SHM"] },
  { name: "Suspended Minion", ranks: 2, cost: [5,3], description: "Suspend/recall pet — swap pet types", era: "PoP", category: "class", classes: ["ENC","MAG","NEC","SHM"] },
  { name: "Dire Charm", ranks: 1, cost: [9], description: "Permanently charm target (type varies by class)", era: "Luclin", category: "class", classes: ["DRU","ENC","NEC"] },
  { name: "Exodus", ranks: 1, cost: [6], description: "Instant free evacuation", era: "Luclin", category: "class", classes: ["DRU","WIZ"] },
  { name: "Quick Evacuation", ranks: 3, cost: [3,6,9], description: "-10/25/50% evacuation cast time", era: "Luclin", category: "class", classes: ["DRU","WIZ"] },
  { name: "Quick Damage", ranks: 3, cost: [3,6,9], description: "-2/5/10% direct damage cast time", era: "Luclin", category: "class", classes: ["DRU","MAG","WIZ"] },
  { name: "Innate Camouflage", ranks: 1, cost: [5], description: "At-will self invisibility", era: "Luclin", category: "class", classes: ["DRU","RNG"] },
  { name: "Innate Invis vs Undead", ranks: 1, cost: [3], description: "At-will invis to undead", era: "Luclin", category: "class", classes: ["CLR","NEC"] },
  { name: "Theft of Life", ranks: 3, cost: [1,2,3], description: "Exceptional healing on lifetap spells", era: "PoP", category: "class", classes: ["NEC","SHD"] },
  { name: "Radiant Cure", ranks: 3, cost: [2,4,6], description: "AE group cure (poison, curse, disease, magic)", era: "PoP", category: "class", classes: ["CLR","DRU","SHM","PAL","RNG"] },
  { name: "Spell Casting Reinforcement Mastery", ranks: 1, cost: [8], description: "+20% beneficial buff duration", era: "PoP", category: "class", classes: ["CLR","DRU","ENC","SHM"] },
  { name: "Quick Buff", ranks: 3, cost: [3,6,9], description: "-10/25/50% beneficial spell cast time", era: "Luclin", category: "class", classes: ["ENC","SHM"] },
  { name: "Guardian of the Forest", ranks: 3, cost: [3,3,3], description: "Wolf form with fast melee attacks", era: "PoP", category: "class", classes: ["DRU","RNG"] },
];

export const ALL_AAS = [...GENERAL_AAS, ...ARCHETYPE_AAS, ...CLASS_AAS];

/** Get all AAs available to a specific class */
export function getClassAAs(classId: string): AA[] {
  return ALL_AAS.filter(aa => aa.classes.includes(classId));
}

/** Get AAs that are unique to a specific class (no other class has them) */
export function getUniqueAAs(classId: string): AA[] {
  return ALL_AAS.filter(aa => aa.classes.length === 1 && aa.classes[0] === classId);
}
