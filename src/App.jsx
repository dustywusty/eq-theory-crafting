import { useState } from "react";

const CLASSES = {
  WAR: { name: "Warrior", arch: "Tank", color: "#8B4513", armor: "Plate", mana: false,
    abilities: ["Taunt", "Defensive Discipline", "Evasive Discipline", "Kick/Bash", "Dual Wield", "Riposte"],
    strengths: "Best raw tanking, highest HP, best mitigation disciplines, highest aggro generation",
    weakness: "Zero spells, zero self-healing, completely group-dependent in classic" },
  PAL: { name: "Paladin", arch: "Tank", color: "#DAA520", armor: "Plate", mana: "WIS",
    abilities: ["Lay on Hands", "Stuns", "Heals", "Undead Nukes", "Rez (96%)", "Root", "Buffs"],
    strengths: "Self-healing tank, stuns for aggro and interrupts, undead specialist, resurrection",
    weakness: "Lower DPS than SK, mana-hungry, fewer utility spells, limited races" },
  SHD: { name: "Shadow Knight", arch: "Tank", color: "#4B0082", armor: "Plate", mana: "INT",
    abilities: ["Harm Touch", "Feign Death", "Lifetaps", "Snare", "Fear", "DoTs", "Pet (1)", "Disease Nukes"],
    strengths: "Self-sustaining tank via lifetaps, FD pulling/safety, snare, DoTs add DPS, mini-pet",
    weakness: "Evil-only primary, weaker heals than PAL, mana-hungry early" },
  CLR: { name: "Cleric", arch: "Priest", color: "#FFD700", armor: "Plate", mana: "WIS",
    abilities: ["Complete Heal", "Resurrection (96%)", "HP/AC Buffs", "Root", "Undead Nukes", "Divine Aura", "Summon Hammer"],
    strengths: "Best healer in game, full rez, plate armor, divine aura invuln, summoned hammer has insane proc",
    weakness: "Poor solo, low DPS vs non-undead, one-dimensional without multiclass" },
  DRU: { name: "Druid", arch: "Priest", color: "#228B22", armor: "Leather", mana: "WIS",
    abilities: ["Ports", "SoW", "Snare", "DoTs", "Nukes (fire/ice)", "Heals", "Damage Shield", "Charm Animal", "Evac"],
    strengths: "Teleports, quad-kiting, versatile solo, damage shields, evacuation, snare",
    weakness: "Weaker heals than CLR/SHM, mediocre at everything, no slow, leather armor" },
  SHM: { name: "Shaman", arch: "Priest", color: "#8B0000", armor: "Chain", mana: "WIS",
    abilities: ["Slow (75%)", "Haste", "Stat Buffs (all)", "Cannibalize", "DoTs", "Heals/HoT", "Pet (1)", "SoW", "Shrink"],
    strengths: "SLOW is the best debuff in the game, best stat buffs, canni = infinite mana, self-sufficient",
    weakness: "Slow generates massive aggro, no CC, no rez, chain armor, no burst DPS" },
  ENC: { name: "Enchanter", arch: "Caster", color: "#9370DB", armor: "Cloth", mana: "INT",
    abilities: ["Mesmerize", "Charm", "Haste (spell)", "Clarity (Mana Regen)", "Stuns", "Illusions", "Rune", "Slow (65%)"],
    strengths: "Best CC (mez), Clarity is essential, haste, charm = massive DPS, rune absorbs, minor slow",
    weakness: "Extremely squishy (cloth), charm breaks are deadly, difficult to play, mana-intensive" },
  MAG: { name: "Magician", arch: "Caster", color: "#FF4500", armor: "Cloth", mana: "INT",
    abilities: ["Strong Pet (1)", "Nukes (fire)", "Summon Items", "DS", "Pet Gear", "CoTH", "Mod Rods"],
    strengths: "Best pet class, Call of the Hero summon, mod rods for mana, summoned gear, fire nukes",
    weakness: "Pet-dependent (and 1 pet max across build), cloth, less versatile than NEC" },
  NEC: { name: "Necromancer", arch: "Caster", color: "#2F4F4F", armor: "Cloth", mana: "INT",
    abilities: ["Pet (1)", "Feign Death", "Lifetaps", "DoTs (massive)", "Lich (Mana Regen)", "Summon Corpse", "Fear"],
    strengths: "Best solo class, FD safety, Lich = infinite mana, DoTs are highest sustained DPS, lifetap sustain",
    weakness: "Evil-only primary, DoTs break mezzes (conflicts with ENC), squishy cloth" },
  WIZ: { name: "Wizard", arch: "Caster", color: "#00BFFF", armor: "Cloth", mana: "INT",
    abilities: ["Burst Nukes (highest)", "Ports", "Snare", "Evac", "Root", "AE Nukes"],
    strengths: "Highest burst DPS in the game, teleports, evacuation, AE quad-kiting potential",
    weakness: "Glass cannon, burns through mana fast, one-dimensional, cloth armor" },
  BRD: { name: "Bard", arch: "Melee", color: "#FF69B4", armor: "Plate", mana: false,
    abilities: ["Haste Song", "Mana Regen Song", "HP Regen Song", "Resist Songs", "Selo's (Speed)", "Mez Song", "Swarm Kite", "Pulling"],
    strengths: "Stacking songs cost NO mana, plate armor, insane group utility, best puller, speed",
    weakness: "Master of none individually, song twisting is complex, weak solo DPS" },
  MNK: { name: "Monk", arch: "Melee", color: "#D2691E", armor: "Leather", mana: false,
    abilities: ["Feign Death", "Dual Wield", "Flying Kick", "Mend", "High DPS", "Round Kick", "Tiger Claw"],
    strengths: "Top melee DPS, FD pulling (safest puller), can off-tank, mend self-heal",
    weakness: "Weight penalty on AC, no spells, leather armor only, no utility" },
  RNG: { name: "Ranger", arch: "Melee", color: "#006400", armor: "Chain", mana: "WIS",
    abilities: ["Tracking", "Bow DPS", "Dual Wield", "Minor Heals", "SoW", "Snare", "Harmony", "Trueshot"],
    strengths: "Tracking is huge for finding mobs, archery DPS, some druid utility, Trueshot disc",
    weakness: "Squishy for melee (chain), underpowered in classic, split between too many roles" },
  ROG: { name: "Rogue", arch: "Melee", color: "#696969", armor: "Chain", mana: false,
    abilities: ["Backstab", "Shroud of Stealth (SoS)", "Pick Locks", "Evade", "Poison", "Assassinate"],
    strengths: "Highest sustained melee DPS (backstab), SoS = true invis, pick locks opens content",
    weakness: "Positional DPS (must be behind), no spells, no self-healing, needs a tank" },
};

