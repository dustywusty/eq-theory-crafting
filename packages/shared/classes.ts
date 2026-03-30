import { EQClass } from "./types";

export const EQ_CLASSES: Record<string, EQClass> = {
  WAR: {
    id: "WAR", name: "Warrior", archetype: "Tank", armor: "Plate", mana_stat: null,
    has_pet: false, has_fd: false, has_ports: false, has_tracking: false,
    color: "#8B4513",
    synergy_tags: ["tank", "plate", "taunt", "disciplines", "highest_hp", "dual_wield", "riposte"],
    anti_synergy: ["no_spells", "no_self_healing", "redundant_with_other_tanks"],
    abilities: ["Taunt", "Defensive Discipline", "Evasive Discipline", "Kick/Bash", "Dual Wield", "Riposte"],
    strengths: "Best raw tanking, highest HP, best mitigation disciplines, highest aggro generation",
    weakness: "Zero spells, zero self-healing, completely group-dependent in classic",
    key_abilities: [
      { name: "Taunt", category: "Tanking", why_it_matters: "Best aggro generation in the game" },
      { name: "Defensive Discipline", category: "Tanking", why_it_matters: "Best damage mitigation ability — absorbs massive damage for 12-15 seconds" },
      { name: "Evasive Discipline", category: "Tanking", why_it_matters: "High avoidance for 12-15 seconds" },
      { name: "Dual Wield", category: "DPS", why_it_matters: "Two weapons = more procs and damage" },
      { name: "Kick/Bash", category: "DPS", why_it_matters: "Interrupt caster mobs, extra damage" }
    ]
  },
  PAL: {
    id: "PAL", name: "Paladin", archetype: "Tank", armor: "Plate", mana_stat: "WIS",
    has_pet: false, has_fd: false, has_ports: false, has_tracking: false,
    color: "#DAA520",
    synergy_tags: ["tank", "plate", "heals", "stuns", "rez", "undead_dps", "lay_on_hands", "root"],
    anti_synergy: ["mana_hungry", "low_dps_vs_non_undead", "limited_races"],
    abilities: ["Lay on Hands", "Stuns", "Heals", "Undead Nukes", "Rez (96%)", "Root", "Buffs"],
    strengths: "Self-healing tank, stuns for aggro and interrupts, undead specialist, resurrection",
    weakness: "Lower DPS than SK, mana-hungry, fewer utility spells, limited races",
    key_abilities: [
      { name: "Lay on Hands", category: "Healing", why_it_matters: "Full heal on 72-min cooldown — emergency button" },
      { name: "Stun line", category: "Tanking", why_it_matters: "Interrupts + generates aggro + brief CC" },
      { name: "Healing spells", category: "Healing", why_it_matters: "Can self-heal while tanking, weaker than CLR/SHM" },
      { name: "Resurrection (96%)", category: "Utility", why_it_matters: "Can rez with 96% XP return" },
      { name: "Undead nuke line", category: "DPS", why_it_matters: "Massive damage vs undead mobs specifically" }
    ]
  },
  SHD: {
    id: "SHD", name: "Shadow Knight", archetype: "Tank", armor: "Plate", mana_stat: "INT",
    has_pet: true, has_fd: true, has_ports: false, has_tracking: false,
    color: "#4B0082",
    synergy_tags: ["tank", "plate", "lifetap", "fd", "snare", "fear", "dots", "pet", "disease_nuke", "harm_touch"],
    anti_synergy: ["evil_only_primary", "mana_hungry_early", "pet_uses_1pet_slot"],
    abilities: ["Harm Touch", "Feign Death", "Lifetaps", "Snare", "Fear", "DoTs", "Pet (1)", "Disease Nukes"],
    strengths: "Self-sustaining tank via lifetaps, FD pulling/safety, snare, DoTs add DPS, mini-pet",
    weakness: "Evil-only primary, weaker heals than PAL, mana-hungry early",
    key_abilities: [
      { name: "Harm Touch", category: "DPS", why_it_matters: "Massive direct damage on 72-min cooldown — great opener" },
      { name: "Feign Death", category: "Utility", why_it_matters: "Drop aggro, safe pulling, escape death. THE defining SK ability." },
      { name: "Lifetap line", category: "Healing", why_it_matters: "Damages enemy and heals you — sustain while tanking" },
      { name: "Darkness/Snare line", category: "Utility", why_it_matters: "Prevents runners, generates aggro, enables fear kiting" },
      { name: "Fear line", category: "CC", why_it_matters: "Fear kiting — mob runs away while you DoT it" },
      { name: "DoT line", category: "DPS", why_it_matters: "Disease and poison DoTs add passive damage while tanking" },
      { name: "Skeleton pet", category: "DPS", why_it_matters: "Weak pet but adds some DPS. Counts toward 1-pet limit." }
    ]
  },
  CLR: {
    id: "CLR", name: "Cleric", archetype: "Priest", armor: "Plate", mana_stat: "WIS",
    has_pet: false, has_fd: false, has_ports: false, has_tracking: false,
    color: "#FFD700",
    synergy_tags: ["heals", "plate", "rez", "buffs_hp_ac", "root", "undead_nuke", "divine_aura", "summoned_hammer"],
    anti_synergy: ["oom_without_clarity_or_lich", "low_dps_vs_non_undead", "poor_solo_without_multiclass"],
    abilities: ["Complete Heal", "Resurrection (96%)", "HP/AC Buffs", "Root", "Undead Nukes", "Divine Aura", "Summon Hammer"],
    strengths: "Best healer in game, full rez, plate armor, divine aura invuln, summoned hammer has insane proc",
    weakness: "Poor solo, low DPS vs non-undead, one-dimensional without multiclass",
    key_abilities: [
      { name: "Complete Heal", category: "Healing", why_it_matters: "THE best heal in the game. Full HP heal, 10 sec cast." },
      { name: "Resurrection (96%)", category: "Utility", why_it_matters: "96% XP return on rez. Required for raiding." },
      { name: "HP/AC Buffs", category: "Buffing", why_it_matters: "Significant HP and AC buffs that stack with other class buffs" },
      { name: "Divine Aura", category: "Tanking", why_it_matters: "Brief invulnerability — emergency survival" },
      { name: "Summon Hammer", category: "DPS", why_it_matters: "Summoned Hammer has insane damage proc that fires almost every swing." },
      { name: "Root", category: "CC", why_it_matters: "Pins mobs in place. Breaks on damage but useful for control." },
      { name: "Undead nuke line", category: "DPS", why_it_matters: "Strong damage vs undead specifically" }
    ]
  },
  DRU: {
    id: "DRU", name: "Druid", archetype: "Priest", armor: "Leather", mana_stat: "WIS",
    has_pet: false, has_fd: false, has_ports: true, has_tracking: false,
    color: "#228B22",
    synergy_tags: ["heals", "ports", "sow", "snare", "dots", "nukes_fire_ice", "damage_shield", "charm_animal", "evac", "root"],
    anti_synergy: ["no_slow", "leather_armor", "mediocre_heals", "jack_of_all_trades"],
    abilities: ["Ports", "SoW", "Snare", "DoTs", "Nukes (fire/ice)", "Heals", "Damage Shield", "Charm Animal", "Evac"],
    strengths: "Teleports, quad-kiting, versatile solo, damage shields, evacuation, snare",
    weakness: "Weaker heals than CLR/SHM, mediocre at everything, no slow, leather armor",
    key_abilities: [
      { name: "Teleport spells", category: "Utility", why_it_matters: "Instant travel across Norrath. Huge quality of life." },
      { name: "Spirit of Wolf (SoW)", category: "Utility", why_it_matters: "30-40% run speed buff. One of the most desired buffs." },
      { name: "Snare", category: "CC", why_it_matters: "Slows mob movement speed. Essential for kiting." },
      { name: "Fire/Ice nukes", category: "DPS", why_it_matters: "Respectable direct damage. Enables quad-kiting." },
      { name: "Damage Shield", category: "DPS", why_it_matters: "Passive damage to anything that hits you." },
      { name: "Charm Animal", category: "CC", why_it_matters: "Charm animal-type mobs as temporary pets/tanks" },
      { name: "Evacuation", category: "Utility", why_it_matters: "Emergency group teleport to zone line." },
      { name: "Healing spells", category: "Healing", why_it_matters: "Decent heals but weaker than CLR and SHM" }
    ]
  },
  SHM: {
    id: "SHM", name: "Shaman", archetype: "Priest", armor: "Chain", mana_stat: "WIS",
    has_pet: true, has_fd: false, has_ports: false, has_tracking: false,
    color: "#8B0000",
    synergy_tags: ["heals", "slow_75", "haste", "stat_buffs_all", "canni", "dots", "hot", "pet", "sow", "shrink", "debuffs"],
    anti_synergy: ["slow_aggro_is_huge", "no_cc_mez", "no_rez", "chain_armor", "pet_uses_1pet_slot"],
    abilities: ["Slow (75%)", "Haste", "Stat Buffs (all)", "Cannibalize", "DoTs", "Heals/HoT", "Pet (1)", "SoW", "Shrink"],
    strengths: "SLOW is the best debuff in the game, best stat buffs, canni = infinite mana, self-sufficient",
    weakness: "Slow generates massive aggro, no CC, no rez, chain armor, no burst DPS",
    key_abilities: [
      { name: "Slow (Turgur's Insects)", category: "Debuff", why_it_matters: "THE MOST IMPORTANT DEBUFF. Reduces mob attack speed by up to 75%." },
      { name: "Haste (Alacrity/Celerity)", category: "Buffing", why_it_matters: "Increases attack speed. Critical for melee DPS classes." },
      { name: "Stat Buffs", category: "Buffing", why_it_matters: "Buffs ALL physical stats. Premier buffing class." },
      { name: "Cannibalize", category: "Mana Regen", why_it_matters: "Converts HP to mana. Combined with regen = effectively infinite mana." },
      { name: "Heal/HoT line", category: "Healing", why_it_matters: "Direct heals + Heal over Time. Not as strong as CLR but serviceable." }
    ]
  },
  ENC: {
    id: "ENC", name: "Enchanter", archetype: "Caster", armor: "Cloth", mana_stat: "INT",
    has_pet: false, has_fd: false, has_ports: false, has_tracking: false,
    color: "#9370DB",
    synergy_tags: ["mez", "charm", "haste_spell", "clarity_mana_regen", "stuns", "illusions", "rune", "slow_65", "buffs"],
    anti_synergy: ["cloth_armor", "charm_breaks_deadly", "hard_to_play", "mana_intensive"],
    abilities: ["Mesmerize", "Charm", "Haste (spell)", "Clarity (Mana Regen)", "Stuns", "Illusions", "Rune", "Slow (65%)"],
    strengths: "Best CC (mez), Clarity is essential, haste, charm = massive DPS, rune absorbs, minor slow",
    weakness: "Extremely squishy (cloth), charm breaks are deadly, difficult to play, mana-intensive",
    key_abilities: [
      { name: "Mesmerize", category: "CC", why_it_matters: "THE crowd control spell. Puts mobs to sleep. Breaks on damage." },
      { name: "Charm", category: "CC/DPS", why_it_matters: "Takes control of an enemy mob. Highest DPS source available." },
      { name: "Clarity line", category: "Mana Regen", why_it_matters: "Massive mana regeneration buff. Stacks with Lich." },
      { name: "Haste (Augmentation)", category: "Buffing", why_it_matters: "Spell-based haste for melee classes." },
      { name: "Rune line", category: "Buffing", why_it_matters: "Absorbs X damage before fading. Critical for cloth builds." },
      { name: "Slow (65%)", category: "Debuff", why_it_matters: "ENC slow caps at ~65%, weaker than SHM's 75%, but still massive." }
    ]
  },
  MAG: {
    id: "MAG", name: "Magician", archetype: "Caster", armor: "Cloth", mana_stat: "INT",
    has_pet: true, has_fd: false, has_ports: false, has_tracking: false,
    color: "#FF4500",
    synergy_tags: ["strong_pet", "nukes_fire", "summon_items", "ds", "pet_gear", "coth", "mod_rods"],
    anti_synergy: ["pet_uses_1pet_slot_critical", "cloth_armor", "pet_dependent"],
    abilities: ["Strong Pet (1)", "Nukes (fire)", "Summon Items", "DS", "Pet Gear", "CoTH", "Mod Rods"],
    strengths: "Best pet class, Call of the Hero summon, mod rods for mana, summoned gear, fire nukes",
    weakness: "Pet-dependent (and 1 pet max across build), cloth, less versatile than NEC",
    key_abilities: [
      { name: "Earth/Water/Air/Fire Pet", category: "Pet", why_it_matters: "Best pets in the game. Earth pet can tank." },
      { name: "Fire nukes", category: "DPS", why_it_matters: "Strong direct damage nukes" },
      { name: "Call of the Hero (CoTH)", category: "Utility", why_it_matters: "Summons any player to your location." },
      { name: "Mod Rods", category: "Utility", why_it_matters: "Summoned rods that convert HP to mana." },
      { name: "Damage Shield", category: "DPS", why_it_matters: "Passive damage to attackers. Stacks with DRU DS." }
    ]
  },
  NEC: {
    id: "NEC", name: "Necromancer", archetype: "Caster", armor: "Cloth", mana_stat: "INT",
    has_pet: true, has_fd: true, has_ports: false, has_tracking: false,
    color: "#2F4F4F",
    synergy_tags: ["pet", "fd", "lifetap", "dots_massive", "lich_mana_regen", "summon_corpse", "fear", "snare"],
    anti_synergy: ["evil_only_primary", "dots_break_mez", "cloth_armor", "pet_uses_1pet_slot"],
    abilities: ["Pet (1)", "Feign Death", "Lifetaps", "DoTs (massive)", "Lich (Mana Regen)", "Summon Corpse", "Fear"],
    strengths: "Best solo class, FD safety, Lich = infinite mana, DoTs are highest sustained DPS, lifetap sustain",
    weakness: "Evil-only primary, DoTs break mezzes (conflicts with ENC), squishy cloth",
    key_abilities: [
      { name: "Lich line", category: "Mana Regen", why_it_matters: "Converts HP to massive mana regen. THE defining NEC ability. Stacks with Clarity." },
      { name: "Feign Death", category: "Utility", why_it_matters: "Drop all aggro. Emergency escape + safe pulling." },
      { name: "DoT line", category: "DPS", why_it_matters: "Highest sustained DPS in the game via DoTs. Multiple stacking lines." },
      { name: "Lifetap line", category: "Healing", why_it_matters: "Damages enemy, heals you. Sustain while soloing." },
      { name: "Pet", category: "Pet", why_it_matters: "Strong undead pet. Can tank reasonably well." },
      { name: "Fear", category: "CC", why_it_matters: "Fear kiting — mob runs away while your DoTs kill it" }
    ]
  },
  WIZ: {
    id: "WIZ", name: "Wizard", archetype: "Caster", armor: "Cloth", mana_stat: "INT",
    has_pet: false, has_fd: false, has_ports: true, has_tracking: false,
    color: "#00BFFF",
    synergy_tags: ["burst_nukes_highest", "ports", "snare", "evac", "root", "ae_nukes"],
    anti_synergy: ["glass_cannon", "mana_hog", "one_dimensional", "cloth_armor"],
    abilities: ["Burst Nukes (highest)", "Ports", "Snare", "Evac", "Root", "AE Nukes"],
    strengths: "Highest burst DPS in the game, teleports, evacuation, AE quad-kiting potential",
    weakness: "Glass cannon, burns through mana fast, one-dimensional, cloth armor",
    key_abilities: [
      { name: "Direct Damage nukes", category: "DPS", why_it_matters: "Highest burst DPS in the game. Period." },
      { name: "AE Nukes", category: "DPS", why_it_matters: "Area effect damage. Enables quad-kiting." },
      { name: "Teleport spells", category: "Utility", why_it_matters: "Ports to various locations." },
      { name: "Evacuation", category: "Utility", why_it_matters: "Emergency zone-line teleport" },
      { name: "Root", category: "CC", why_it_matters: "Pin mob in place. Root-rot strategy." }
    ]
  },
  BRD: {
    id: "BRD", name: "Bard", archetype: "Melee", armor: "Plate", mana_stat: null,
    has_pet: false, has_fd: false, has_ports: false, has_tracking: false,
    color: "#FF69B4",
    synergy_tags: ["haste_song", "mana_regen_song", "hp_regen_song", "resist_songs", "selos_speed", "mez_song", "swarm_kite", "pulling", "plate", "no_mana_cost"],
    anti_synergy: ["weak_solo_dps", "master_of_none", "song_twisting_complex", "limited_primary_races"],
    abilities: ["Haste Song", "Mana Regen Song", "HP Regen Song", "Resist Songs", "Selo's (Speed)", "Mez Song", "Swarm Kite", "Pulling"],
    strengths: "Stacking songs cost NO mana, plate armor, insane group utility, best puller, speed",
    weakness: "Master of none individually, song twisting is complex, weak solo DPS",
    key_abilities: [
      { name: "Song Twisting", category: "Core Mechanic", why_it_matters: "Songs are short-duration buffs that must be continuously recast. Songs cost NO MANA." },
      { name: "Haste Song", category: "Buffing", why_it_matters: "Attack speed buff via song." },
      { name: "Mana Regen Song", category: "Buffing", why_it_matters: "Mana regeneration for you and nearby allies" },
      { name: "Selo's Accelerando", category: "Utility", why_it_matters: "Fastest movement speed buff in the game." },
      { name: "Mez Song", category: "CC", why_it_matters: "AE mez via song. Less reliable than ENC mez but no mana cost." }
    ]
  },
  MNK: {
    id: "MNK", name: "Monk", archetype: "Melee", armor: "Leather", mana_stat: null,
    has_pet: false, has_fd: true, has_ports: false, has_tracking: false,
    color: "#D2691E",
    synergy_tags: ["top_melee_dps", "fd", "dual_wield", "flying_kick", "mend", "off_tank"],
    anti_synergy: ["weight_limit_ac_penalty", "no_spells", "leather_armor", "no_utility"],
    abilities: ["Feign Death", "Dual Wield", "Flying Kick", "Mend", "High DPS", "Round Kick", "Tiger Claw"],
    strengths: "Top melee DPS, FD pulling (safest puller), can off-tank, mend self-heal",
    weakness: "Weight penalty on AC, no spells, leather armor only, no utility",
    key_abilities: [
      { name: "Feign Death", category: "Utility", why_it_matters: "MNK is traditionally the best puller because of FD + high movement speed." },
      { name: "Flying Kick", category: "DPS", why_it_matters: "Highest damage monk special attack. Spammable." },
      { name: "Dual Wield", category: "DPS", why_it_matters: "Two weapons = more damage and proc opportunities" },
      { name: "Mend", category: "Healing", why_it_matters: "Self-heal on a timer. Not great but helps between fights." }
    ]
  },
  RNG: {
    id: "RNG", name: "Ranger", archetype: "Melee", armor: "Chain", mana_stat: "WIS",
    has_pet: false, has_fd: false, has_ports: false, has_tracking: true,
    color: "#006400",
    synergy_tags: ["tracking", "bow_dps", "dual_wield", "minor_heals", "sow", "snare", "harmony", "trueshot"],
    anti_synergy: ["squishy_for_melee", "underpowered_classic", "split_roles"],
    abilities: ["Tracking", "Bow DPS", "Dual Wield", "Minor Heals", "SoW", "Snare", "Harmony", "Trueshot"],
    strengths: "Tracking is huge for finding mobs, archery DPS, some druid utility, Trueshot disc",
    weakness: "Squishy for melee (chain), underpowered in classic, split between too many roles",
    key_abilities: [
      { name: "Tracking", category: "Utility", why_it_matters: "Find specific mobs in the zone. Huge for hunting named/rare spawns." },
      { name: "Archery/Trueshot", category: "DPS", why_it_matters: "Ranged DPS. Trueshot discipline massively boosts bow damage." },
      { name: "Harmony", category: "CC", why_it_matters: "Reduces aggro radius of mobs. Enables single-pulling." }
    ]
  },
  ROG: {
    id: "ROG", name: "Rogue", archetype: "Melee", armor: "Chain", mana_stat: null,
    has_pet: false, has_fd: false, has_ports: false, has_tracking: false,
    color: "#696969",
    synergy_tags: ["backstab", "sos_true_invis", "pick_locks", "evade", "poison", "assassinate", "highest_melee_dps"],
    anti_synergy: ["positional_dps_behind_only", "no_spells", "no_self_healing", "needs_a_tank"],
    abilities: ["Backstab", "Shroud of Stealth (SoS)", "Pick Locks", "Evade", "Poison", "Assassinate"],
    strengths: "Highest sustained melee DPS (backstab), SoS = true invis, pick locks opens content",
    weakness: "Positional DPS (must be behind), no spells, no self-healing, needs a tank",
    key_abilities: [
      { name: "Backstab", category: "DPS", why_it_matters: "Highest sustained melee DPS ability. MUST be behind the target." },
      { name: "Shroud of Stealth (SoS)", category: "Utility", why_it_matters: "True invisibility that even see-invis mobs can't detect." },
      { name: "Pick Locks", category: "Utility", why_it_matters: "Open locked doors/chests without keys." },
      { name: "Evade", category: "Utility", why_it_matters: "Dump aggro instantly." }
    ]
  }
};
