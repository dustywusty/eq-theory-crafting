import { EQ_CLASSES } from "./classes";
import { EQ_RACES } from "./races";
import { EvaluationResult, ComboRatings, AAOverlapSummary } from "./types";
import { analyzeAAOverlap } from "./aa-overlap";

export function evaluateCombo(
  classIds: [string, string, string],
  raceId?: string
): EvaluationResult {
  const classes = classIds.map(id => EQ_CLASSES[id]).filter(Boolean);
  if (classes.length !== 3) {
    return {
      ratings: { tank: 0, heal: 0, dps: 0, utility: 0, solo: 0 },
      synergies: [],
      anti_synergies: [],
      warnings: ["Invalid class selection"],
      suggested_races: [],
      missing: []
    };
  }

  const ids = new Set(classIds);

  const synergies: string[] = [];
  const anti_synergies: string[] = [];
  const warnings: string[] = [];
  const missing: string[] = [];

  // --- Evaluate Tank ---
  let tank = 0;
  const hasPlate = classes.some(c => c.armor === "Plate");
  const hasTankClass = classes.some(c => c.archetype === "Tank");
  const hasWar = ids.has("WAR");
  const hasPal = ids.has("PAL");
  const hasShd = ids.has("SHD");

  if (hasWar) { tank += 6; synergies.push("WAR: Best tanking disciplines and aggro generation"); }
  else if (hasShd) { tank += 5; synergies.push("SHD: Strong tank with lifetap sustain and FD"); }
  else if (hasPal) { tank += 5; synergies.push("PAL: Self-healing plate tank with stuns"); }

  if (hasPlate && !hasTankClass) { tank += 2; synergies.push("Plate armor from non-tank class improves survivability"); }

  // Slow massively improves tanking
  const hasShmSlow = ids.has("SHM");
  const hasEncSlow = ids.has("ENC");
  if (hasShmSlow) { tank += 3; synergies.push("SHM Slow (75%) reduces incoming damage by 3/4 — tanking becomes trivial"); }
  else if (hasEncSlow) { tank += 2; synergies.push("ENC Slow (65%) significantly reduces incoming damage"); }
  else { missing.push("No slow (SHM 75% or ENC 65%) — major survivability gap"); }

  // Charm as pseudo-tank
  if (!hasTankClass && (ids.has("ENC") || ids.has("DRU"))) {
    tank += 2;
    synergies.push("Charm can serve as pseudo-tank — charmed mob takes hits");
    warnings.push("Charm breaks are dangerous without a real tank class");
  }

  if (!hasTankClass && !ids.has("ENC") && !ids.has("DRU")) {
    warnings.push("No tank class and no charm — survivability will be challenging");
  }

  tank = Math.min(10, tank);

  // --- Evaluate Heal ---
  let heal = 0;
  const hasClr = ids.has("CLR");
  const hasShm = ids.has("SHM");
  const hasDru = ids.has("DRU");

  if (hasClr) { heal += 6; synergies.push("CLR Complete Heal — best healing in the game"); }
  if (hasShm) { heal += 4; synergies.push("SHM heals + HoT — solid healing with canni sustain"); }
  if (hasDru) { heal += 3; synergies.push("DRU healing — decent but weaker than CLR/SHM"); }
  if (hasPal) { heal += 2; synergies.push("PAL self-heals while tanking"); }

  // Lifetaps count as minor healing
  if (ids.has("SHD") || ids.has("NEC")) {
    heal += 1;
    synergies.push("Lifetaps provide sustain healing");
  }

  if (heal === 0) {
    missing.push("No healing — build is unplayable for sustained content");
    warnings.push("CRITICAL: No healing source. This build cannot sustain.");
  }

  heal = Math.min(10, heal);

  // --- Evaluate DPS ---
  let dps = 0;

  // Melee DPS
  if (ids.has("ROG")) { dps += 5; synergies.push("ROG backstab — highest sustained melee DPS"); }
  if (ids.has("MNK")) { dps += 4; synergies.push("MNK — top melee DPS with flying kick"); }

  // Caster DPS
  if (ids.has("WIZ")) { dps += 5; synergies.push("WIZ — highest burst DPS in the game"); }
  if (ids.has("NEC")) { dps += 4; synergies.push("NEC DoTs — highest sustained DPS via stacking DoTs"); }
  if (ids.has("MAG")) { dps += 3; synergies.push("MAG fire nukes + strong pet DPS"); }

  // DoT stacking
  const dotClasses = ["NEC", "SHM", "SHD", "DRU"].filter(id => ids.has(id));
  if (dotClasses.length >= 2) {
    dps += 1;
    synergies.push(`${dotClasses.length}x DoT stacking (${dotClasses.join("+")}): massive passive damage`);
  }

  // Haste boosts melee
  const hasMelee = ids.has("ROG") || ids.has("MNK") || ids.has("WAR") || ids.has("RNG");
  if (hasMelee && (ids.has("SHM") || ids.has("ENC") || ids.has("BRD"))) {
    dps += 1;
    synergies.push("Haste buffs boost melee attack speed");
  }

  // Charm DPS
  if (ids.has("ENC")) { dps += 2; synergies.push("ENC Charm — charmed mobs deal their full damage as your DPS"); }

  // CLR hammer proc
  if (hasClr) { dps += 1; synergies.push("CLR Summoned Hammer — insane proc rate damage"); }

  // Misc DPS sources
  if (ids.has("DRU")) { dps += 2; }
  if (ids.has("SHD")) { dps += 2; }
  if (ids.has("RNG")) { dps += 3; }
  if (ids.has("BRD")) { dps += 1; }
  if (ids.has("PAL")) { dps += 1; }
  if (ids.has("WAR")) { dps += 2; }
  if (ids.has("SHM")) { dps += 1; }

  dps = Math.min(10, dps);

  // --- Evaluate Utility ---
  let utility = 0;

  // Ports
  if (ids.has("DRU") || ids.has("WIZ")) { utility += 2; synergies.push("Teleports — instant travel across Norrath"); }

  // FD
  const fdClasses = ["SHD", "NEC", "MNK"].filter(id => ids.has(id));
  if (fdClasses.length >= 2) { utility += 3; synergies.push(`Double Feign Death (${fdClasses.join("+")}) — safest pulling possible`); }
  else if (fdClasses.length === 1) { utility += 2; synergies.push(`Feign Death (${fdClasses[0]}) — safe pulling and emergency escape`); }

  // CC
  if (ids.has("ENC")) { utility += 2; synergies.push("ENC Mesmerize — best crowd control in the game"); }
  if (ids.has("BRD")) { utility += 2; synergies.push("BRD songs — mana/HP regen, resists, speed, all for free (no mana)"); }

  // Rez
  if (ids.has("CLR") || ids.has("PAL")) { utility += 1; synergies.push("96% Resurrection — death is a minor setback"); }

  // SoW/Speed
  if (ids.has("SHM") || ids.has("DRU") || ids.has("RNG")) { utility += 1; }
  if (ids.has("BRD")) { utility += 1; synergies.push("Selo's Accelerando — fastest movement in game"); }

  // Tracking
  if (ids.has("RNG") || ids.has("BRD")) { utility += 1; synergies.push("Tracking — find specific mobs in the zone"); }

  // SoS
  if (ids.has("ROG")) { utility += 1; synergies.push("Shroud of Stealth — true invisibility, Pick Locks"); }

  // Evac
  if (ids.has("DRU") || ids.has("WIZ")) { utility += 1; synergies.push("Evacuation — emergency escape for the whole group"); }

  // Mana regen
  const hasLich = ids.has("NEC");
  const hasCanni = ids.has("SHM");
  const hasClarity = ids.has("ENC");
  const hasBrdMana = ids.has("BRD");

  if (hasLich && hasCanni) { utility += 2; synergies.push("NEC Lich + SHM Canni = functionally unlimited mana"); }
  else if (hasLich && hasClarity) { utility += 2; synergies.push("NEC Lich + ENC Clarity = massive mana regeneration"); }
  else if (hasLich) { utility += 1; synergies.push("NEC Lich — strong mana regeneration"); }
  else if (hasCanni) { utility += 1; synergies.push("SHM Canni — converts HP to mana for good sustain"); }
  else if (hasClarity) { utility += 1; synergies.push("ENC Clarity — essential mana regeneration buff"); }

  if (!hasLich && !hasCanni && !hasClarity && !hasBrdMana && classes.some(c => c.mana_stat !== null)) {
    missing.push("No mana sustain (Lich/Canni/Clarity) — expect high downtime");
  }

  utility = Math.min(10, utility);

  // --- Evaluate Solo ---
  let solo = Math.round((tank + heal + dps + utility) / 4);

  // FD bonus for solo
  if (fdClasses.length > 0) solo += 1;

  // Mana sustain bonus
  if ((hasLich && hasCanni) || (hasLich && hasClarity)) solo += 1;
  else if (hasLich || hasCanni) solo += 0.5;

  // Pet for solo tanking
  if (classes.some(c => c.has_pet)) solo += 0.5;

  // Ports for convenience
  if (ids.has("DRU") || ids.has("WIZ")) solo += 0.5;

  solo = Math.min(10, Math.round(solo));

  // --- Check anti-synergies ---

  // DoTs + Mez conflict
  const hasMez = ids.has("ENC") || ids.has("BRD");
  const hasDots = ids.has("NEC") || ids.has("SHM") || ids.has("SHD") || ids.has("DRU");
  if (hasMez && hasDots) {
    anti_synergies.push("DoTs break Mez — must be careful to only DoT the active target, not mezzed adds");
  }

  // Multiple pet classes
  const petClasses = ["SHD", "NEC", "MAG", "SHM"].filter(id => ids.has(id));
  if (petClasses.length >= 2) {
    anti_synergies.push(`Multiple pet classes (${petClasses.join("+")}) but only 1 pet active — ${petClasses.length - 1} pet(s) wasted`);
  }

  // Multiple tank classes
  const tankClasses = ["WAR", "PAL", "SHD"].filter(id => ids.has(id));
  if (tankClasses.length >= 2) {
    anti_synergies.push(`Multiple tank classes (${tankClasses.join("+")}) — some tanking abilities are redundant`);
  }

  // --- Suggest races ---
  const suggested_races: string[] = [];
  for (const [raceId, race] of Object.entries(EQ_RACES)) {
    const canBePrimary = classIds.some(cid => race.classes_primary.includes(cid));
    if (canBePrimary) {
      suggested_races.push(raceId);
    }
  }

  // Validate chosen race
  if (raceId) {
    const race = EQ_RACES[raceId];
    if (race) {
      const canBePrimary = classIds.some(cid => race.classes_primary.includes(cid));
      if (!canBePrimary) {
        warnings.push(`${race.name} cannot have any of these classes as primary. Valid races: ${suggested_races.map(r => EQ_RACES[r]?.name).join(", ")}`);
      }
    }
  }

  // No escape tools
  if (fdClasses.length === 0 && !ids.has("DRU") && !ids.has("WIZ") && !ids.has("ROG")) {
    missing.push("No escape tools (FD, Evac, SoS) — deaths are costly");
  }

  // No CC
  if (!ids.has("ENC") && !ids.has("BRD")) {
    missing.push("No crowd control (Mez) — multi-mob pulls are dangerous");
  }

  const ratings: ComboRatings = { tank, heal, dps, utility, solo };

  // --- AA Overlap Analysis ---
  const aaResult = analyzeAAOverlap(classIds);
  const aa: AAOverlapSummary = {
    totalUniqueAAs: aaResult.totalUniqueAAs,
    totalRawAAs: aaResult.totalRawAAs,
    overlapCount: aaResult.overlapCount,
    overlapPercent: aaResult.overlapPercent,
    archetypeCoverage: aaResult.archetypeCoverage,
    aaEfficiency: aaResult.aaEfficiency,
    overlapAnalysis: aaResult.overlapAnalysis,
    keyUniqueAAs: aaResult.keyUniqueAAs,
    sharedBy3: aaResult.sharedBy3.map(a => a.name),
    sharedBy2: aaResult.sharedBy2.map(a => a.name),
    exclusiveAAs: aaResult.exclusiveAAs.map(e => ({
      classId: e.classId,
      aas: e.aas.filter(a => a.category === "class").map(a => a.name),
    })),
  };

  return {
    ratings,
    synergies,
    anti_synergies,
    warnings,
    suggested_races,
    missing,
    aa,
  };
}