const RACES = {
  HUM: { name: "Human", traits: "No special traits, no penalties. Widest class access.", classes_primary: ["WAR","PAL","SHD","CLR","DRU","ENC","MAG","MNK","NEC","WIZ","RNG","ROG"] },
  BAR: { name: "Barbarian", traits: "Slam (interrupt), +10 Cold Resist. Large race.", classes_primary: ["WAR","ROG","SHM"] },
  DEF: { name: "Dark Elf", traits: "Ultravision, Hide (50). Evil race.", classes_primary: ["WAR","SHD","CLR","ENC","MAG","NEC","WIZ","ROG"] },
  DWF: { name: "Dwarf", traits: "Infravision, +5 Poison/Magic Resist. Small race.", classes_primary: ["WAR","PAL","CLR","ROG"] },
  ERU: { name: "Erudite", traits: "+5 Magic Resist, -5 Disease Resist. Highest INT.", classes_primary: ["PAL","SHD","CLR","ENC","MAG","NEC","WIZ"] },
  GNM: { name: "Gnome", traits: "Tinkering tradeskill. Small race.", classes_primary: ["WAR","PAL","SHD","CLR","ENC","MAG","NEC","WIZ","ROG"] },
  HEF: { name: "Half Elf", traits: "Infravision.", classes_primary: ["WAR","PAL","DRU","BRD","RNG","ROG"] },
  HFL: { name: "Halfling", traits: "Infravision, Sneak/Hide (50). Small race.", classes_primary: ["WAR","PAL","CLR","DRU","RNG","ROG"] },
  HIE: { name: "High Elf", traits: "Infravision. Good faction everywhere.", classes_primary: ["PAL","CLR","ENC","MAG","WIZ"] },
  WEF: { name: "Wood Elf", traits: "Infravision, Forage.", classes_primary: ["WAR","BRD","DRU","RNG","ROG"] },
  OGR: { name: "Ogre", traits: "\u2605 FRONTAL STUN IMMUNITY \u2605 Slam. Highest STR/STA.", classes_primary: ["WAR","SHD","SHM"] },
  TRL: { name: "Troll", traits: "HP Regeneration, Slam. Evil race.", classes_primary: ["WAR","SHD","SHM"] },
  IKS: { name: "Iksar", traits: "HP Regen, +15\u201335 AC bonus, Forage, Swim 100. Hated everywhere.", classes_primary: ["WAR","SHD","SHM","MNK","NEC"] },
  KER: { name: "Kerran", traits: "New to EQL! Cat folk from Kerra Isle. Details TBD.", classes_primary: ["WAR","SHM","BRD","ROG"] },
  FRG: { name: "Froglok", traits: "Ultravision. New starting area in Rathe Mountains.", classes_primary: ["WAR","PAL","SHD","CLR","SHM","NEC","WIZ","ROG"] },
};

