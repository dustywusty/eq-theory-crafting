import { useState } from "react";

const CLASSES = {
  WAR: { name: "Warrior", arch: "Tank", color: "#8B4513", armor: "Plate", mana: false,
    abilities: ["Taunt", "Defensive Discipline", "Evasive Discipline", "Kick/Bash", "Dual Wield"],
    strengths: "Best raw tanking, highest HP, best mitigation disciplines",
    weakness: "Zero spells, zero self-healing, needs group support" },
  PAL: { name: "Paladin", arch: "Tank", color: "#DAA520", armor: "Plate", mana: "WIS",
    abilities: ["Lay on Hands", "Stuns", "Heals", "Undead Nukes", "Rez (96%)"],
    strengths: "Self-healing tank, stuns for aggro, undead specialist",
    weakness: "Lower DPS than SK, mana-hungry, fewer utility spells" },
  SHD: { name: "Shadow Knight", arch: "Tank", color: "#4B0082", armor: "Plate", mana: "INT",
    abilities: ["Harm Touch", "Feign Death", "Lifetaps", "Snare", "Fear", "DoTs", "Pet"],
    strengths: "Self-sustaining tank, FD pulling, snare, lifetap healing, DoTs add DPS",
    weakness: "Evil-only, weaker heals than PAL, mana issues at low levels" },
  CLR: { name: "Cleric", arch: "Priest", color: "#FFD700", armor: "Plate", mana: "WIS",
    abilities: ["Complete Heal", "Resurrection (96%)", "Buffs (AC/HP)", "Root", "Undead Nukes", "DA"],
    strengths: "Best healer in game, full rez, plate armor, divine aura",
    weakness: "Poor solo, low DPS, group-dependent" },
  DRU: { name: "Druid", arch: "Priest", color: "#228B22", armor: "Leather", mana: "WIS",
    abilities: ["Ports", "SoW", "Snare", "DoTs", "Nukes", "Heals", "Damage Shield", "Charm Animal"],
    strengths: "Ports, kiting, quad-kiting, versatile solo, damage shields",
    weakness: "Weaker heals than CLR/SHM, jack-of-all-trades master of none" },
  SHM: { name: "Shaman", arch: "Priest", color: "#8B0000", armor: "Chain", mana: "WIS",
    abilities: ["Slow (75%)", "Haste", "Stat Buffs", "Cannibalize", "DoTs", "Heals", "Pet", "SoW"],
    strengths: "SLOW is game-changing, best buffs, canni = infinite mana, very self-sufficient",
    weakness: "Slow generates huge aggro, no CC, no rez" },
  ENC: { name: "Enchanter", arch: "Caster", color: "#9370DB", armor: "Cloth", mana: "INT",
    abilities: ["Mesmerize", "Charm", "Haste (Spell)", "Clarity (Mana Regen)", "Stuns", "Illusions", "Buffs"],
    strengths: "Best CC, Clarity is essential, haste, charm soloing is OP",
    weakness: "Extremely squishy, difficult to play, charm breaks are deadly" },
  MAG: { name: "Magician", arch: "Caster", color: "#FF4500", armor: "Cloth", mana: "INT",
    abilities: ["Strong Pet", "Nukes", "Summon Items", "DS", "Pet Toys (weapons/armor)", "CoTH"],
    strengths: "Best pet class, Call of the Hero, self-sufficient, summoned gear",
    weakness: "Less versatile than NEC, pet-dependent" },
  NEC: { name: "Necromancer", arch: "Caster", color: "#2F4F4F", armor: "Cloth", mana: "INT",
    abilities: ["Strong Pet", "Feign Death", "Lifetaps", "DoTs", "Lich (Mana Regen)", "Summon Corpse"],
    strengths: "Best solo class, FD, lich = infinite mana, massive DoT DPS, lifetap sustain",
    weakness: "Evil-only, DoTs break mezzes, squishy" },
  WIZ: { name: "Wizard", arch: "Caster", color: "#00BFFF", armor: "Cloth", mana: "INT",
    abilities: ["Burst Nukes", "Ports", "Snare", "Evac", "Root"],
    strengths: "Highest burst DPS, ports, evacuation, snare kiting",
    weakness: "Glass cannon, mana hog, one-trick pony" },
  BRD: { name: "Bard", arch: "Melee", color: "#FF69B4", armor: "Plate", mana: false,
    abilities: ["Haste Song", "Mana Regen Song", "HP Regen Song", "Resist Songs", "Selo's (Speed)", "Mez Song", "Swarm Kite"],
    strengths: "Stacks multiple songs, no mana, incredible group utility, pulling",
    weakness: "Master of none, carpal tunnel from twisting, weak solo" },
  MNK: { name: "Monk", arch: "Melee", color: "#D2691E", armor: "Leather", mana: false,
    abilities: ["Feign Death", "Dual Wield", "Flying Kick", "Mend", "High DPS", "Weight Limit"],
    strengths: "Top melee DPS, FD pulling, can off-tank, safe pulling",
    weakness: "Weight penalty, no spells, leather armor" },
  RNG: { name: "Ranger", arch: "Melee", color: "#006400", armor: "Chain", mana: "WIS",
    abilities: ["Tracking", "Bow DPS", "Dual Wield", "Minor Heals", "SoW", "Snare"],
    strengths: "Tracking, decent melee + range, some utility spells",
    weakness: "Squishy for melee, 'ranger down' meme, underpowered in classic" },
  ROG: { name: "Rogue", arch: "Melee", color: "#696969", armor: "Chain", mana: false,
    abilities: ["Backstab", "Shroud of Stealth", "Pick Locks", "Evade", "Poison"],
    strengths: "Highest sustained melee DPS (backstab), safe with SoS, pick locks",
    weakness: "Positional DPS, no spells, needs a tank" },
};

