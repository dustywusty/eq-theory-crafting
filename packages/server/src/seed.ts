import "dotenv/config";
import { db } from "./db";
import { combos } from "./db/schema";

const SEED_COMBOS = [
  { name: "The Dread Lord", class1: "SHD", class2: "SHM", class3: "NEC", race: "IKS", tier: "S",
    summary: "The ultimate self-sufficient killing machine. Tank, slow, infinite mana, triple DoTs.",
    tank: 9, heal: 7, dps: 9, utility: 8, solo: 10,
    synergies: ["SK lifetaps + SHM heals + NEC lifetaps = near-immortal sustain","SHM Slow (75%) makes tanking trivial","NEC Lich + SHM Canni = you literally never run out of mana","Double Feign Death (SK + NEC)","SHM Haste + stat buffs boost SK melee output","Triple DoT stacking: SK + SHM + NEC DoTs","Iksar regen + AC bonus amplifies sustain"],
    playstyle: "Pull with SK FD, drop SHM slow, stack all DoTs, lifetap-tank through damage. NEC pet adds DPS. Canni-dance between fights.",
    weakness: "No CC (mez), no rez, no ports. Evil race hated everywhere. DoTs prevent mezzing adds." },
  { name: "The Iron Shaman", class1: "SHD", class2: "SHM", class3: "MNK", race: "IKS", tier: "S",
    summary: "The classic EQ power trio — FD pull, slow, hasted fists of fury.",
    tank: 9, heal: 7, dps: 9, utility: 7, solo: 9,
    synergies: ["THE meta 3-box combo in original EQ","SHM Slow + SK tank = trivial incoming damage","MNK Flying Kick + SHM Haste = machine gun melee DPS","Triple FD (SK + MNK)","SHM stat buffs boost MNK and SK damage","SHM Canni keeps mana flowing","Iksar regen + AC bonus on plate tanking"],
    playstyle: "MNK or SK FD-pulls singles. SK tanks with SHM slow. Monk unleashes hasted DPS. SHM patches heals and buffs.",
    weakness: "No CC, no rez, no ports. Zero caster DPS. MNK weight limit. No pet." },
  { name: "The Immortal Scholar", class1: "CLR", class2: "ENC", class3: "NEC", race: "DEF", tier: "S",
    summary: "Infinite mana, best heals, total crowd control, and charmed slaves doing your bidding.",
    tank: 3, heal: 10, dps: 8, utility: 10, solo: 9,
    synergies: ["NEC Lich + ENC Clarity STACKING = most mana regen possible","CLR Complete Heal + unlimited mana = heal through anything","ENC Charm turns enemies into your tank AND DPS","ENC Mez handles adds","CLR 96% Rez","NEC FD for emergency escape","CLR Summoned Hammer incredible damage proc","WARNING: NEC DoTs BREAK ENC Mez"],
    playstyle: "Charm a powerful mob to tank. Mez everything else. Stack NEC DoTs on kill target ONLY. Heal your charmed pet with Complete Heal. FD when charm breaks.",
    weakness: "NO SLOW. No plate tank class. Charm breaks are terrifying. Cloth = one-shot potential. DoTs break mez." },
  { name: "The Holy Fortress", class1: "SHD", class2: "CLR", class3: "ENC", race: "ERU", tier: "S",
    summary: "Unkillable plate tank + best heals + CC + infinite mana. The complete package.",
    tank: 10, heal: 10, dps: 6, utility: 9, solo: 9,
    synergies: ["SK tank + CLR Complete Heal = literally immortal","ENC Clarity solves CLR's biggest problem: OOM","ENC Mez handles adds","SK lifetaps + CLR heals = damage does not stick","CLR 96% Rez","ENC Charm for burst DPS","ENC Slow (65%)","CLR Summoned Hammer + ENC haste"],
    playstyle: "Pull with SK, tank in plate, mez adds, Complete Heal yourself, charm for DPS. You have answers for everything.",
    weakness: "DPS is the weak point. No SoW/ports. ENC slow weaker than SHM. Evil SK faction." },
  { name: "The Venomous Shadow", class1: "ROG", class2: "SHM", class3: "NEC", race: "DEF", tier: "S",
    summary: "Hasted backstabs on slowed mobs with infinite mana and a pet tank.",
    tank: 4, heal: 7, dps: 10, utility: 7, solo: 9,
    synergies: ["SHM Haste on a Rogue = backstab frequency goes insane","SHM Slow (75%) + NEC pet tanking","NEC Lich + SHM Canni = bottomless mana","ROG SoS (true invis)","SHM STR/DEX buffs amplify backstab damage","Triple DoTs: SHM + NEC + ROG Poison","NEC FD as emergency escape, ROG Evade to drop aggro","ROG Pick Locks"],
    playstyle: "Send NEC pet in, SHM slows, stealth behind mob, unleash hasted backstabs. SoS past anything dangerous. Pick every lock.",
    weakness: "No real tank class. No CC (mez). No rez. Positional DPS. If pet dies mid-fight you're exposed." },
  { name: "The Lich King", class1: "SHD", class2: "CLR", class3: "NEC", race: "DEF", tier: "S",
    summary: "Plate tank + best heals + infinite mana + DoTs + FD + rez. Every base covered.",
    tank: 10, heal: 10, dps: 7, utility: 7, solo: 9,
    synergies: ["SK tank + CLR Complete Heal = immortal in plate","NEC Lich solves CLR mana problem","SK + NEC lifetaps + CLR heals = triple healing","CLR 96% Rez","SK + NEC double Feign Death","NEC DoTs + SK DoTs = strong passive DPS","CLR Summoned Hammer proc"],
    playstyle: "Pull with SK FD, tank in plate, stack DoTs, Complete Heal with unlimited Lich mana. Nothing kills you.",
    weakness: "No slow (biggest gap), no haste buffs, no CC. Lower DPS ceiling than SHM builds. Evil faction." },
  { name: "The Maestro", class1: "CLR", class2: "BRD", class3: "ENC", race: "HEF", tier: "A",
    summary: "Every buff, every song, every mez, best heals. The ultimate support fantasy.",
    tank: 3, heal: 10, dps: 5, utility: 10, solo: 6,
    synergies: ["BRD songs + ENC Clarity + ENC Haste = every group buff","Double mez: BRD mez song + ENC mez spell","CLR Complete Heal + BRD HP Regen Song","BRD songs cost NO mana","BRD Selo's speed + ENC illusions","CLR plate + BRD plate","ENC Charm for DPS"],
    playstyle: "Twist songs, Clarity everyone, mez everything, heal through anything. Solo? Charm a mob, double-haste it.",
    weakness: "Solo DPS is terrible without charm. Very complex. No slow, no FD." },
  { name: "The Eternal Engine", class1: "WAR", class2: "CLR", class3: "ENC", race: "HUM", tier: "A",
    summary: "The 'Holy Trinity' — the foundation every EQ group was built on.",
    tank: 10, heal: 10, dps: 4, utility: 9, solo: 5,
    synergies: ["WAR Defensive Discipline = best mitigation","CLR Complete Heal = best healing","ENC Clarity solves CLR mana","ENC Mez handles adds","ENC Haste makes WAR swing faster","ENC Charm for DPS"],
    playstyle: "Hold aggro, chain-heal, mez adds, Clarity/Haste rolling. Charm for DPS. Methodical, safe, slow.",
    weakness: "Terrible DPS without charm. No slow. No DoTs. No FD. No ports. Boring if you want action." },
  { name: "The Plague Doctor", class1: "SHM", class2: "NEC", class3: "DRU", race: "IKS", tier: "A",
    summary: "Triple healer + DoT stacking + snare kiting + infinite mana. Attrition king.",
    tank: 2, heal: 9, dps: 8, utility: 9, solo: 9,
    synergies: ["SHM Slow + DRU Snare = mob can't hit you AND can't catch you","Triple DoTs: SHM + NEC + DRU","NEC Lich + SHM Canni + DRU efficiency = infinite casting","Three healing classes","DRU Ports + SoW + Evac","DRU Damage Shield","NEC FD + DRU Evac = double escape","Iksar regen + triple healing"],
    playstyle: "Snare, slow, stack every DoT, kite or let pet tank while everything dies to ticking damage. Port anywhere.",
    weakness: "No plate armor, no real tank. DPS is all passive. No CC (mez). Overkill on healing." },
  { name: "The Blitz Knight", class1: "PAL", class2: "BRD", class3: "SHM", race: "HEF", tier: "A",
    summary: "Plate tank with songs, slow, heals, rez, haste, and speed. Complete paladin.",
    tank: 9, heal: 9, dps: 6, utility: 9, solo: 8,
    synergies: ["PAL stuns + SHM Slow = total control","PAL heals + SHM heals + BRD HP Regen = triple healing","PAL Rez (96%)","BRD songs cost NO mana","SHM Haste + BRD Haste Song","BRD Selo's for fastest travel"],
    playstyle: "Charge in with songs blaring, slow, stun, heal through everything. Selo's between fights.",
    weakness: "DPS is mediocre. Killing is slow but steady. No FD, no invis." },
  { name: "The Arcane Artillery", class1: "WIZ", class2: "MAG", class3: "ENC", race: "GNM", tier: "A",
    summary: "Maximum magical firepower — charm tank, nuke everything, port anywhere.",
    tank: 3, heal: 2, dps: 10, utility: 9, solo: 7,
    synergies: ["WIZ burst + MAG fire nukes = highest raw spell DPS","ENC Clarity fuels mana-burn playstyle","ENC Charm = your tank","MAG pet for backup","ENC Mez for CC","WIZ Ports + Evac","MAG Mod Rods for emergency mana","ENC Rune absorbs damage on cloth"],
    playstyle: "Charm a mob to tank. Mez adds. Unload every nuke. Things die in seconds. Port to next zone.",
    weakness: "All cloth. No heals, no slow, no tank class. Charm resist = death. Mana burns fast." },
  { name: "The Ogre Wall", class1: "WAR", class2: "SHM", class3: "CLR", race: "OGR", tier: "A",
    summary: "Most physically indestructible character possible. Nothing kills you.",
    tank: 10, heal: 10, dps: 4, utility: 6, solo: 6,
    synergies: ["Ogre frontal stun immunity","WAR Defensive Disc + SHM Slow = near-zero damage","CLR Complete Heal on best tank = immortal","Highest STR/STA race + WAR HP","SHM Canni + CLR plate = sustain forever","CLR Summoned Hammer proc"],
    playstyle: "Walking castle. Slow everything, tank everything, Complete Heal through everything. Bosses slowly die.",
    weakness: "DPS is glacially slow. No CC, no ports, no FD. Huge model." },
  { name: "The Soul Reaper", class1: "SHD", class2: "SHM", class3: "ROG", race: "TRL", tier: "A",
    summary: "Maximum melee burst — hasted backstabs behind a slowed, snared target.",
    tank: 8, heal: 7, dps: 10, utility: 6, solo: 8,
    synergies: ["ROG Backstab + SHM Haste = devastating burst","SHM Slow + SK tank = safe fights","SK snare prevents runners","SHM STR/DEX buffs boost backstab crits","SK lifetaps + SHM heals","ROG Evade + SK FD for aggro management","ROG SoS for scouting"],
    playstyle: "SK pulls and snares, SHM slows, position behind mob, unleash hasted backstabs. Mobs melt.",
    weakness: "No CC (mez). No rez. Positional DPS. Troll model huge." },
  { name: "The Dark Disciple", class1: "MNK", class2: "SHM", class3: "NEC", race: "IKS", tier: "A",
    summary: "Hasted monk fists + slow + infinite mana + DoTs. Melee DPS king.",
    tank: 5, heal: 7, dps: 10, utility: 7, solo: 9,
    synergies: ["SHM Haste on Monk = fastest melee attack rate","SHM Slow + MNK off-tanking","NEC Lich + SHM Canni = never-ending mana","MNK FD + NEC FD = double safety","SHM stat buffs maximize MNK output","NEC DoTs + SHM DoTs tick while MNK pummels","Iksar regen + quad sustain"],
    playstyle: "Pull with FD, slow, haste yourself, unleash a blur of flying kicks while DoTs tick.",
    weakness: "Monk in leather, not plate. Weight limit. No CC, no rez, no ports." },
  { name: "The Phantom Blade", class1: "ROG", class2: "SHM", class3: "BRD", race: "BAR", tier: "A",
    summary: "Songs + slow + hasted backstab + speed + stealth. The dungeon crawler.",
    tank: 3, heal: 6, dps: 9, utility: 8, solo: 7,
    synergies: ["SHM Haste + BRD Haste Song = potential double haste on backstabs","SHM Slow makes any mob safe to backstab","BRD songs cost NO mana","ROG SoS + BRD invis = stealth through anything","ROG Pick Locks + BRD pulling","SHM Canni + BRD mana regen","BRD Selo's = fastest movement"],
    playstyle: "Selo's to the dungeon, stealth past trash, pick the locked door, slow the boss, twist songs, backstab from behind.",
    weakness: "No real tank. No FD. No caster DPS." },
  { name: "The Storm Sage", class1: "DRU", class2: "WIZ", class3: "ENC", race: "HUM", tier: "B",
    summary: "Max magic firepower with ports everywhere and quad-kiting.",
    tank: 1, heal: 5, dps: 10, utility: 10, solo: 7,
    synergies: ["WIZ burst + DRU nukes = enormous spell DPS","ENC Clarity fuels nuke playstyle","DRU + WIZ ports = go anywhere instantly","DRU Snare + WIZ AE Nukes = quad-kite","ENC Mez + DRU Root","DRU Evac + WIZ Evac = double escape"],
    playstyle: "Port anywhere, root/mez everything, nuke to ash. Quad-kite for speed leveling. Charm when you need a tank.",
    weakness: "Cannot take a hit. No tank, no plate, no slow. If root AND mez resist, you're dead." },
];

async function seed() {
  if (!db) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  console.log("Seeding combos...");

  for (const combo of SEED_COMBOS) {
    await db.insert(combos).values(combo);
    console.log(`  Seeded: ${combo.name}`);
  }

  console.log(`Done! Seeded ${SEED_COMBOS.length} combos.`);
  process.exit(0);
}

seed();