const COMBOS = [
  { id: 1, name: "The Dread Lord", classes: ["SHD", "SHM", "NEC"], race: "IKS", tier: "S",
    summary: "The ultimate self-sufficient killing machine. Tank, slow, infinite mana, triple DoTs.",
    tank: 9, heal: 7, dps: 9, utility: 8, solo: 10,
    synergies: ["SK lifetaps + SHM heals + NEC lifetaps = near-immortal sustain","SHM Slow (75%) makes tanking trivial  incoming damage cut by 3/4","NEC Lich + SHM Canni = you literally never run out of mana","Double Feign Death (SK + NEC)  safest pulling in the game","SHM Haste + stat buffs boost SK melee output enormously","Triple DoT stacking: SK + SHM + NEC DoTs = insane passive DPS","One pet (NEC) adds DPS  EQL 1 pet max","Iksar regen + AC bonus amplifies the already absurd sustain"],
    playstyle: "Pull with SK FD, drop SHM slow, stack all DoTs, lifetap-tank through damage. NEC pet adds DPS. Canni-dance between fights. You are a one-person army that grinds forever. The gold standard for EQL solo.",
    weakness: "No CC (mez), no rez, no ports. Evil race hated everywhere. DoTs prevent mezzing adds  if you get 3+ mobs it's FD or die." },
  { id: 2, name: "The Iron Shaman", classes: ["SHD", "SHM", "MNK"], race: "IKS", tier: "S",
    summary: "The classic EQ power trio  FD pull, slow, hasted fists of fury.",
    tank: 9, heal: 7, dps: 9, utility: 7, solo: 9,
    synergies: ["THE meta 3-box combo in original EQ  proven for 25 years","SHM Slow + SK tank = incoming damage is trivial","MNK Flying Kick + SHM Haste = machine gun melee DPS","Triple FD (SK + MNK both have it) = insanely safe pulling","SHM stat buffs (STR/DEX/AGI) boost MNK and SK damage","SHM Canni keeps mana flowing indefinitely","MNK Mend as emergency self-heal frees SHM for slow/buffs","Iksar regen + AC bonus on plate tanking = fortress"],
    playstyle: "MNK or SK FD-pulls singles. SK tanks with SHM slow. Monk unleashes hasted DPS. SHM patches heals and buffs. The pull-slow-kill rhythm is the platonic ideal of EQ gameplay.",
    weakness: "No CC, no rez, no ports. Zero caster DPS. MNK weight limit. No pet." },
  { id: 3, name: "The Immortal Scholar", classes: ["CLR", "ENC", "NEC"], race: "DEF", tier: "S",
    summary: "Infinite mana, best heals, total crowd control, and charmed slaves doing your bidding.",
    tank: 3, heal: 10, dps: 8, utility: 10, solo: 9,
    synergies: ["NEC Lich + ENC Clarity STACKING = most mana regen possible in the game","CLR Complete Heal + unlimited mana = heal through literally anything","ENC Charm turns enemies into your tank AND DPS  solves 'no tank class'","ENC Mez handles adds while charmed mob and NEC pet fight","CLR 96% Rez means death is a minor setback","NEC FD for emergency escape when charm breaks","CLR Summoned Hammer has incredible damage proc  your best weapon","Dark Elf Hide for scouting, all 3 are valid DE primary classes","ENC Rune absorbs burst damage on cloth armor","WARNING: NEC DoTs BREAK ENC Mez  must be careful with targeting"],
    playstyle: "Charm a powerful mob to tank. Mez everything else. Stack NEC DoTs on kill target ONLY (not mezzed mobs!). Heal your charmed pet with Complete Heal (infinite mana). FD when charm breaks. Rez if things go wrong. The puppet-master build.",
    weakness: "NO SLOW  biggest gap. No plate tank class. Charm breaks are terrifying. Cloth = one-shot potential. DoTs break mez (careful targeting required). High skill ceiling." },
  { id: 4, name: "The Maestro", classes: ["CLR", "BRD", "ENC"], race: "HEF", tier: "A",
    summary: "Every buff, every song, every mez, best heals. The ultimate support fantasy.",
    tank: 3, heal: 10, dps: 5, utility: 10, solo: 6,
    synergies: ["BRD songs + ENC Clarity + ENC Haste = every group buff that exists","Double mez: BRD mez song + ENC mez spell = nothing escapes CC","CLR Complete Heal + BRD HP Regen Song = keep anyone alive forever","BRD songs cost NO mana  all mana goes to heals and CC","BRD Selo's speed + ENC illusions for travel and faction","CLR plate + BRD plate = best armor despite being 'support'","ENC Charm for DPS  charm + haste song + haste spell on charmed mob","Half Elf can be BRD primary, add CLR + ENC as additional"],
    playstyle: "Twist songs, Clarity everyone, mez everything, heal through anything. Solo? Charm a mob, double-haste it, watch it destroy. You're the conductor, not the orchestra.",
    weakness: "Solo DPS is terrible without charm. God-tier support with no personal killing power. Very complex. No slow, no FD." },
  { id: 5, name: "The Venomous Shadow", classes: ["ROG", "SHM", "NEC"], race: "DEF", tier: "S",
    summary: "Hasted backstabs on slowed mobs with infinite mana and a pet tank.",
    tank: 4, heal: 7, dps: 10, utility: 7, solo: 9,
    synergies: ["SHM Haste on a Rogue = backstab frequency goes insane","SHM Slow (75%) + NEC pet tanking = pet takes almost no damage","NEC Lich + SHM Canni = bottomless mana","ROG SoS (true invis) for scouting and positioning","SHM STR/DEX buffs amplify backstab damage and crits","Triple DoTs: SHM + NEC + ROG Poison = passive DPS on top of stabs","NEC FD as emergency escape, ROG Evade to drop aggro","ROG Pick Locks opens dungeon content without keys","Dark Elf Hide stacks with ROG stealth gameplay"],
    playstyle: "Send NEC pet in, SHM slows, stealth behind mob, unleash hasted backstabs. Mobs evaporate. SoS past anything dangerous. Pick every lock. Lich + Canni = zero downtime. The assassin fantasy perfected.",
    weakness: "No real tank class  NEC pet tanks but struggles vs bosses. No CC (mez). No rez. Positional DPS. If pet dies mid-fight you're exposed." },
  { id: 6, name: "The Holy Fortress", classes: ["SHD", "CLR", "ENC"], race: "ERU", tier: "S",
    summary: "Unkillable plate tank + best heals + CC + infinite mana. The complete package.",
    tank: 10, heal: 10, dps: 6, utility: 9, solo: 9,
    synergies: ["SK tank + CLR Complete Heal on yourself = literally immortal","ENC Clarity solves CLR's biggest problem: OOM","ENC Mez handles adds  the gap most SK builds have","ENC Haste makes SK melee faster","SK lifetaps + CLR heals = damage does not stick","CLR 96% Rez means death has zero penalty","ENC Charm for burst DPS when needed","ENC Slow (65%)  not SHM-tier but still massive","CLR Summoned Hammer + ENC haste = solid DPS","Erudite has highest INT, can be SHD/CLR/ENC primary"],
    playstyle: "Pull with SK, tank in plate, mez adds, Complete Heal yourself, charm for DPS. You have answers for everything. The safest, most complete build in the game.",
    weakness: "DPS is the weak point  killing takes a while. No SoW/ports. ENC slow weaker than SHM. Evil SK faction." },
  { id: 7, name: "The Soul Reaper", classes: ["SHD", "SHM", "ROG"], race: "TRL", tier: "A",
    summary: "Maximum melee burst  hasted backstabs behind a slowed, snared target.",
    tank: 8, heal: 7, dps: 10, utility: 6, solo: 8,
    synergies: ["ROG Backstab + SHM Haste = devastating burst melee","SHM Slow + SK tank = safe, controlled fights","SK snare prevents runners, ROG finishes from behind","SHM STR/DEX buffs boost backstab crits","SK lifetaps + SHM heals for sustain","ROG Evade + SK FD for aggro management","ROG SoS for scouting, Pick Locks for dungeons","Troll regen between fights, Slam interrupts casters"],
    playstyle: "SK pulls and snares, SHM slows, position behind mob, unleash hasted backstabs. Mobs melt. SK FD if overpull.",
    weakness: "No CC (mez). No rez. Positional DPS. Troll model huge (SHM Shrink helps)." },
  { id: 8, name: "The Eternal Engine", classes: ["WAR", "CLR", "ENC"], race: "HUM", tier: "A",
    summary: "The 'Holy Trinity'  the foundation every EQ group was built on.",
    tank: 10, heal: 10, dps: 4, utility: 9, solo: 5,
    synergies: ["WAR Defensive Discipline = best mitigation in game","CLR Complete Heal = best healing in game","ENC Clarity solves CLR mana","ENC Mez handles adds safely","ENC Haste makes WAR swing faster","CLR + ENC buffs stack for massive AC/HP","ENC Charm for DPS (only real DPS option)","Human can be all 3 as primary"],
    playstyle: "Hold aggro, chain-heal, mez adds, Clarity/Haste rolling. Charm for DPS. Methodical, safe, slow. How EQ was 'meant' to be played.",
    weakness: "Terrible DPS without charm. No slow. No DoTs. No FD. No ports. Boring if you want action." },
  { id: 9, name: "The Plague Doctor", classes: ["SHM", "NEC", "DRU"], race: "IKS", tier: "A",
    summary: "Triple healer + DoT stacking + snare kiting + infinite mana. Attrition king.",
    tank: 2, heal: 9, dps: 8, utility: 9, solo: 9,
    synergies: ["SHM Slow + DRU Snare = mob can't hit you AND can't catch you","Triple DoTs: SHM + NEC + DRU = absurd passive damage","NEC Lich + SHM Canni + DRU efficiency = infinite casting","Three healing classes = heal through almost anything","DRU Ports + SoW + Evac for travel/escape","DRU Damage Shield adds passive damage on top of DoTs","NEC pet tanks while you kite","NEC FD + DRU Evac = double escape","Iksar regen + triple healing = cockroach survivability"],
    playstyle: "Snare, slow, stack every DoT, kite or let pet tank while everything dies to ticking damage. Port anywhere. You never die and nothing escapes.",
    weakness: "No plate armor, no real tank. DPS is all passive. No CC (mez). Overkill on healing." },
  { id: 10, name: "The Blitz Knight", classes: ["PAL", "BRD", "SHM"], race: "HEF", tier: "A",
    summary: "Plate tank with songs, slow, heals, rez, haste, and speed. Complete paladin.",
    tank: 9, heal: 9, dps: 6, utility: 9, solo: 8,
    synergies: ["PAL stuns + SHM Slow = total control","PAL heals + SHM heals + BRD HP Regen = triple healing","PAL Rez (96%)  recover from any disaster","BRD songs cost NO mana  all mana to heals/buffs","SHM Haste + BRD Haste Song = potential double haste","SHM stat buffs + BRD resist songs = fully buffed always","BRD Selo's for fastest travel without ports","PAL Lay on Hands as emergency full heal","Half Elf can be BRD or PAL primary"],
    playstyle: "Charge in with songs blaring, slow, stun, heal through everything. Selo's between fights. Every buff in Norrath on yourself. The 'good guy' Dread Lord.",
    weakness: "DPS is mediocre. Killing is slow but steady. No FD, no invis." },
  { id: 11, name: "The Arcane Artillery", classes: ["WIZ", "MAG", "ENC"], race: "GNM", tier: "A",
    summary: "Maximum magical firepower  charm tank, nuke everything, port anywhere.",
    tank: 3, heal: 2, dps: 10, utility: 9, solo: 7,
    synergies: ["WIZ burst + MAG fire nukes = highest raw spell DPS possible","ENC Clarity fuels mana-burn playstyle","ENC Charm = your tank (solves no-tank problem)","MAG pet for backup when charm breaks (1 pet max!)","ENC Mez for CC while nuking primary","WIZ Ports + Evac for travel/escape","MAG Mod Rods for emergency mana","MAG CoTH to summon friends","ENC Rune absorbs damage on cloth","Gnome Tinkering for utility items"],
    playstyle: "Charm a mob to tank. Mez adds. Unload every nuke. Things die in seconds. Port to next zone. The glass cannon turned to 11.",
    weakness: "All cloth. No heals, no slow, no tank class. Charm resist = death. Mana burns fast. 1 pet max." },
  { id: 12, name: "The Ogre Wall", classes: ["WAR", "SHM", "CLR"], race: "OGR", tier: "A",
    summary: "Most physically indestructible character possible. Nothing kills you.",
    tank: 10, heal: 10, dps: 4, utility: 6, solo: 6,
    synergies: ["Ogre frontal stun immunity = spells NEVER interrupted","WAR Defensive Disc + SHM Slow = near-zero damage intake","CLR Complete Heal on best tank = immortal","Highest STR/STA race + WAR HP = absurd health pool","SHM Canni + CLR plate = sustain forever","SHM Haste + buffs boost WAR melee","CLR Rez (96%) safety net","CLR Summoned Hammer proc for weapon DPS"],
    playstyle: "Walking castle. Slow everything, tank everything, Complete Heal through everything. Bosses slowly die while you stand unmoving.",
    weakness: "DPS is glacially slow. No CC, no ports, no FD. Huge model. Triple overkill on survival." },
  { id: 13, name: "The Storm Sage", classes: ["DRU", "WIZ", "ENC"], race: "HUM", tier: "B",
    summary: "Max magic firepower with ports everywhere and quad-kiting.",
    tank: 1, heal: 5, dps: 10, utility: 10, solo: 7,
    synergies: ["WIZ burst + DRU nukes = enormous spell DPS","ENC Clarity fuels nuke playstyle","DRU + WIZ ports = go anywhere instantly","DRU Snare + WIZ AE Nukes = quad-kite potential","ENC Mez + DRU Root = battlefield control without tank","DRU DS adds passive damage","ENC Charm for emergency tanking","DRU heals between nuking","DRU Evac + WIZ Evac = double escape"],
    playstyle: "Port anywhere, root/mez everything, nuke to ash. Quad-kite for speed leveling. Charm when you need a tank.",
    weakness: "Cannot take a hit. No tank, no plate, no slow. If root AND mez resist, you're dead." },
  { id: 14, name: "The Dark Disciple", classes: ["MNK", "SHM", "NEC"], race: "IKS", tier: "A",
    summary: "Hasted monk fists + slow + infinite mana + DoTs. Melee DPS king.",
    tank: 5, heal: 7, dps: 10, utility: 7, solo: 9,
    synergies: ["SHM Haste on Monk = fastest melee attack rate in game","SHM Slow + MNK off-tanking = monk CAN tank with slow up","NEC Lich + SHM Canni = never-ending mana","MNK FD + NEC FD = double safety","SHM stat buffs maximize MNK melee output","NEC DoTs + SHM DoTs tick while MNK pummels","NEC pet adds DPS (1 pet but it counts)","NEC lifetaps + SHM heals keep monk alive","Iksar regen + MNK Mend + heals + lifetaps = quad sustain"],
    playstyle: "Pull with FD, slow, haste yourself, unleash a blur of flying kicks while DoTs tick. Trading plate tanking for pure melee destruction.",
    weakness: "Monk in leather, not plate  squishier than SK builds. Weight limit. No CC, no rez, no ports." },
  { id: 15, name: "The Phantom Blade", classes: ["ROG", "SHM", "BRD"], race: "BAR", tier: "A",
    summary: "Songs + slow + hasted backstab + speed + stealth. The dungeon crawler.",
    tank: 3, heal: 6, dps: 9, utility: 8, solo: 7,
    synergies: ["SHM Haste + BRD Haste Song = potential double haste on backstabs","SHM Slow makes any mob safe to backstab behind","BRD songs (mana/HP regen, resists) cost NO mana","ROG SoS + BRD invis song = stealth through anything","ROG Pick Locks + BRD pulling = clear dungeons fast","SHM Canni + BRD mana regen song = good sustain","BRD Selo's = fastest movement in game","SHM stat buffs boost backstab damage","Barbarian Slam interrupts caster mobs"],
    playstyle: "Selo's to the dungeon, stealth past trash, pick the locked door, slow the boss, twist songs, backstab from behind. Speed-run specialist.",
    weakness: "No real tank. No FD. No caster DPS. Barbarian is large but can slam." },
  { id: 16, name: "The Lich King", classes: ["SHD", "CLR", "NEC"], race: "DEF", tier: "S",
    summary: "Plate tank + best heals + infinite mana + DoTs + FD + rez. Every base covered.",
    tank: 10, heal: 10, dps: 7, utility: 7, solo: 9,
    synergies: ["SK tank + CLR Complete Heal = immortal in plate","NEC Lich solves CLR mana problem  heal forever","SK + NEC lifetaps + CLR heals = triple healing","CLR 96% Rez for any disaster","SK + NEC double Feign Death","NEC DoTs + SK DoTs = strong passive DPS while tanking","CLR Summoned Hammer's massive damage proc","Dark Elf Hide for scouting","NEC pet for extra DPS (1 max)"],
    playstyle: "Pull with SK FD, tank in plate, stack DoTs, Complete Heal with unlimited Lich mana. Nothing kills you. If it does, rez. The most defensively complete build with solid DoT DPS.",
    weakness: "No slow (biggest gap), no haste buffs, no CC. Lower DPS ceiling than SHM builds. Evil faction." },
];