const RACES = {
  HUM: { name: "Human", classes: ["WAR","PAL","SHD","CLR","DRU","SHM","ENC","MAG","NEC","WIZ","BRD","MNK","RNG","ROG"],
    note: "No classes actually - classic Human was: CLR, DRU, ENC, MAG, MNK, NEC, PAL, RNG, ROG, SHD, WAR, WIZ (no BRD, no SHM)",
    traits: "No special traits, no penalties. Most versatile race.",
    classes_classic: ["WAR","PAL","SHD","CLR","DRU","ENC","MAG","MNK","NEC","WIZ","RNG","ROG"] },
  DEF: { name: "Dark Elf", 
    traits: "Ultravision, Hide (50). Evil race.",
    classes_classic: ["WAR","SHD","CLR","ENC","MAG","NEC","WIZ","ROG"] },
  OGR: { name: "Ogre",
    traits: "FRONTAL STUN IMMUNITY, Slam, highest STR/STA. 15% XP penalty (classic).",
    classes_classic: ["WAR","SHD","SHM"] },
  IKS: { name: "Iksar",
    traits: "HP Regeneration, +15-35 AC bonus, Forage, Swim 100. Hated everywhere.",
    classes_classic: ["WAR","SHD","SHM","MNK","NEC"] },
  TRL: { name: "Troll",
    traits: "HP Regeneration, Slam, Infravision. Evil race.",
    classes_classic: ["WAR","SHD","SHM"] },
  BAR: { name: "Barbarian",
    traits: "Slam, +10 Cold Resist. Neutral.",
    classes_classic: ["WAR","ROG","SHM"] },
  DWF: { name: "Dwarf",
    traits: "Infravision, +5 Poison/Magic Resist.",
    classes_classic: ["WAR","PAL","CLR","ROG"] },
  ERU: { name: "Erudite",
    traits: "+5 Magic Resist, -5 Disease Resist.",
    classes_classic: ["PAL","SHD","CLR","ENC","MAG","NEC","WIZ"] },
  GNM: { name: "Gnome",
    traits: "Tinkering tradeskill.",
    classes_classic: ["WAR","PAL","SHD","CLR","ENC","MAG","NEC","WIZ","ROG"] },
  HEF: { name: "Half Elf",
    traits: "Infravision.",
    classes_classic: ["WAR","PAL","DRU","BRD","RNG","ROG"] },
  HFL: { name: "Halfling",
    traits: "Infravision, Sneak/Hide (50), 5% XP bonus.",
    classes_classic: ["WAR","PAL","CLR","DRU","RNG","ROG"] },
  HIE: { name: "High Elf",
    traits: "Infravision.",
    classes_classic: ["PAL","CLR","ENC","MAG","WIZ"] },
  WEF: { name: "Wood Elf",
    traits: "Infravision, Forage.",
    classes_classic: ["WAR","BRD","DRU","RNG","ROG"] },
};

const COMBOS = [
  {
    id: 1,
    name: "The Dread Lord",
    classes: ["SHD", "SHM", "NEC"],
    race: "IKS",
    tier: "S",
    summary: "The ultimate self-sufficient killing machine.",
    tank: 9, heal: 7, dps: 9, utility: 8, solo: 10,
    synergies: [
      "SK lifetaps + NEC lifetaps + SHM heals = near-immortal sustain",
      "SHM Slow (75%) makes tanking trivial even without a group",
      "NEC Lich + SHM Canni = mana is never a problem",
      "Double Feign Death (SK + NEC) for pulling and safety",
      "SHM Haste + stat buffs boost SK melee damage enormously",
      "Triple DoTs stack: SK DoTs + SHM DoTs + NEC DoTs = insane passive DPS",
      "NEC pet adds DPS while you tank",
      "Iksar regen + AC bonus synergizes with all three classes' sustain",
    ],
    playstyle: "Engage with SK snare, drop SHM slow, stack DoTs from all 3 classes, lifetap-tank through damage while pet adds DPS. Canni between fights. FD if things go south. You are a one-person army that grinds forever without stopping.",
    weakness: "No crowd control, no rez, no ports. Evil race hated everywhere. No burst DPS."
  },
  {
    id: 2,
    name: "The Holy Fortress",
    classes: ["SHD", "CLR", "NEC"],
    race: "DEF",
    tier: "S",
    summary: "Unkillable plate tank with the best healing in the game.",
    tank: 10, heal: 10, dps: 7, utility: 7, solo: 9,
    synergies: [
      "CLR Complete Heal on yourself while tanking = basically immortal",
      "NEC Lich solves CLR's biggest weakness: running out of mana",
      "SK lifetaps + CLR heals = damage just doesn't stick",
      "CLR 96% Rez means death has no penalty",
      "SK + NEC double Feign Death for safety",
      "Dark Elf Hide racial helps with positioning and scouting",
      "CLR plate armor + SK plate armor = you wear the best gear in the game",
      "NEC pet as extra DPS, NEC DoTs for sustained damage",
    ],
    playstyle: "Pull with SK, tank in plate, Complete Heal yourself through anything. NEC DoTs and pet handle DPS. Lich keeps your mana pool full. Rez yourself if something goes catastrophically wrong (with a friend to drag corpse). The most defensively perfect build possible.",
    weakness: "No slow (big gap), no haste buffs, lower DPS ceiling than SHM builds, evil-only."
  },
  {
    id: 3,
    name: "The Iron Shaman",
    classes: ["SHD", "SHM", "MNK"],
    race: "IKS",
    tier: "S",
    summary: "The classic EQ power trio in one body.",
    tank: 9, heal: 7, dps: 9, utility: 7, solo: 9,
    synergies: [
      "This was THE meta 3-box combo in original EQ for good reason",
      "SHM Slow + SK tank = trivializes incoming damage",
      "MNK provides top-tier melee DPS with Flying Kick",
      "Triple Feign Death (SK + MNK) for insanely safe pulling",
      "SHM Haste on a Monk = machine gun fists",
      "SHM stat buffs boost both SK and MNK melee",
      "SHM Canni keeps mana flowing for heals and slows",
      "Iksar regen and AC bonus benefits the tanking enormously",
    ],
    playstyle: "MNK/SK FD-pull singles. SK tanks with SHM slow running. Monk unleashes hasted DPS. SHM patches heals and keeps buffs up, canni-dances between pulls. The rhythm of pull-slow-kill is the platonic ideal of classic EQ gameplay.",
    weakness: "No CC, no rez, no ports. Monk weight limit is annoying. No real caster DPS."
  },
  {
    id: 4,
    name: "The Eternal Engine",
    classes: ["WAR", "CLR", "ENC"],
    race: "HUM",
    tier: "A",
    summary: "The 'Holy Trinity' — the foundation every EQ group was built on.",
    tank: 10, heal: 10, dps: 4, utility: 9, solo: 5,
    synergies: [
      "WAR Defensive Discipline = best damage mitigation in the game",
      "CLR Complete Heal = best healing in the game",
      "ENC Clarity = solves the cleric mana problem",
      "ENC Mez = handle multiple adds safely",
      "ENC Haste = makes warrior swing much faster",
      "CLR buffs + ENC buffs stack for massive AC/HP",
      "ENC Charm = temporary enormous DPS boost",
      "Human can be all 3 classes in classic EQ",
    ],
    playstyle: "The control-and-sustain approach. Warrior holds aggro, Cleric chain-heals, Enchanter mezzes adds and keeps Clarity/Haste rolling. Charm a mob for DPS when safe. Methodical and safe but slow killing. This is how EQ was 'meant' to be played.",
    weakness: "Terrible DPS without charm. No slow (HUGE gap). No DoTs, no FD, no ports. Boring solo."
  },
  {
    id: 5,
    name: "The Soul Reaper",
    classes: ["SHD", "SHM", "ROG"],
    race: "TRL",
    tier: "A",
    summary: "Maximum melee burst damage with full support toolkit.",
    tank: 8, heal: 7, dps: 10, utility: 6, solo: 8,
    synergies: [
      "ROG Backstab with SHM Haste = devastating burst damage",
      "SHM Slow + SK tank = safe and controlled fights",
      "SK snare prevents runners, ROG finishes with backstab",
      "SHM stat buffs (STR/DEX) directly boost backstab crits",
      "SK lifetaps + SHM heals for sustain",
      "ROG Evade + SK FD for aggro management",
      "Troll regen helps between fights, Slam interrupts casters",
      "SHM Shrink helps with Troll's large model size",
    ],
    playstyle: "SK pulls and snares, SHM slows, position behind mob and unleash hasted backstabs. Mobs melt. Between fights, canni-dance and regen. The assassin-tank hybrid nobody expects.",
    weakness: "No CC, no rez, positional DPS requirement, Troll faction issues, no caster DPS."
  },
  {
    id: 6,
    name: "The Lich King",
    classes: ["NEC", "ENC", "MAG"],
    race: "GNM",
    tier: "A",
    summary: "Triple-pet army with unlimited mana and total crowd control.",
    tank: 4, heal: 3, dps: 9, utility: 10, solo: 8,
    synergies: [
      "THREE pets simultaneously: NEC skeleton + MAG elemental + ENC charmed mob",
      "NEC Lich + ENC Clarity = functionally unlimited mana",
      "ENC Charm turns enemies into your strongest DPS",
      "MAG pet can off-tank while charmed mob main-tanks",
      "ENC Mez handles adds while pets grind",
      "MAG summoned pet gear boosts all pets",
      "NEC lifetaps keep you alive, DoTs add passive DPS",
      "Gnome Tinkering tradeskill for extra utility items",
    ],
    playstyle: "Charm a powerful mob, send in MAG pet and NEC pet alongside it. Mez anything else. Stack DoTs. Let the army do the work while you sip mana from Lich + Clarity. A minion-master fantasy come to life.",
    weakness: "Paper-thin — cloth armor only. Charm breaks are terrifying. No real tank. No healer. Glass cannon army."
  },
  {
    id: 7,
    name: "The Ogre Wall",
    classes: ["WAR", "SHM", "SHD"],
    race: "OGR",
    tier: "A",
    summary: "The most physically indestructible character possible.",
    tank: 10, heal: 7, dps: 6, utility: 6, solo: 7,
    synergies: [
      "Ogre frontal stun immunity = spells never interrupted from the front",
      "WAR Defensive Disc + SK plate + SHM slow = takes almost zero damage",
      "Highest STR/STA race with two tank classes = absurd HP pool",
      "SHM Slow makes double-tanking overkill (in the best way)",
      "SHM Canni + SK lifetaps for sustain",
      "WAR taunt + SK snare/fear for total aggro control",
      "SHM Haste + Buffs on a Warrior/SK hybrid = respectable DPS",
      "SK FD for pulling, WAR disciplines for boss fights",
    ],
    playstyle: "You are a walking castle. Nothing can kill you. Slow everything, tank everything, lifetap through everything. You win every fight of attrition. Bosses that wipe groups just slowly die to your DoTs while you stand there. The pace is glacial but the safety is absolute.",
    weakness: "Very slow killing, redundant tank abilities, no CC, no rez, huge model size problems in dungeons."
  },
  {
    id: 8,
    name: "The Storm Sage",
    classes: ["DRU", "WIZ", "ENC"],
    race: "HUM",
    tier: "B",
    summary: "Maximum magical firepower with ports and crowd control.",
    tank: 1, heal: 5, dps: 10, utility: 10, solo: 7,
    synergies: [
      "WIZ burst nukes + DRU nukes = enormous magical DPS",
      "ENC Clarity fuels the nuke-heavy playstyle",
      "DRU + WIZ ports = go literally anywhere instantly",
      "ENC Mez + DRU Root/Snare = total battlefield control",
      "DRU Damage Shield adds passive damage",
      "ENC Charm for emergency tanking via charmed mob",
      "DRU heals keep you alive between nuking",
      "Quad-kiting with DRU snare + WIZ AE nukes is devastating",
    ],
    playstyle: "Port anywhere, root or mez everything, nuke it all to ash. Quad-kite with WIZ AoE + DRU snare for power-leveling. The glass-cannon caster dream, but you'd better not get hit.",
    weakness: "Cannot take a hit. No tank, no plate, no slow. One resist and you're in trouble."
  },
];