function StarRating({ value, max = 10, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <span style={{ width: 56, fontSize: 13, color: "#7a7568", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ width: "100%", height: 6, borderRadius: 2,
            background: i < value ? value >= 9 ? "#c6a44e" : value >= 7 ? "#7a8a6e" : value >= 5 ? "#6a7a8a" : "#8a6a6a" : "rgba(255,255,255,0.06)"
          }} />
        ))}
      </div>
      <span style={{ width: 20, fontSize: 13, color: "#7a7568", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function ClassBadge({ id, small }) {
  const c = CLASSES[id];
  if (!c) return null;
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: small ? "2px 6px" : "3px 10px", borderRadius: 4, fontSize: small ? 12 : 14, background: c.color + "22", color: c.color, border: "1px solid " + c.color + "44", fontWeight: 600, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{small ? id : c.name}</span>);
}

function TierBadge({ tier }) {
  const colors = { S: "#c6a44e", A: "#7a9a6e", B: "#6a8aaa" };
  return (<span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: (colors[tier]||"#666") + "22", color: colors[tier]||"#666", border: "2px solid " + (colors[tier]||"#666") + "66", fontWeight: 800, fontSize: 16, fontFamily: "'Courier New', monospace" }}>{tier}</span>);
}

function RulesBanner() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto 20px", padding: "14px 18px", background: "#4B008211", border: "1px solid #4B008233", borderRadius: 10, fontSize: 14, lineHeight: 1.7, color: "#a09a8a" }}>
      <div style={{ fontSize: 13, color: "#c6a44e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontWeight: 700 }}>EQL Multiclass Rules</div>
      <div style={{ display: "grid", gap: 4 }}>
        <div>Pick <strong style={{ color: "#d4cfbf" }}>3 classes</strong>  use ALL spells, abilities, gear from each</div>
        <div><strong style={{ color: "#d4cfbf" }}>Primary class</strong> is gated by race  additional 2 are free choice</div>
        <div><strong style={{ color: "#d4cfbf" }}>1 pet maximum</strong> per player regardless of pet classes taken</div>
        <div>Classes are <strong style={{ color: "#d4cfbf" }}>not permanent</strong>  swap at major city hubs</div>
        <div><strong style={{ color: "#d4cfbf" }}>15 races</strong> at launch incl. Kerran, Iksar, Froglok</div>
        <div>Designed for <strong style={{ color: "#d4cfbf" }}>solo/small group</strong>  all content soloable</div>
      </div>
    </div>
  );
}