function StarRating({ value, max = 10, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <span style={{ width: 56, fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{
            width: "100%", height: 6, borderRadius: 2,
            background: i < value
              ? value >= 9 ? "#c6a44e" : value >= 7 ? "#7a8a6e" : value >= 5 ? "#6a7a8a" : "#8a6a6a"
              : "rgba(255,255,255,0.06)"
          }} />
        ))}
      </div>
      <span style={{ width: 20, fontSize: 11, color: "var(--text-dim)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function ClassBadge({ id, small }) {
  const c = CLASSES[id];
  if (!c) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: small ? "2px 6px" : "3px 10px",
      borderRadius: 4, fontSize: small ? 10 : 12,
      background: c.color + "22", color: c.color,
      border: `1px solid ${c.color}44`, fontWeight: 600,
      letterSpacing: 0.5, whiteSpace: "nowrap",
    }}>
      {small ? id : c.name}
    </span>
  );
}

function TierBadge({ tier }) {
  const colors = { S: "#c6a44e", A: "#7a9a6e", B: "#6a8aaa" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: 6,
      background: (colors[tier] || "#666") + "22",
      color: colors[tier] || "#666",
      border: `2px solid ${colors[tier] || "#666"}66`,
      fontWeight: 800, fontSize: 14, fontFamily: "'Courier New', monospace",
    }}>{tier}</span>
  );
}