export default function EQMulticlassGuide() {
  const [view, setView] = useState("combos");
  const [sel, setSel] = useState(null);
  const [selClass, setSelClass] = useState(null);
  const [tierF, setTierF] = useState(null);
  const filtered = tierF ? COMBOS.filter(c => c.tier === tierF) : COMBOS;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#c8c4b8", fontFamily: "'Georgia', 'Times New Roman', serif", padding: "24px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 12, letterSpacing: 6, textTransform: "uppercase", color: "#c6a44e88", marginBottom: 4 }}>EverQuest Legends \u2022 July 2026</div>
        <h1 style={{ fontSize: 30, fontWeight: 400, margin: 0, color: "#c6a44e", textShadow: "0 0 40px rgba(198,164,78,0.15)", letterSpacing: 2 }}>Multiclass Theorycrafting</h1>
        <p style={{ fontSize: 14, color: "#7a7568", margin: "6px auto 0", fontStyle: "italic", maxWidth: 520 }}>Pick a race + 3 classes. 560 combinations. All content soloable. {COMBOS.length} builds analyzed.</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ id: "combos", label: "Builds ("+COMBOS.length+")" },{ id: "classes", label: "Classes (14)" },{ id: "races", label: "Races (15)" }].map(t => (
          <button key={t.id} onClick={() => { setView(t.id); setSel(null); setSelClass(null); setTierF(null); }}
            style={{ padding: "8px 18px", border: "1px solid", borderColor: view===t.id?"#c6a44e44":"#ffffff0a", background: view===t.id?"#c6a44e11":"transparent", color: view===t.id?"#c6a44e":"#7a7568", borderRadius: 6, cursor: "pointer", fontSize: 14, fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase" }}>{t.label}</button>
        ))}
      </div>

      {view === "combos" && !sel && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <RulesBanner />
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
            {[null,"S","A","B"].map(t => (
              <button key={t||"all"} onClick={() => setTierF(t)} style={{ padding: "4px 14px", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: "inherit", letterSpacing: 1, background: tierF===t?"#c6a44e22":"transparent", color: tierF===t?"#c6a44e":"#7a7568", border: "1px solid "+(tierF===t?"#c6a44e33":"#ffffff08") }}>{t||"All"}</button>
            ))}
          </div>
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSel(c)} style={{ padding: "12px 16px", marginBottom: 5, borderRadius: 8, background: "#ffffff04", border: "1px solid #ffffff08", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}
              onMouseEnter={e => { e.currentTarget.style.background="#ffffff08"; e.currentTarget.style.borderColor="#c6a44e22"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#ffffff04"; e.currentTarget.style.borderColor="#ffffff08"; }}>
              <TierBadge tier={c.tier} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#d4cfbf" }}>{c.name}</span>
                  <span style={{ fontSize: 13, color: "#7a7568" }}>{RACES[c.race]?.name}</span>
                </div>
                <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>{c.classes.map(cl => <ClassBadge key={cl} id={cl} small />)}</div>
                <p style={{ fontSize: 14, color: "#7a7568", margin: "4px 0 0", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.summary}</p>
              </div>
              <span style={{ color: "#7a756844", fontSize: 18, flexShrink: 0 }}></span>
            </div>
          ))}
        </div>
      )}

      {view === "combos" && sel && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: "#c6a44e", cursor: "pointer", fontSize: 14, fontFamily: "inherit", padding: 0, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>\u2190 Back</button>
          <div style={{ padding: 20, background: "#ffffff04", border: "1px solid #ffffff0a", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <TierBadge tier={sel.tier} />
              <div>
                <h2 style={{ margin: 0, fontSize: 24, color: "#c6a44e", fontWeight: 400 }}>{sel.name}</h2>
                <span style={{ fontSize: 14, color: "#7a7568" }}>{RACES[sel.race]?.name}  {RACES[sel.race]?.traits}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 16, flexWrap: "wrap" }}>{sel.classes.map(cl => <ClassBadge key={cl} id={cl} />)}</div>
            <p style={{ fontSize: 16, color: "#b0aa98", lineHeight: 1.7, margin: "0 0 16px" }}>{sel.summary}</p>
            <div style={{ padding: 12, background: "#ffffff04", borderRadius: 8, marginBottom: 16 }}>
              <StarRating value={sel.tank} label="Tank" /><StarRating value={sel.heal} label="Heal" /><StarRating value={sel.dps} label="DPS" /><StarRating value={sel.utility} label="Util" /><StarRating value={sel.solo} label="Solo" />
            </div>
            <h3 style={{ fontSize: 13, color: "#c6a44e", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>Synergies</h3>
            <div style={{ marginBottom: 16 }}>{sel.synergies.map((s, i) => (
              <div key={i} style={{ padding: "6px 12px", marginBottom: 3, borderRadius: 5, background: "#c6a44e06", borderLeft: "2px solid #c6a44e22", fontSize: 15, color: "#b0aa98", lineHeight: 1.5 }}>{s}</div>
            ))}</div>
            <h3 style={{ fontSize: 13, color: "#c6a44e", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>How to Play</h3>
            <p style={{ fontSize: 15, color: "#b0aa98", lineHeight: 1.7, margin: "0 0 16px", padding: "10px 14px", background: "#ffffff04", borderRadius: 8 }}>{sel.playstyle}</p>
            <h3 style={{ fontSize: 13, color: "#8a5a5a", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>Weaknesses</h3>
            <p style={{ fontSize: 15, color: "#8a7a6a", lineHeight: 1.7, margin: "0 0 18px", padding: "10px 14px", background: "#8a5a5a08", borderRadius: 8, borderLeft: "2px solid #8a5a5a22" }}>{sel.weakness}</p>
            <h3 style={{ fontSize: 13, color: "#c6a44e", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>Class Breakdown</h3>
            {sel.classes.map(cl => { const c = CLASSES[cl]; return (
              <div key={cl} style={{ padding: 12, background: c.color+"08", borderRadius: 8, marginBottom: 5, borderLeft: "3px solid "+c.color+"44" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: c.color, marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "#7a7568", marginBottom: 4 }}>{c.arch}  {c.armor}  {c.mana ? c.mana+" caster" : "No mana"}</div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 4 }}>{c.abilities.map(a => (<span key={a} style={{ fontSize: 12, padding: "2px 6px", background: "#ffffff08", borderRadius: 3, color: "#a09a8a" }}>{a}</span>))}</div>
                <div style={{ fontSize: 14, color: "#9a9484", lineHeight: 1.5 }}>{c.strengths}</div>
              </div>
            ); })}
          </div>
        </div>
      )}

      {view === "classes" && !selClass && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {["Tank","Priest","Caster","Melee"].map(arch => (
            <div key={arch} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#7a7568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, paddingBottom: 4, borderBottom: "1px solid #ffffff08" }}>{arch}s</div>
              {Object.entries(CLASSES).filter(([,c]) => c.arch===arch).map(([id,c]) => (
                <div key={id} onClick={() => setSelClass(id)} style={{ padding: "10px 14px", marginBottom: 3, borderRadius: 8, background: "#ffffff04", border: "1px solid #ffffff06", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background=c.color+"0a"} onMouseLeave={e => e.currentTarget.style.background="#ffffff04"}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><span style={{ fontSize: 16, color: "#d4cfbf" }}>{c.name}</span><span style={{ fontSize: 13, color: "#7a7568", marginLeft: 8 }}>{c.armor}  {c.mana||"No mana"}</span></div>
                  <span style={{ fontSize: 12, color: "#7a7568" }}>In {COMBOS.filter(co => co.classes.includes(id)).length} builds</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {view === "classes" && selClass && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <button onClick={() => setSelClass(null)} style={{ background: "none", border: "none", color: "#c6a44e", cursor: "pointer", fontSize: 14, fontFamily: "inherit", padding: 0, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>\u2190 Back</button>
          {(() => { const c = CLASSES[selClass]; return (
            <div style={{ padding: 20, background: "#ffffff04", border: "1px solid "+c.color+"22", borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: c.color }} /><h2 style={{ margin: 0, fontSize: 24, color: c.color, fontWeight: 400 }}>{c.name}</h2></div>
              <div style={{ fontSize: 14, color: "#7a7568", marginBottom: 12 }}>{c.arch}  {c.armor} Armor  {c.mana ? c.mana+"-based mana" : "No mana pool"}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>{c.abilities.map(a => (<span key={a} style={{ fontSize: 13, padding: "4px 10px", background: c.color+"15", border: "1px solid "+c.color+"22", borderRadius: 4, color: c.color }}>{a}</span>))}</div>
              <div style={{ padding: 12, background: "#ffffff04", borderRadius: 8, marginBottom: 8 }}><div style={{ fontSize: 13, color: "#c6a44e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Strengths</div><p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#b0aa98" }}>{c.strengths}</p></div>
              <div style={{ padding: 12, background: "#8a5a5a08", borderRadius: 8, marginBottom: 14 }}><div style={{ fontSize: 13, color: "#8a5a5a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Weakness</div><p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#8a7a6a" }}>{c.weakness}</p></div>
              <div style={{ fontSize: 13, color: "#7a7568", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Primary class races</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>{Object.entries(RACES).filter(([,r]) => r.classes_primary?.includes(selClass)).map(([rid,r]) => (<span key={rid} style={{ fontSize: 13, padding: "3px 8px", background: "#ffffff08", borderRadius: 4, color: "#a09a8a" }}>{r.name}</span>))}</div>
              <div style={{ fontSize: 13, color: "#7a7568", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Appears in builds</div>
              {COMBOS.filter(co => co.classes.includes(selClass)).map(co => (
                <div key={co.id} onClick={() => { setView("combos"); setSel(co); setSelClass(null); }} style={{ fontSize: 15, color: "#c6a44e", cursor: "pointer", padding: "3px 0", borderBottom: "1px solid #ffffff06" }}>
                  <TierBadge tier={co.tier} /> <span style={{ marginLeft: 8 }}>{co.name}</span><span style={{ color: "#7a7568", marginLeft: 8 }}>({co.classes.map(cl => CLASSES[cl]?.name).join(" + ")})</span>
                </div>
              ))}
            </div>
          ); })()}
        </div>
      )}

      {view === "races" && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <RulesBanner />
          <div style={{ fontSize: 13, color: "#7a7568", marginBottom: 12, textAlign: "center", letterSpacing: 1, textTransform: "uppercase" }}>Primary class is race-gated  additional 2 classes are free choice</div>
          {Object.entries(RACES).map(([rid,r]) => (
            <div key={rid} style={{ padding: "10px 14px", marginBottom: 4, borderRadius: 8, background: "#ffffff04", border: "1px solid #ffffff08" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}><span style={{ fontSize: 16, color: "#d4cfbf", fontWeight: 600 }}>{r.name}</span><span style={{ fontSize: 12, color: "#7a7568" }}>{r.classes_primary?.length} primary</span></div>
              <div style={{ fontSize: 13, color: "#8a8474", marginBottom: 5, lineHeight: 1.4, fontStyle: "italic" }}>{r.traits}</div>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{r.classes_primary?.map(cl => <ClassBadge key={cl} id={cl} small />)}</div>
            </div>
          ))}
          <div style={{ marginTop: 18, padding: 16, background: "#c6a44e08", border: "1px solid #c6a44e15", borderRadius: 10 }}>
            <div style={{ fontSize: 14, color: "#c6a44e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Top Race Picks</div>
            <div style={{ fontSize: 15, color: "#b0aa98", lineHeight: 1.8 }}>
              <strong style={{ color: "#c6a44e" }}>Iksar</strong>  SK/SHM/MNK/NEC/WAR primary. Regen + AC bonus. S-tier melee race.
              <br /><strong style={{ color: "#c6a44e" }}>Ogre</strong>  SK/SHM/WAR primary. Frontal stun immunity is unmatched.
              <br /><strong style={{ color: "#c6a44e" }}>Human</strong>  12 primaries. Only option for many caster multiclass builds.
              <br /><strong style={{ color: "#c6a44e" }}>Dark Elf</strong>  8 primaries incl. SK/CLR/NEC/ENC. Hide racial. Best caster-tank hybrids.
              <br /><strong style={{ color: "#c6a44e" }}>Froglok</strong>  8 primaries incl. PAL/SHD/CLR/SHM. Very flexible new race.
              <br /><strong style={{ color: "#c6a44e" }}>Half Elf</strong>  One of few BRD primary races. Essential for Bard builds.
              <br /><strong style={{ color: "#c6a44e" }}>Remember:</strong> Only primary is race-locked. 2nd and 3rd class can be anything!
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32, padding: "14px 0", borderTop: "1px solid #ffffff08" }}>
        <p style={{ fontSize: 12, color: "#7a756844", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>EverQuest Legends \u2022 Daybreak \u00d7 Game Jawn \u2022 Beta Apr 2026 \u2022 Launch Jul 2026</p>
        <p style={{ fontSize: 12, color: "#7a756844", margin: "3px 0 0" }}>14 Classes  15 Races  560 Combos  1 Pet Max  All Content Soloable</p>
      </div>
    </div>
  );
}