export default function EQMulticlassGuide() {
  const [view, setView] = useState("combos");
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      color: "#c8c4b8", fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "24px 16px",
      '--text-dim': '#7a7568',
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: 6, textTransform: "uppercase", color: "#c6a44e88", marginBottom: 8 }}>
          EverQuest Classic
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 400, margin: 0, color: "#c6a44e",
          textShadow: "0 0 40px rgba(198,164,78,0.15)",
          letterSpacing: 2,
        }}>
          Multiclass Theorycrafting
        </h1>
        <p style={{ fontSize: 13, color: "#7a7568", margin: "8px 0 0", fontStyle: "italic", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          Pick a race and 3 classic classes. Inspired by The Heroes' Journey (RIP 2024–2025).
        </p>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 28 }}>
        {[
          { id: "combos", label: "Best Combos" },
          { id: "classes", label: "Class Reference" },
          { id: "races", label: "Race Matrix" },
        ].map(t => (
          <button key={t.id} onClick={() => { setView(t.id); setSelectedCombo(null); setSelectedClass(null); }}
            style={{
              padding: "8px 20px", border: "1px solid",
              borderColor: view === t.id ? "#c6a44e44" : "#ffffff0a",
              background: view === t.id ? "#c6a44e11" : "transparent",
              color: view === t.id ? "#c6a44e" : "#7a7568",
              borderRadius: 6, cursor: "pointer", fontSize: 12,
              fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase",
              transition: "all 0.2s",
            }}>{t.label}</button>
        ))}
      </div>

      {/* COMBOS VIEW */}
      {view === "combos" && !selectedCombo && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#7a7568", marginBottom: 16, textAlign: "center", letterSpacing: 1, textTransform: "uppercase" }}>
            Top 8 Multiclass Builds — Ranked by Synergy
          </div>
          {COMBOS.map(c => (
            <div key={c.id} onClick={() => setSelectedCombo(c)}
              style={{
                padding: "16px 20px", marginBottom: 8, borderRadius: 8,
                background: "#ffffff04", border: "1px solid #ffffff08",
                cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 16,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ffffff08"; e.currentTarget.style.borderColor = "#c6a44e22"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#ffffff04"; e.currentTarget.style.borderColor = "#ffffff08"; }}
            >
              <TierBadge tier={c.tier} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#d4cfbf" }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: "#7a7568" }}>
                    {RACES[c.race]?.name}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {c.classes.map(cl => <ClassBadge key={cl} id={cl} />)}
                </div>
                <p style={{ fontSize: 12, color: "#7a7568", margin: "6px 0 0", lineHeight: 1.5 }}>{c.summary}</p>
              </div>
              <span style={{ color: "#7a7568", fontSize: 18 }}>→</span>
            </div>
          ))}
        </div>
      )}

      {/* COMBO DETAIL */}
      {view === "combos" && selectedCombo && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <button onClick={() => setSelectedCombo(null)}
            style={{
              background: "none", border: "none", color: "#c6a44e", cursor: "pointer",
              fontSize: 12, fontFamily: "inherit", padding: 0, marginBottom: 16,
              letterSpacing: 1, textTransform: "uppercase",
            }}>← Back to all builds</button>
          
          <div style={{ padding: 24, background: "#ffffff04", border: "1px solid #ffffff0a", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <TierBadge tier={selectedCombo.tier} />
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: "#c6a44e", fontWeight: 400 }}>{selectedCombo.name}</h2>
                <span style={{ fontSize: 12, color: "#7a7568" }}>
                  {RACES[selectedCombo.race]?.name} — {RACES[selectedCombo.race]?.traits}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {selectedCombo.classes.map(cl => <ClassBadge key={cl} id={cl} />)}
            </div>

            <p style={{ fontSize: 14, color: "#b0aa98", lineHeight: 1.7, margin: "0 0 20px" }}>
              {selectedCombo.summary}
            </p>

            {/* Ratings */}
            <div style={{ padding: 16, background: "#ffffff04", borderRadius: 8, marginBottom: 20 }}>
              <StarRating value={selectedCombo.tank} label="Tank" />
              <StarRating value={selectedCombo.heal} label="Heal" />
              <StarRating value={selectedCombo.dps} label="DPS" />
              <StarRating value={selectedCombo.utility} label="Utility" />
              <StarRating value={selectedCombo.solo} label="Solo" />
            </div>

            {/* Synergies */}
            <h3 style={{ fontSize: 12, color: "#c6a44e", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>
              Synergies
            </h3>
            <div style={{ marginBottom: 20 }}>
              {selectedCombo.synergies.map((s, i) => (
                <div key={i} style={{
                  padding: "8px 12px", marginBottom: 4, borderRadius: 6,
                  background: "#c6a44e06", borderLeft: "2px solid #c6a44e22",
                  fontSize: 13, color: "#b0aa98", lineHeight: 1.5,
                }}>
                  {s}
                </div>
              ))}
            </div>

            {/* Playstyle */}
            <h3 style={{ fontSize: 12, color: "#c6a44e", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>
              How to Play
            </h3>
            <p style={{ fontSize: 13, color: "#b0aa98", lineHeight: 1.7, margin: "0 0 20px", padding: "12px 16px", background: "#ffffff04", borderRadius: 8 }}>
              {selectedCombo.playstyle}
            </p>

            {/* Weakness */}
            <h3 style={{ fontSize: 12, color: "#8a5a5a", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>
              Weaknesses
            </h3>
            <p style={{ fontSize: 13, color: "#8a7a6a", lineHeight: 1.7, margin: 0, padding: "12px 16px", background: "#8a5a5a08", borderRadius: 8, borderLeft: "2px solid #8a5a5a22" }}>
              {selectedCombo.weakness}
            </p>

            {/* Individual class details */}
            <h3 style={{ fontSize: 12, color: "#c6a44e", letterSpacing: 2, textTransform: "uppercase", margin: "24px 0 12px" }}>
              Class Contributions
            </h3>
            {selectedCombo.classes.map(cl => {
              const c = CLASSES[cl];
              return (
                <div key={cl} style={{ padding: 16, background: c.color + "08", borderRadius: 8, marginBottom: 8, borderLeft: `3px solid ${c.color}44` }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.color, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#7a7568", marginBottom: 6 }}>{c.arch} • {c.armor} armor{c.mana ? ` • ${c.mana}-based mana` : " • No mana"}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                    {c.abilities.map(a => (
                      <span key={a} style={{ fontSize: 10, padding: "2px 6px", background: "#ffffff08", borderRadius: 3, color: "#a09a8a" }}>{a}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#9a9484", lineHeight: 1.5 }}>{c.strengths}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CLASS REFERENCE VIEW */}
      {view === "classes" && !selectedClass && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {["Tank", "Priest", "Caster", "Melee"].map(arch => (
            <div key={arch} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#7a7568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid #ffffff08" }}>
                {arch}s
              </div>
              {Object.entries(CLASSES).filter(([, c]) => c.arch === arch).map(([id, c]) => (
                <div key={id} onClick={() => setSelectedClass(id)}
                  style={{
                    padding: "12px 16px", marginBottom: 4, borderRadius: 8,
                    background: "#ffffff04", border: "1px solid #ffffff06",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = c.color + "0a"; e.currentTarget.style.borderColor = c.color + "22"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#ffffff04"; e.currentTarget.style.borderColor = "#ffffff06"; }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, color: "#d4cfbf" }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: "#7a7568", marginLeft: 8 }}>{c.armor} • {c.mana ? `${c.mana} caster` : "No mana"}</span>
                  </div>
                  <span style={{ color: "#7a756844", fontSize: 16 }}>→</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {view === "classes" && selectedClass && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <button onClick={() => setSelectedClass(null)}
            style={{
              background: "none", border: "none", color: "#c6a44e", cursor: "pointer",
              fontSize: 12, fontFamily: "inherit", padding: 0, marginBottom: 16,
              letterSpacing: 1, textTransform: "uppercase",
            }}>← Back to classes</button>
          {(() => {
            const c = CLASSES[selectedClass];
            return (
              <div style={{ padding: 24, background: "#ffffff04", border: `1px solid ${c.color}22`, borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.color }} />
                  <h2 style={{ margin: 0, fontSize: 22, color: c.color, fontWeight: 400 }}>{c.name}</h2>
                </div>
                <div style={{ fontSize: 12, color: "#7a7568", marginBottom: 16 }}>
                  {c.arch} • {c.armor} Armor • {c.mana ? `${c.mana}-based mana` : "No mana pool"}
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
                  {c.abilities.map(a => (
                    <span key={a} style={{ fontSize: 11, padding: "4px 10px", background: c.color + "15", border: `1px solid ${c.color}22`, borderRadius: 4, color: c.color }}>
                      {a}
                    </span>
                  ))}
                </div>
                <div style={{ padding: 16, background: "#ffffff04", borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#c6a44e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Strengths</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#b0aa98" }}>{c.strengths}</p>
                </div>
                <div style={{ padding: 16, background: "#8a5a5a08", borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#8a5a5a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Weakness</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#8a7a6a" }}>{c.weakness}</p>
                </div>
                <div style={{ fontSize: 11, color: "#7a7568", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                  Races that can play {c.name}
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {Object.entries(RACES).filter(([, r]) => r.classes_classic?.includes(selectedClass)).map(([rid, r]) => (
                    <span key={rid} style={{ fontSize: 11, padding: "3px 8px", background: "#ffffff08", borderRadius: 4, color: "#a09a8a" }}>{r.name}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#7a7568", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>
                  Appears in builds
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {COMBOS.filter(co => co.classes.includes(selectedClass)).map(co => (
                    <div key={co.id} onClick={() => { setView("combos"); setSelectedCombo(co); setSelectedClass(null); }}
                      style={{ fontSize: 13, color: "#c6a44e", cursor: "pointer", padding: "4px 0" }}>
                      {co.name} ({co.classes.map(cl => CLASSES[cl]?.name).join(" / ")})
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* RACE MATRIX VIEW */}
      {view === "races" && (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#7a7568", marginBottom: 16, textAlign: "center", letterSpacing: 1, textTransform: "uppercase" }}>
            Classic EQ Race → Class Restrictions
          </div>
          {Object.entries(RACES).map(([rid, r]) => (
            <div key={rid} style={{
              padding: "14px 16px", marginBottom: 6, borderRadius: 8,
              background: "#ffffff04", border: "1px solid #ffffff08",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: "#d4cfbf", fontWeight: 600 }}>{r.name}</span>
                <span style={{ fontSize: 10, color: "#7a7568" }}>{r.classes_classic?.length || 0} classes</span>
              </div>
              <div style={{ fontSize: 11, color: "#8a8474", marginBottom: 8, lineHeight: 1.5, fontStyle: "italic" }}>
                {r.traits}
              </div>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {r.classes_classic?.map(cl => <ClassBadge key={cl} id={cl} small />) || null}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: 20, background: "#c6a44e08", border: "1px solid #c6a44e15", borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: "#c6a44e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Key Multiclass Race Picks</div>
            <div style={{ fontSize: 13, color: "#b0aa98", lineHeight: 1.8 }}>
              <strong style={{ color: "#c6a44e" }}>Iksar</strong> — Can be SK/SHM/MNK/NEC/WAR. Best for melee+shaman builds. Regen + AC bonus. The go-to for the S-tier combos.
              <br />
              <strong style={{ color: "#c6a44e" }}>Ogre</strong> — SK/SHM/WAR only. Frontal stun immunity is incredible for tanking. Highest raw stats.
              <br />
              <strong style={{ color: "#c6a44e" }}>Human</strong> — Widest class access (12 classes). The only race for caster-heavy multiclass builds. No racial perks though.
              <br />
              <strong style={{ color: "#c6a44e" }}>Dark Elf</strong> — SK/CLR/NEC/ENC/MAG/WIZ/ROG/WAR. Great for caster+tank hybrids. Hide racial. Evil faction.
              <br />
              <strong style={{ color: "#c6a44e" }}>Gnome</strong> — 9 classic classes including PAL/SHD/CLR/ENC/MAG/NEC/WIZ/ROG/WAR. Tinkering tradeskill bonus.
              <br />
              <strong style={{ color: "#c6a44e" }}>Troll</strong> — SK/SHM/WAR. Same tank+shaman access as Ogre but with HP regen instead of stun immunity.
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 40, padding: "20px 0", borderTop: "1px solid #ffffff08" }}>
        <p style={{ fontSize: 10, color: "#7a756844", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>
          Based on EverQuest Classic (1999–2001) • 14 Classes • 13 Races
        </p>
        <p style={{ fontSize: 10, color: "#7a756844", margin: "4px 0 0", fontStyle: "italic" }}>
          Multiclass data inspired by The Heroes' Journey EMU (2024–2025)
        </p>
      </div>
    </div>
  );
}
