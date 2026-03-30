import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { EQ_CLASSES } from "@eq/shared/classes";
import { EQ_RACES } from "@eq/shared/races";
import { evaluateCombo } from "@eq/shared/evaluate";
import { getClassAAs, ALL_AAS, GENERAL_AAS, ARCHETYPE_AAS, CLASS_AAS } from "@eq/shared/aas";

// --- Theme ---

const themes = {
  dark: {
    bg: "#0a0a0f",
    cardBg: "rgba(255,255,255,0.02)",
    cardBgHover: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(255,255,255,0.06)",
    cardBorderHover: "rgba(198,164,78,0.15)",
    text: "#d4cfbf",
    textSecondary: "#9a9484",
    textMuted: "#7a7568",
    textFaint: "rgba(122,117,104,0.3)",
    gold: "#c6a44e",
    goldBg: "rgba(198,164,78,0.07)",
    goldBorder: "rgba(198,164,78,0.2)",
    green: "#7a9a6e",
    blue: "#6a8aaa",
    red: "#b06060",
    redBg: "rgba(138,90,90,0.06)",
    redBorder: "rgba(138,90,90,0.15)",
    orange: "#c6a070",
    orangeBg: "rgba(198,122,78,0.05)",
    orangeBorder: "rgba(198,122,78,0.2)",
    warnRed: "#c67070",
    warnRedBg: "rgba(198,80,80,0.04)",
    warnRedBorder: "rgba(198,80,80,0.2)",
    inputBg: "rgba(255,255,255,0.04)",
    inputBorder: "rgba(255,255,255,0.08)",
    barEmpty: "rgba(255,255,255,0.06)",
    rulesBg: "rgba(75,0,130,0.07)",
    rulesBorder: "rgba(75,0,130,0.2)",
    footerBorder: "rgba(255,255,255,0.04)",
    badgeBgAlpha: "22",
    badgeBorderAlpha: "44",
    badgeSelectedBgAlpha: "33",
    classBgAlpha: "08",
    classBorderAlpha: "44",
    abilityBg: "rgba(255,255,255,0.05)",
    tagBg: "rgba(255,255,255,0.04)",
  },
  light: {
    bg: "#f5f3ee",
    cardBg: "rgba(0,0,0,0.025)",
    cardBgHover: "rgba(0,0,0,0.05)",
    cardBorder: "rgba(0,0,0,0.08)",
    cardBorderHover: "rgba(160,130,60,0.3)",
    text: "#2a2520",
    textSecondary: "#4a4540",
    textMuted: "#6a6560",
    textFaint: "rgba(100,95,85,0.35)",
    gold: "#8a6e2e",
    goldBg: "rgba(138,110,46,0.08)",
    goldBorder: "rgba(138,110,46,0.2)",
    green: "#4a7a3e",
    blue: "#4a6a8a",
    red: "#904040",
    redBg: "rgba(144,64,64,0.06)",
    redBorder: "rgba(144,64,64,0.15)",
    orange: "#8a6a40",
    orangeBg: "rgba(138,106,64,0.06)",
    orangeBorder: "rgba(138,106,64,0.2)",
    warnRed: "#a04040",
    warnRedBg: "rgba(160,64,64,0.05)",
    warnRedBorder: "rgba(160,64,64,0.15)",
    inputBg: "rgba(0,0,0,0.04)",
    inputBorder: "rgba(0,0,0,0.12)",
    barEmpty: "rgba(0,0,0,0.08)",
    rulesBg: "rgba(75,0,130,0.04)",
    rulesBorder: "rgba(75,0,130,0.12)",
    footerBorder: "rgba(0,0,0,0.06)",
    badgeBgAlpha: "18",
    badgeBorderAlpha: "40",
    badgeSelectedBgAlpha: "28",
    classBgAlpha: "0c",
    classBorderAlpha: "30",
    abilityBg: "rgba(0,0,0,0.05)",
    tagBg: "rgba(0,0,0,0.04)",
  },
};

// Light-mode overrides for class colors that are too dark against light backgrounds
const LIGHT_CLASS_COLORS = {
  WAR: "#7a3a0a",   // brown — slightly richer
  SHD: "#5a10a0",   // indigo — brighter
  SHM: "#b01010",   // red — much brighter
  CLR: "#a08000",   // gold — darker for contrast
  NEC: "#1a6a6a",   // teal — brighter
  ROG: "#505050",   // gray — slightly darker
  MNK: "#a05010",   // orange-brown — richer
  RNG: "#1a6a1a",   // green — brighter
  MAG: "#d03000",   // orange-red — brighter
};

const ThemeContext = createContext(themes.dark);
const IsDarkContext = createContext(true);

function useTheme() {
  return useContext(ThemeContext);
}

// --- Seed combos ---

const SEED_COMBOS = [
  { id: 1, name: "The Dread Lord", classes: ["SHD", "SHM", "NEC"], race: "IKS", tier: "S",
    summary: "The ultimate self-sufficient killing machine. Tank, slow, infinite mana, triple DoTs.",
    ratings: { tank: 9, heal: 7, dps: 9, utility: 8, solo: 10 },
    synergies: ["SK lifetaps + SHM heals + NEC lifetaps = near-immortal sustain","SHM Slow (75%) makes tanking trivial","NEC Lich + SHM Canni = you literally never run out of mana","Double Feign Death (SK + NEC)","SHM Haste + stat buffs boost SK melee output","Triple DoT stacking: SK + SHM + NEC DoTs","Iksar regen + AC bonus amplifies sustain"],
    playstyle: "Pull with SK FD, drop SHM slow, stack all DoTs, lifetap-tank through damage. NEC pet adds DPS. Canni-dance between fights.",
    weakness: "No CC (mez), no rez, no ports. Evil race hated everywhere. DoTs prevent mezzing adds." },
  { id: 2, name: "The Iron Shaman", classes: ["SHD", "SHM", "MNK"], race: "IKS", tier: "S",
    summary: "The classic EQ power trio — FD pull, slow, hasted fists of fury.",
    ratings: { tank: 9, heal: 7, dps: 9, utility: 7, solo: 9 },
    synergies: ["THE meta 3-box combo in original EQ","SHM Slow + SK tank = trivial incoming damage","MNK Flying Kick + SHM Haste = machine gun melee DPS","Triple FD (SK + MNK)","SHM stat buffs boost MNK and SK damage","SHM Canni keeps mana flowing","Iksar regen + AC bonus on plate tanking"],
    playstyle: "MNK or SK FD-pulls singles. SK tanks with SHM slow. Monk unleashes hasted DPS.",
    weakness: "No CC, no rez, no ports. Zero caster DPS. MNK weight limit." },
  { id: 3, name: "The Immortal Scholar", classes: ["CLR", "ENC", "NEC"], race: "DEF", tier: "S",
    summary: "Infinite mana, best heals, total crowd control, and charmed slaves doing your bidding.",
    ratings: { tank: 3, heal: 10, dps: 8, utility: 10, solo: 9 },
    synergies: ["NEC Lich + ENC Clarity STACKING = most mana regen possible","CLR Complete Heal + unlimited mana","ENC Charm turns enemies into your tank AND DPS","ENC Mez handles adds","CLR 96% Rez","NEC FD for emergency escape","CLR Summoned Hammer incredible damage proc","WARNING: NEC DoTs BREAK ENC Mez"],
    playstyle: "Charm a powerful mob to tank. Mez everything else. Stack NEC DoTs on kill target ONLY.",
    weakness: "NO SLOW. No plate tank class. Charm breaks are terrifying. Cloth armor. DoTs break mez." },
  { id: 4, name: "The Maestro", classes: ["CLR", "BRD", "ENC"], race: "HEF", tier: "A",
    summary: "Every buff, every song, every mez, best heals. The ultimate support fantasy.",
    ratings: { tank: 3, heal: 10, dps: 5, utility: 10, solo: 6 },
    synergies: ["BRD songs + ENC Clarity + ENC Haste = every buff","Double mez: BRD + ENC","CLR Complete Heal + BRD HP Regen","BRD songs cost NO mana","CLR plate + BRD plate","ENC Charm for DPS"],
    playstyle: "Twist songs, Clarity, mez everything, heal through anything. Solo? Charm a mob, double-haste it.",
    weakness: "Solo DPS terrible without charm. Very complex. No slow, no FD." },
  { id: 5, name: "The Venomous Shadow", classes: ["ROG", "SHM", "NEC"], race: "DEF", tier: "S",
    summary: "Hasted backstabs on slowed mobs with infinite mana and a pet tank.",
    ratings: { tank: 4, heal: 7, dps: 10, utility: 7, solo: 9 },
    synergies: ["SHM Haste on a Rogue = backstab frequency goes insane","SHM Slow (75%) + NEC pet tanking","NEC Lich + SHM Canni = bottomless mana","ROG SoS (true invis)","SHM STR/DEX buffs amplify backstab","Triple DoTs","NEC FD + ROG Evade"],
    playstyle: "Send NEC pet in, SHM slows, stealth behind mob, unleash hasted backstabs.",
    weakness: "No real tank class. No CC (mez). No rez. Positional DPS." },
  { id: 6, name: "The Holy Fortress", classes: ["SHD", "CLR", "ENC"], race: "ERU", tier: "S",
    summary: "Unkillable plate tank + best heals + CC + infinite mana. The complete package.",
    ratings: { tank: 10, heal: 10, dps: 6, utility: 9, solo: 9 },
    synergies: ["SK tank + CLR Complete Heal = literally immortal","ENC Clarity solves CLR's OOM","ENC Mez handles adds","SK lifetaps + CLR heals","CLR 96% Rez","ENC Charm for DPS","ENC Slow (65%)","CLR Summoned Hammer + ENC haste"],
    playstyle: "Pull with SK, tank in plate, mez adds, Complete Heal yourself, charm for DPS.",
    weakness: "DPS is weak. No SoW/ports. ENC slow weaker than SHM." },
  { id: 7, name: "The Soul Reaper", classes: ["SHD", "SHM", "ROG"], race: "TRL", tier: "A",
    summary: "Maximum melee burst — hasted backstabs behind a slowed, snared target.",
    ratings: { tank: 8, heal: 7, dps: 10, utility: 6, solo: 8 },
    synergies: ["ROG Backstab + SHM Haste = devastating burst","SHM Slow + SK tank","SK snare prevents runners","SHM STR/DEX buffs boost backstab","ROG Evade + SK FD"],
    playstyle: "SK pulls and snares, SHM slows, position behind mob, unleash hasted backstabs.",
    weakness: "No CC (mez). No rez. Positional DPS. Troll model huge." },
  { id: 8, name: "The Eternal Engine", classes: ["WAR", "CLR", "ENC"], race: "HUM", tier: "A",
    summary: "The 'Holy Trinity' — the foundation every EQ group was built on.",
    ratings: { tank: 10, heal: 10, dps: 4, utility: 9, solo: 5 },
    synergies: ["WAR Defensive Discipline = best mitigation","CLR Complete Heal = best healing","ENC Clarity solves CLR mana","ENC Mez handles adds","ENC Charm for DPS"],
    playstyle: "Hold aggro, chain-heal, mez adds, Clarity/Haste rolling. Charm for DPS.",
    weakness: "Terrible DPS without charm. No slow. No FD. No ports." },
  { id: 9, name: "The Plague Doctor", classes: ["SHM", "NEC", "DRU"], race: "IKS", tier: "A",
    summary: "Triple healer + DoT stacking + snare kiting + infinite mana.",
    ratings: { tank: 2, heal: 9, dps: 8, utility: 9, solo: 9 },
    synergies: ["SHM Slow + DRU Snare","Triple DoTs: SHM + NEC + DRU","NEC Lich + SHM Canni = infinite mana","Three healing classes","DRU Ports + Evac","NEC FD + DRU Evac"],
    playstyle: "Snare, slow, stack every DoT, kite or let pet tank while everything dies.",
    weakness: "No plate armor, no real tank. DPS is all passive. No CC." },
  { id: 10, name: "The Blitz Knight", classes: ["PAL", "BRD", "SHM"], race: "HEF", tier: "A",
    summary: "Plate tank with songs, slow, heals, rez, haste, and speed.",
    ratings: { tank: 9, heal: 9, dps: 6, utility: 9, solo: 8 },
    synergies: ["PAL stuns + SHM Slow = total control","Triple healing","PAL Rez (96%)","BRD songs cost NO mana","SHM Haste + BRD Haste Song","BRD Selo's"],
    playstyle: "Charge in with songs blaring, slow, stun, heal through everything.",
    weakness: "DPS is mediocre. No FD, no invis." },
  { id: 11, name: "The Arcane Artillery", classes: ["WIZ", "MAG", "ENC"], race: "GNM", tier: "A",
    summary: "Maximum magical firepower — charm tank, nuke everything, port anywhere.",
    ratings: { tank: 3, heal: 2, dps: 10, utility: 9, solo: 7 },
    synergies: ["WIZ burst + MAG fire nukes = highest spell DPS","ENC Clarity fuels mana-burn","ENC Charm = your tank","WIZ Ports + Evac","ENC Rune absorbs damage"],
    playstyle: "Charm a mob to tank. Mez adds. Unload every nuke.",
    weakness: "All cloth. No heals, no slow, no tank class." },
  { id: 12, name: "The Ogre Wall", classes: ["WAR", "SHM", "CLR"], race: "OGR", tier: "A",
    summary: "Most physically indestructible character possible.",
    ratings: { tank: 10, heal: 10, dps: 4, utility: 6, solo: 6 },
    synergies: ["Ogre frontal stun immunity","WAR Defensive Disc + SHM Slow","CLR Complete Heal on best tank","SHM Canni sustain","CLR Summoned Hammer"],
    playstyle: "Walking castle. Slow everything, tank everything, Complete Heal through everything.",
    weakness: "DPS is glacially slow. No CC, no ports, no FD." },
  { id: 13, name: "The Storm Sage", classes: ["DRU", "WIZ", "ENC"], race: "HUM", tier: "B",
    summary: "Max magic firepower with ports everywhere and quad-kiting.",
    ratings: { tank: 1, heal: 5, dps: 10, utility: 10, solo: 7 },
    synergies: ["WIZ burst + DRU nukes","ENC Clarity","DRU + WIZ ports","DRU Snare + WIZ AE Nukes = quad-kite","DRU Evac + WIZ Evac"],
    playstyle: "Port anywhere, root/mez everything, nuke to ash.",
    weakness: "Cannot take a hit. No tank, no plate, no slow." },
  { id: 14, name: "The Dark Disciple", classes: ["MNK", "SHM", "NEC"], race: "IKS", tier: "A",
    summary: "Hasted monk fists + slow + infinite mana + DoTs.",
    ratings: { tank: 5, heal: 7, dps: 10, utility: 7, solo: 9 },
    synergies: ["SHM Haste on Monk = fastest melee","SHM Slow + MNK off-tanking","NEC Lich + SHM Canni","Double FD (MNK + NEC)","NEC DoTs tick while MNK pummels"],
    playstyle: "Pull with FD, slow, haste yourself, unleash flying kicks while DoTs tick.",
    weakness: "Leather armor. Weight limit. No CC, no rez, no ports." },
  { id: 15, name: "The Phantom Blade", classes: ["ROG", "SHM", "BRD"], race: "BAR", tier: "A",
    summary: "Songs + slow + hasted backstab + speed + stealth.",
    ratings: { tank: 3, heal: 6, dps: 9, utility: 8, solo: 7 },
    synergies: ["SHM Haste + BRD Haste Song on backstabs","SHM Slow","BRD songs cost NO mana","ROG SoS + BRD invis","ROG Pick Locks","BRD Selo's"],
    playstyle: "Selo's to the dungeon, stealth past trash, pick locks, slow the boss, backstab.",
    weakness: "No real tank. No FD. No caster DPS." },
  { id: 16, name: "The Lich King", classes: ["SHD", "CLR", "NEC"], race: "DEF", tier: "S",
    summary: "Plate tank + best heals + infinite mana + DoTs + FD + rez.",
    ratings: { tank: 10, heal: 10, dps: 7, utility: 7, solo: 9 },
    synergies: ["SK tank + CLR Complete Heal = immortal in plate","NEC Lich solves CLR mana","Triple healing sources","CLR 96% Rez","Double Feign Death","NEC DoTs + SK DoTs","CLR Summoned Hammer proc"],
    playstyle: "Pull with SK FD, tank in plate, stack DoTs, Complete Heal with unlimited Lich mana.",
    weakness: "No slow (biggest gap), no haste, no CC. Evil faction." },
];

const CLASSES = EQ_CLASSES;
const RACES = EQ_RACES;

// --- Components ---

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed", top: 16, right: 16, zIndex: 100,
        width: 40, height: 40, borderRadius: "50%",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s",
        color: isDark ? "#c6a44e" : "#8a6e2e",
        fontSize: 20,
      }}
    >
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function StarRating({ value, max = 10, label }) {
  const t = useTheme();
  const barColor = value >= 9 ? "#c6a44e" : value >= 7 ? "#7a9a6e" : value >= 5 ? "#6a8aaa" : "#b06060";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ width: 60, fontSize: 15, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{
            width: "100%", height: 10, borderRadius: 3,
            background: i < value ? barColor : t.barEmpty,
          }} />
        ))}
      </div>
      <span style={{ width: 24, fontSize: 16, color: t.textMuted, textAlign: "right", fontWeight: 700, fontFamily: "'Courier New', monospace" }}>{value}</span>
    </div>
  );
}

function useIsDark() {
  return useContext(IsDarkContext);
}

function getClassColor(id, isDark) {
  if (!isDark && LIGHT_CLASS_COLORS[id]) return LIGHT_CLASS_COLORS[id];
  return CLASSES[id]?.color;
}

function ClassBadge({ id, small, selected, onClick, disabled }) {
  const t = useTheme();
  const isDark = useIsDark();
  const c = CLASSES[id];
  if (!c) return null;
  const color = getClassColor(id, isDark);
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: small ? "3px 8px" : "5px 12px", borderRadius: 5,
        fontSize: small ? 14 : 16,
        background: selected ? color + t.badgeSelectedBgAlpha : color + t.badgeBgAlpha,
        color: color,
        border: selected ? "2px solid " + color : "1px solid " + color + t.badgeBorderAlpha,
        fontWeight: 600, letterSpacing: 0.5, whiteSpace: "nowrap",
        cursor: onClick ? "pointer" : "default",
        opacity: disabled ? 0.35 : 1,
        transition: "all 0.15s",
      }}
      onClick={disabled ? undefined : onClick}
    >
      {small ? id : c.name}
    </span>
  );
}

function TierBadge({ tier }) {
  const colors = { S: "#c6a44e", A: "#7a9a6e", B: "#6a8aaa", C: "#8a6a6a" };
  const c = colors[tier] || "#666";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 32, height: 32, borderRadius: 7,
      background: c + "22", color: c, border: "2px solid " + c + "66",
      fontWeight: 800, fontSize: 18, fontFamily: "'Courier New', monospace",
    }}>{tier}</span>
  );
}

function SectionHeader({ children, color }) {
  const t = useTheme();
  return (
    <div style={{ fontSize: 14, color: color || t.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>
      {children}
    </div>
  );
}

function TopRacePicks() {
  const t = useTheme();
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: 18, background: t.goldBg, border: "1px solid " + t.goldBorder, borderRadius: 12 }}>
      <SectionHeader>Top Race Picks</SectionHeader>
      <div style={{ fontSize: 16, color: t.textSecondary, lineHeight: 1.9 }}>
        <strong style={{ color: t.gold }}>Iksar</strong> — SK/SHM/MNK/NEC/WAR primary. Regen + AC bonus. S-tier melee race.
        <br /><strong style={{ color: t.gold }}>Ogre</strong> — SK/SHM/WAR primary. Frontal stun immunity is unmatched.
        <br /><strong style={{ color: t.gold }}>Human</strong> — 12 primaries. Only option for many caster multiclass builds.
        <br /><strong style={{ color: t.gold }}>Dark Elf</strong> — 8 primaries incl. SK/CLR/NEC/ENC. Hide racial. Best caster-tank hybrids.
        <br /><strong style={{ color: t.gold }}>Froglok</strong> — 8 primaries incl. PAL/SHD/CLR/SHM. Very flexible new race.
        <br /><strong style={{ color: t.gold }}>Half Elf</strong> — One of few BRD primary races. Essential for Bard builds.
        <br /><strong style={{ color: t.gold }}>Remember:</strong> Only primary is race-locked. 2nd and 3rd class can be anything!
      </div>
    </div>
  );
}

function AAOverlapSection({ aa }) {
  const t = useTheme();
  const isDark = useIsDark();
  if (!aa) return null;

  const effColor = aa.aaEfficiency >= 8 ? (isDark ? "#5cd85c" : "#2a7a2a") : aa.aaEfficiency >= 6 ? t.gold : aa.aaEfficiency >= 4 ? (isDark ? "#e8b840" : "#a07020") : (isDark ? "#ef6060" : "#b83030");
  const effLabel = aa.aaEfficiency >= 8 ? "Excellent" : aa.aaEfficiency >= 6 ? "Good" : aa.aaEfficiency >= 4 ? "Moderate" : "Poor";

  return (
    <div style={{ marginBottom: 20 }}>
      <SectionHeader>AA Overlap Analysis</SectionHeader>
      <div style={{ padding: 16, background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: 10 }}>

        {/* Efficiency header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: effColor, fontFamily: "'Courier New', monospace" }}>{aa.aaEfficiency}</span>
            <span style={{ fontSize: 13, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>/10</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: effColor }}>{effLabel} AA Efficiency</div>
            <div style={{ fontSize: 14, color: t.textMuted }}>
              {aa.totalUniqueAAs} unique AAs — {aa.overlapPercent}% overlap ({aa.overlapCount} shared of {aa.totalRawAAs} total)
            </div>
          </div>
        </div>

        {/* Analysis text */}
        <div style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.6, marginBottom: 14, padding: "10px 14px", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderRadius: 8 }}>
          {aa.overlapAnalysis}
        </div>

        {/* Archetype coverage */}
        {aa.archetypeCoverage.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Archetype Coverage</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {aa.archetypeCoverage.map(g => (
                <span key={g} style={{ fontSize: 14, padding: "4px 10px", background: t.goldBg, border: "1px solid " + t.goldBorder, borderRadius: 5, color: t.gold, fontWeight: 600 }}>{g}</span>
              ))}
            </div>
          </div>
        )}

        {/* Key unique AAs per class */}
        {aa.keyUniqueAAs.some(k => k.aas.length > 0) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Key Unique AAs by Class</div>
            {aa.keyUniqueAAs.filter(k => k.aas.length > 0).map(k => {
              const cc = getClassColor(k.classId, isDark);
              return (
                <div key={k.classId} style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cc }}>{CLASSES[k.classId]?.name}: </span>
                  <span style={{ fontSize: 14, color: t.textSecondary }}>{k.aas.join(", ")}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Exclusive AAs per class */}
        {aa.exclusiveAAs.some(e => e.aas.length > 0) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Exclusive AAs (only from this class in the combo)</div>
            {aa.exclusiveAAs.filter(e => e.aas.length > 0).map(e => {
              const cc = getClassColor(e.classId, isDark);
              return (
                <div key={e.classId} style={{ padding: "6px 10px", marginBottom: 3, borderRadius: 6, background: cc + (isDark ? "08" : "0c"), borderLeft: "3px solid " + cc + "44" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cc }}>{CLASSES[e.classId]?.name}</span>
                  <span style={{ fontSize: 14, color: t.textSecondary }}> — {e.aas.join(", ")}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Shared AAs (waste) */}
        {aa.sharedBy3.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: t.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Shared by All 3 Classes (overlap)</div>
            <div style={{ fontSize: 14, color: t.textMuted, padding: "6px 10px", background: t.redBg, borderRadius: 6, borderLeft: "3px solid " + t.redBorder }}>
              {aa.sharedBy3.join(", ")}
            </div>
          </div>
        )}

        {aa.sharedBy2.length > 0 && (
          <div>
            <div style={{ fontSize: 13, color: t.orange, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Shared by 2 Classes (partial overlap)</div>
            <div style={{ fontSize: 14, color: t.textMuted, padding: "6px 10px", background: t.orangeBg, borderRadius: 6, borderLeft: "3px solid " + t.orangeBorder }}>
              {aa.sharedBy2.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ComboBuilder() {
  const t = useTheme();
  const isDark = useIsDark();
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [buildName, setBuildName] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleClass = (id) => {
    setSelectedClasses(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
    setSaved(false);
  };

  useEffect(() => {
    if (selectedClasses.length === 3) {
      setEvaluation(evaluateCombo(selectedClasses, selectedRace));
    } else {
      setEvaluation(null);
    }
  }, [selectedClasses, selectedRace]);

  const validRaces = selectedClasses.length > 0
    ? Object.entries(RACES).filter(([, r]) => selectedClasses.some(cid => r.classes_primary.includes(cid)))
    : Object.entries(RACES);

  const handleSave = async () => {
    if (!evaluation || selectedClasses.length !== 3 || !buildName.trim()) return;
    const combo = {
      name: buildName,
      class1: selectedClasses[0], class2: selectedClasses[1], class3: selectedClasses[2],
      race: selectedRace || evaluation.suggested_races[0] || "HUM",
      tier: evaluation.ratings.solo >= 9 ? "S" : evaluation.ratings.solo >= 7 ? "A" : "B",
      summary: `${CLASSES[selectedClasses[0]].name} + ${CLASSES[selectedClasses[1]].name} + ${CLASSES[selectedClasses[2]].name} build`,
      synergies: evaluation.synergies.slice(0, 8),
      playstyle: "Custom build — playstyle TBD",
      weakness: evaluation.missing.concat(evaluation.anti_synergies).join(". ") || "None identified",
      ...evaluation.ratings,
    };
    try {
      await fetch("/api/combos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(combo) });
    } catch { /* API might be down */ }
    setSaved(true);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* Class Selection */}
      <div style={{ marginBottom: 24 }}>
        <SectionHeader>Select 3 Classes ({selectedClasses.length}/3)</SectionHeader>
        {["Tank", "Priest", "Caster", "Melee"].map(arch => (
          <div key={arch} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: t.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{arch}s</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(CLASSES).filter(([, c]) => c.archetype === arch).map(([id]) => (
                <ClassBadge key={id} id={id} selected={selectedClasses.includes(id)} disabled={selectedClasses.length >= 3 && !selectedClasses.includes(id)} onClick={() => toggleClass(id)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Race Selection */}
      {selectedClasses.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader>Select Race {selectedRace && `— ${RACES[selectedRace]?.name}`}</SectionHeader>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {validRaces.map(([rid, r]) => {
              const canBePrimary = selectedClasses.some(cid => r.classes_primary.includes(cid));
              return (
                <span key={rid} onClick={() => setSelectedRace(selectedRace === rid ? null : rid)}
                  style={{
                    padding: "5px 12px", borderRadius: 5, cursor: "pointer", fontSize: 15,
                    background: selectedRace === rid ? t.goldBg : t.cardBg,
                    color: selectedRace === rid ? t.gold : canBePrimary ? t.textSecondary : t.textFaint,
                    border: selectedRace === rid ? "1px solid " + t.goldBorder : "1px solid " + t.cardBorder,
                    transition: "all 0.15s", fontWeight: selectedRace === rid ? 600 : 400,
                  }}
                >{r.name}</span>
              );
            })}
          </div>
          {selectedRace && (
            <div style={{ fontSize: 15, color: t.textMuted, marginTop: 8, fontStyle: "italic" }}>
              {RACES[selectedRace]?.traits}
            </div>
          )}
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <div style={{ padding: 24, background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: 14, marginBottom: 24 }}>
          <SectionHeader>
            Evaluation — {selectedClasses.map(id => CLASSES[id]?.name).join(" + ")}
          </SectionHeader>

          <div style={{ padding: 14, background: t.cardBg, borderRadius: 10, marginBottom: 20 }}>
            <StarRating value={evaluation.ratings.tank} label="Tank" />
            <StarRating value={evaluation.ratings.heal} label="Heal" />
            <StarRating value={evaluation.ratings.dps} label="DPS" />
            <StarRating value={evaluation.ratings.utility} label="Util" />
            <StarRating value={evaluation.ratings.solo} label="Solo" />
          </div>

          {evaluation.synergies.length > 0 && (
            <>
              <SectionHeader>Synergies</SectionHeader>
              <div style={{ marginBottom: 20 }}>
                {evaluation.synergies.map((s, i) => (
                  <div key={i} style={{ padding: "8px 14px", marginBottom: 4, borderRadius: 6, background: t.goldBg, borderLeft: "3px solid " + t.goldBorder, fontSize: 16, color: t.textSecondary, lineHeight: 1.6 }}>{s}</div>
                ))}
              </div>
            </>
          )}

          {evaluation.anti_synergies.length > 0 && (
            <>
              <SectionHeader color={t.orange}>Anti-Synergies</SectionHeader>
              <div style={{ marginBottom: 20 }}>
                {evaluation.anti_synergies.map((s, i) => (
                  <div key={i} style={{ padding: "8px 14px", marginBottom: 4, borderRadius: 6, background: t.orangeBg, borderLeft: "3px solid " + t.orangeBorder, fontSize: 16, color: t.orange, lineHeight: 1.6 }}>{s}</div>
                ))}
              </div>
            </>
          )}

          {evaluation.warnings.length > 0 && (
            <>
              <SectionHeader color={t.warnRed}>Warnings</SectionHeader>
              <div style={{ marginBottom: 20 }}>
                {evaluation.warnings.map((s, i) => (
                  <div key={i} style={{ padding: "8px 14px", marginBottom: 4, borderRadius: 6, background: t.warnRedBg, borderLeft: "3px solid " + t.warnRedBorder, fontSize: 16, color: t.warnRed, lineHeight: 1.6 }}>{s}</div>
                ))}
              </div>
            </>
          )}

          {evaluation.missing.length > 0 && (
            <>
              <SectionHeader color={t.red}>Missing Capabilities</SectionHeader>
              <div style={{ marginBottom: 20 }}>
                {evaluation.missing.map((s, i) => (
                  <div key={i} style={{ padding: "8px 14px", marginBottom: 4, borderRadius: 6, background: t.redBg, borderLeft: "3px solid " + t.redBorder, fontSize: 16, color: t.red, lineHeight: 1.6 }}>{s}</div>
                ))}
              </div>
            </>
          )}

          {!selectedRace && evaluation.suggested_races.length > 0 && (
            <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 14 }}>
              <span style={{ color: t.gold, fontWeight: 600 }}>Suggested races: </span>
              {evaluation.suggested_races.map(r => RACES[r]?.name).filter(Boolean).join(", ")}
            </div>
          )}

          {/* AA Overlap Analysis */}
          {evaluation.aa && <AAOverlapSection aa={evaluation.aa} />}

          <SectionHeader>Class Breakdown</SectionHeader>
          {selectedClasses.map(cl => { const c = CLASSES[cl]; if (!c) return null; const cc = getClassColor(cl, isDark); return (
            <div key={cl} style={{ padding: 14, background: cc + t.classBgAlpha, borderRadius: 10, marginBottom: 6, borderLeft: "4px solid " + cc + t.classBorderAlpha }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: cc, marginBottom: 3 }}>{c.name}</div>
              <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 6 }}>{c.archetype} — {c.armor} — {c.mana_stat ? c.mana_stat + " caster" : "No mana"}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {c.abilities.map(a => (<span key={a} style={{ fontSize: 14, padding: "3px 8px", background: t.abilityBg, borderRadius: 4, color: t.textSecondary }}>{a}</span>))}
              </div>
              {c.key_abilities?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {c.key_abilities.map((ka, i) => (
                    <div key={i} style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.6, marginBottom: 3 }}>
                      <span style={{ color: cc, fontWeight: 600 }}>{ka.name}</span>
                      <span style={{ color: t.textMuted }}> ({ka.category})</span>
                      {" — "}{ka.why_it_matters}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ); })}

          {/* Save Build */}
          <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
            <input type="text" placeholder="Name your build..." value={buildName}
              onChange={e => { setBuildName(e.target.value); setSaved(false); }}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 8,
                background: t.inputBg, border: "1px solid " + t.inputBorder,
                color: t.text, fontSize: 16, fontFamily: "inherit", outline: "none",
              }}
            />
            <button onClick={handleSave} disabled={!buildName.trim() || saved}
              style={{
                padding: "10px 20px", borderRadius: 8,
                cursor: !buildName.trim() || saved ? "default" : "pointer",
                background: saved ? t.green + "22" : t.goldBg,
                color: saved ? t.green : t.gold,
                border: "1px solid " + (saved ? t.green + "44" : t.goldBorder),
                fontSize: 16, fontFamily: "inherit", fontWeight: 600,
                opacity: !buildName.trim() ? 0.4 : 1,
              }}
            >{saved ? "Saved!" : "Save Build"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

const CLASS_IDS = Object.keys(EQ_CLASSES);

function AAMatrixView() {
  const t = useTheme();
  const isDark = useIsDark();
  const [hoveredPair, setHoveredPair] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Precompute pairwise overlap data
  const pairData = useMemo(() => {
    const data = {};
    for (const c1 of CLASS_IDS) {
      for (const c2 of CLASS_IDS) {
        if (c1 === c2) continue;
        const key = [c1, c2].sort().join("+");
        if (data[key]) continue;
        const set1 = new Set(getClassAAs(c1).map(a => a.name));
        const set2 = new Set(getClassAAs(c2).map(a => a.name));
        const shared = [...set1].filter(n => set2.has(n));
        const union = new Set([...set1, ...set2]);
        data[key] = {
          shared: shared.length,
          union: union.size,
          overlapPct: Math.round((shared.length / union.size) * 100),
          sharedNames: shared,
          c1Total: set1.size,
          c2Total: set2.size,
        };
      }
    }
    return data;
  }, []);

  // Per-class AA count
  const classCounts = useMemo(() => {
    const counts = {};
    for (const cid of CLASS_IDS) {
      counts[cid] = getClassAAs(cid).length;
    }
    return counts;
  }, []);

  const getPairKey = (c1, c2) => [c1, c2].sort().join("+");
  const getCellColor = (pct) => {
    if (pct >= 60) return isDark ? "rgba(210,70,70,0.25)" : "rgba(180,50,50,0.14)";
    if (pct >= 45) return isDark ? "rgba(220,160,60,0.18)" : "rgba(180,120,30,0.12)";
    if (pct >= 30) return isDark ? "rgba(180,170,100,0.1)" : "rgba(120,100,40,0.08)";
    return isDark ? "rgba(60,190,60,0.14)" : "rgba(30,140,30,0.1)";
  };
  const getCellTextColor = (pct) => {
    if (pct >= 60) return isDark ? "#ef6060" : "#b83030";
    if (pct >= 45) return isDark ? "#e8b840" : "#a07020";
    if (pct >= 30) return isDark ? "#c8b878" : "#6a5a2a";
    return isDark ? "#5cd85c" : "#2a7a2a";
  };

  const hovered = hoveredPair ? pairData[hoveredPair] : null;
  const hoveredClasses = hoveredPair ? hoveredPair.split("+") : [];

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto" }}>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <h2 style={{ fontSize: 22, color: t.gold, fontWeight: 400, margin: "0 0 6px" }}>AA Overlap Matrix</h2>
        <p style={{ fontSize: 15, color: t.textMuted, margin: 0, lineHeight: 1.6 }}>
          Each cell shows the % of AAs shared between two classes. Lower overlap = more unique AAs when multiclassing.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { color: getCellTextColor(20), bg: getCellColor(20), label: "Low (<30%)" },
          { color: getCellTextColor(35), bg: getCellColor(35), label: "Medium (30-44%)" },
          { color: getCellTextColor(50), bg: getCellColor(50), label: "High (45-59%)" },
          { color: getCellTextColor(65), bg: getCellColor(65), label: "Very High (60%+)" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.bg, border: "1px solid " + l.color + "44" }} />
            <span style={{ color: l.color, fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Matrix table */}
      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <table style={{ borderCollapse: "collapse", margin: "0 auto", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ padding: "6px 4px", minWidth: 44 }} />
              {CLASS_IDS.map(cid => {
                const cc = getClassColor(cid, isDark);
                return (
                  <th key={cid} style={{
                    padding: "8px 3px", textAlign: "center", fontSize: 13,
                    color: cc, fontWeight: 700, cursor: "pointer",
                    background: selectedClass === cid ? cc + "22" : "transparent",
                    borderRadius: 4,
                  }}
                  onClick={() => setSelectedClass(selectedClass === cid ? null : cid)}
                  >{cid}</th>
                );
              })}
              <th style={{ padding: "6px 6px", fontSize: 12, color: t.textMuted, textAlign: "center" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {CLASS_IDS.map(row => {
              const rowColor = getClassColor(row, isDark);
              return (
                <tr key={row}>
                  <td style={{
                    padding: "6px 8px", fontWeight: 700, fontSize: 14, color: rowColor,
                    cursor: "pointer",
                    background: selectedClass === row ? rowColor + "22" : "transparent",
                    borderRadius: 4,
                  }}
                  onClick={() => setSelectedClass(selectedClass === row ? null : row)}
                  >{row}</td>
                  {CLASS_IDS.map(col => {
                    if (row === col) {
                      return <td key={col} style={{
                        padding: "4px 2px", textAlign: "center", fontSize: 12,
                        color: t.textFaint, background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)",
                        minWidth: 42,
                      }}>—</td>;
                    }
                    const key = getPairKey(row, col);
                    const pair = pairData[key];
                    const pct = pair?.overlapPct || 0;
                    const isHovered = hoveredPair === key;
                    const isHighlighted = selectedClass && (row === selectedClass || col === selectedClass);
                    return (
                      <td key={col}
                        onMouseEnter={() => setHoveredPair(key)}
                        onMouseLeave={() => setHoveredPair(null)}
                        style={{
                          padding: "5px 3px", textAlign: "center", cursor: "pointer",
                          fontSize: 15, fontWeight: 700, minWidth: 46,
                          color: getCellTextColor(pct),
                          background: isHovered
                            ? (isDark ? "rgba(198,164,78,0.15)" : "rgba(138,110,46,0.15)")
                            : isHighlighted
                            ? getCellColor(pct)
                            : getCellColor(pct),
                          borderRadius: 3,
                          outline: isHovered ? "2px solid " + t.gold : "none",
                          transition: "all 0.1s",
                          opacity: selectedClass && !isHighlighted ? 0.3 : 1,
                        }}
                      >{pct}%</td>
                    );
                  })}
                  <td style={{
                    padding: "4px 6px", textAlign: "center", fontSize: 13,
                    color: t.textMuted, fontWeight: 500,
                  }}>{classCounts[row]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Hover tooltip */}
      {hovered && hoveredClasses.length === 2 && (
        <div style={{
          padding: 16, background: t.cardBg, border: "1px solid " + t.cardBorder,
          borderRadius: 10, marginBottom: 20,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: getClassColor(hoveredClasses[0], isDark) }}>
              {CLASSES[hoveredClasses[0]]?.name}
            </span>
            <span style={{ color: t.textMuted }}>+</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: getClassColor(hoveredClasses[1], isDark) }}>
              {CLASSES[hoveredClasses[1]]?.name}
            </span>
            <span style={{
              marginLeft: "auto", fontSize: 22, fontWeight: 700,
              color: getCellTextColor(hovered.overlapPct),
            }}>{hovered.overlapPct}% overlap</span>
          </div>
          <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 10 }}>
            {hovered.shared} shared AAs out of {hovered.union} unique
            ({hovered.c1Total} from {hoveredClasses[0]}, {hovered.c2Total} from {hoveredClasses[1]})
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Shared AAs</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {hovered.sharedNames.map(n => (
              <span key={n} style={{
                fontSize: 13, padding: "3px 8px", borderRadius: 4,
                background: t.orangeBg, border: "1px solid " + t.orangeBorder,
                color: t.orange,
              }}>{n}</span>
            ))}
          </div>
        </div>
      )}

      {/* Class detail when selected */}
      {selectedClass && (
        <div style={{ padding: 16, background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: 10, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: getClassColor(selectedClass, isDark) }}>
              {CLASSES[selectedClass]?.name} AAs
            </span>
            <span style={{ fontSize: 15, color: t.textMuted }}>({classCounts[selectedClass]} total)</span>
          </div>

          {/* Sort other classes by overlap */}
          <div style={{ fontSize: 13, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Overlap with other classes (sorted)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 6 }}>
            {CLASS_IDS.filter(c => c !== selectedClass)
              .map(c => ({ id: c, ...pairData[getPairKey(selectedClass, c)] }))
              .sort((a, b) => a.overlapPct - b.overlapPct)
              .map(item => {
                const cc = getClassColor(item.id, isDark);
                return (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 12px", borderRadius: 6,
                    background: getCellColor(item.overlapPct),
                    borderLeft: "3px solid " + cc + "66",
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: cc, minWidth: 40 }}>{item.id}</span>
                    <div style={{
                      flex: 1, height: 6, background: t.barEmpty, borderRadius: 3, overflow: "hidden",
                    }}>
                      <div style={{
                        width: item.overlapPct + "%", height: "100%",
                        background: getCellTextColor(item.overlapPct),
                        borderRadius: 3, transition: "width 0.3s",
                      }} />
                    </div>
                    <span style={{
                      fontSize: 15, fontWeight: 700, color: getCellTextColor(item.overlapPct),
                      minWidth: 36, textAlign: "right",
                    }}>{item.overlapPct}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Best/Worst combos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ padding: 16, background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: 10 }}>
          <SectionHeader color={getCellTextColor(20)}>Least Overlap Pairs</SectionHeader>
          <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 10 }}>Best for maximizing unique AAs</div>
          {Object.entries(pairData)
            .sort(([, a], [, b]) => a.overlapPct - b.overlapPct)
            .slice(0, 8)
            .map(([key, data]) => {
              const [c1, c2] = key.split("+");
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, padding: "5px 0" }}>
                  <span style={{ fontWeight: 700, color: getClassColor(c1, isDark), fontSize: 16, minWidth: 36 }}>{c1}</span>
                  <span style={{ color: t.textMuted, fontSize: 14 }}>+</span>
                  <span style={{ fontWeight: 700, color: getClassColor(c2, isDark), fontSize: 16, minWidth: 36 }}>{c2}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 17, fontWeight: 700, color: getCellTextColor(data.overlapPct) }}>{data.overlapPct}%</span>
                </div>
              );
            })}
        </div>
        <div style={{ padding: 16, background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: 10 }}>
          <SectionHeader color={getCellTextColor(70)}>Most Overlap Pairs</SectionHeader>
          <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 10 }}>High redundancy when combined</div>
          {Object.entries(pairData)
            .sort(([, a], [, b]) => b.overlapPct - a.overlapPct)
            .slice(0, 8)
            .map(([key, data]) => {
              const [c1, c2] = key.split("+");
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, padding: "5px 0" }}>
                  <span style={{ fontWeight: 700, color: getClassColor(c1, isDark), fontSize: 16, minWidth: 36 }}>{c1}</span>
                  <span style={{ color: t.textMuted, fontSize: 14 }}>+</span>
                  <span style={{ fontWeight: 700, color: getClassColor(c2, isDark), fontSize: 16, minWidth: 36 }}>{c2}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 17, fontWeight: 700, color: getCellTextColor(data.overlapPct) }}>{data.overlapPct}%</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        padding: 16, background: t.rulesBg, border: "1px solid " + t.rulesBorder,
        borderRadius: 10, fontSize: 15, color: t.textSecondary, lineHeight: 1.7,
      }}>
        <SectionHeader>How AA Overlap Works in EQ Legends</SectionHeader>
        <p style={{ margin: "0 0 10px" }}>
          In EQ Legends, your character picks <strong style={{ color: t.text }}>3 classes</strong>. You gain access to <strong style={{ color: t.text }}>all AAs from all 3 classes</strong> — but AAs that appear on multiple classes don't stack or double up.
        </p>
        <p style={{ margin: "0 0 10px" }}>
          <strong style={{ color: t.gold }}>General AAs</strong> (stat boosts, regen, run speed) are shared by every class — these always overlap.
          <strong style={{ color: t.gold }}> Archetype AAs</strong> (Combat Agility, Healing Gift, etc.) are shared within class groupings: Melee, Caster, Priest.
          <strong style={{ color: t.gold }}> Class AAs</strong> are the unique selling points (Manaburn, Lifeburn, Flurry, etc.).
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: t.green }}>Optimal strategy:</strong> Pick classes from <em>different archetypes</em> (e.g., one Melee + one Priest + one Caster) to maximize unique AAs and minimize overlap. Same-archetype combos (e.g., WAR+PAL+SHD) have massive overlap.
        </p>
      </div>
    </div>
  );
}

function AAListView() {
  const t = useTheme();
  const [filterClass, setFilterClass] = useState(null);

  const groups = useMemo(() => {
    const filter = aa => !filterClass || aa.classes.includes(filterClass);
    return {
      general: GENERAL_AAS.filter(filter),
      archetype: ARCHETYPE_AAS.filter(filter),
      class: CLASS_AAS.filter(filter),
    };
  }, [filterClass]);

  const renderAA = (aa) => (
    <div key={aa.name} style={{ padding: "12px 16px", marginBottom: 4, borderRadius: 10, background: t.cardBg, border: "1px solid " + t.cardBorder }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: t.text }}>{aa.name}</span>
        <span style={{ fontSize: 12, padding: "2px 7px", borderRadius: 4, background: aa.era === "Luclin" ? t.goldBg : t.rulesBg, color: aa.era === "Luclin" ? t.gold : "#9070c0", fontWeight: 600, letterSpacing: 0.5 }}>{aa.era}</span>
        <span style={{ fontSize: 14, color: t.textMuted }}>{aa.ranks} rank{aa.ranks > 1 ? "s" : ""} ({aa.cost.join("/")} pts)</span>
        {aa.archetype_group && <span style={{ fontSize: 12, padding: "2px 7px", borderRadius: 4, background: t.tagBg, color: t.textMuted }}>{aa.archetype_group}</span>}
      </div>
      <p style={{ margin: "0 0 6px", fontSize: 15, color: t.textSecondary, lineHeight: 1.5 }}>{aa.description}</p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {aa.category === "general" ? (
          <span style={{ fontSize: 13, color: t.textMuted, fontStyle: "italic" }}>All Classes</span>
        ) : aa.classes.map(cl => <ClassBadge key={cl} id={cl} small />)}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => setFilterClass(null)}
          style={{
            padding: "5px 14px", borderRadius: 5, cursor: "pointer", fontSize: 14,
            fontFamily: "inherit", fontWeight: !filterClass ? 700 : 400,
            background: !filterClass ? t.goldBg : "transparent",
            color: !filterClass ? t.gold : t.textMuted,
            border: "1px solid " + (!filterClass ? t.goldBorder : t.cardBorder),
          }}
        >All</button>
        {CLASS_IDS.map(id => (
          <ClassBadge key={id} id={id} small selected={filterClass === id} onClick={() => setFilterClass(filterClass === id ? null : id)} />
        ))}
      </div>

      {groups.general.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>General AAs ({groups.general.length})</SectionHeader>
          {groups.general.map(renderAA)}
        </div>
      )}
      {groups.archetype.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Archetype AAs ({groups.archetype.length})</SectionHeader>
          {groups.archetype.map(renderAA)}
        </div>
      )}
      {groups.class.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Class AAs ({groups.class.length})</SectionHeader>
          {groups.class.map(renderAA)}
        </div>
      )}
    </div>
  );
}

function AAView() {
  const t = useTheme();
  const [subView, setSubView] = useState("list");
  return (
    <div style={{ maxWidth: subView === "matrix" ? 1060 : 900, margin: "0 auto", transition: "max-width 0.3s" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
        {[{ id: "list", label: "List" }, { id: "matrix", label: "Overlap Matrix" }].map(tab => (
          <button key={tab.id} onClick={() => setSubView(tab.id)}
            style={{
              padding: "6px 16px", borderRadius: 5, cursor: "pointer", fontSize: 15,
              fontFamily: "inherit", letterSpacing: 1, fontWeight: subView === tab.id ? 700 : 400,
              background: subView === tab.id ? t.goldBg : "transparent",
              color: subView === tab.id ? t.gold : t.textMuted,
              border: "1px solid " + (subView === tab.id ? t.goldBorder : t.cardBorder),
            }}
          >{tab.label}</button>
        ))}
      </div>
      {subView === "list" && <AAListView />}
      {subView === "matrix" && <AAMatrixView />}
    </div>
  );
}

function SpellsView() {
  const t = useTheme();
  const isDark = useIsDark();
  const [allSpells, setAllSpells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filterClass, setFilterClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCount, setShowCount] = useState(50);

  useEffect(() => {
    let isCancelled = false;

    async function loadSpells() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/data/spells");
        if (!response.ok) throw new Error(`Failed to load spells (${response.status})`);
        const payload = await response.json();
        if (!isCancelled) {
          setAllSpells(payload);
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadError(error instanceof Error ? error.message : "Failed to load spells");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSpells();
    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredSpells = useMemo(() => {
    let spells = filterClass
      ? allSpells.filter(s => s.classAccess.some(a => a.classId === filterClass))
      : allSpells;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      spells = spells.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return spells;
  }, [filterClass, searchQuery]);

  // Reset pagination when filters change
  useEffect(() => { setShowCount(50); }, [filterClass, searchQuery]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {loadError && (
        <div style={{ padding: "12px 14px", marginBottom: 12, borderRadius: 8, background: t.redBg, color: t.red, border: "1px solid " + t.redBorder }}>
          {loadError}
        </div>
      )}

      <input
        type="text"
        placeholder="Search spells by name or description..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box", padding: "10px 14px", fontSize: 16,
          fontFamily: "inherit", borderRadius: 8, border: "1px solid " + t.inputBorder,
          background: t.inputBg, color: t.text, marginBottom: 14, outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = t.goldBorder}
        onBlur={e => e.target.style.borderColor = t.inputBorder}
      />

      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setFilterClass(null)}
          style={{
            padding: "5px 14px", borderRadius: 5, cursor: "pointer", fontSize: 14,
            fontFamily: "inherit", fontWeight: !filterClass ? 700 : 400,
            background: !filterClass ? t.goldBg : "transparent",
            color: !filterClass ? t.gold : t.textMuted,
            border: "1px solid " + (!filterClass ? t.goldBorder : t.cardBorder),
          }}
        >All</button>
        {CLASS_IDS.map(id => (
          <ClassBadge key={id} id={id} small selected={filterClass === id} onClick={() => setFilterClass(filterClass === id ? null : id)} />
        ))}
      </div>

      <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 12, textAlign: "center" }}>
        {isLoading ? "Loading spells..." : `${filteredSpells.length} ${filteredSpells.length === 1 ? "spell" : "spells"}`}
      </div>

      {filteredSpells.slice(0, showCount).map(s => {
        const minLevel = Math.min(...s.classAccess.map(a => a.level));
        const maxLevel = Math.max(...s.classAccess.map(a => a.level));
        const levelStr = minLevel === maxLevel ? `Lvl ${minLevel}` : `Lvl ${minLevel}-${maxLevel}`;
        return (
          <div key={s.id} style={{ padding: "12px 16px", marginBottom: 4, borderRadius: 10, background: t.cardBg, border: "1px solid " + t.cardBorder }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: t.text }}>{s.name}</span>
              <span style={{
                fontSize: 12, padding: "2px 7px", borderRadius: 4, fontWeight: 600, letterSpacing: 0.5,
                background: s.kind === "song" ? t.orangeBg : t.goldBg,
                color: s.kind === "song" ? t.orange : t.gold,
              }}>{s.kind === "song" ? "Song" : "Spell"}</span>
              <span style={{ fontSize: 14, color: t.textMuted }}>{levelStr}</span>
              {s.manaValues.length > 0 && (
                <span style={{ fontSize: 14, color: t.blue }}>
                  {s.manaValues.length === 1 ? s.manaValues[0] + " mana" : s.manaValues[0] + "-" + s.manaValues[s.manaValues.length - 1] + " mana"}
                </span>
              )}
              {s.schools.map(sc => (
                <span key={sc} style={{ fontSize: 12, padding: "2px 7px", borderRadius: 4, background: t.tagBg, color: t.textMuted }}>{sc}</span>
              ))}
            </div>
            <p style={{ margin: "0 0 6px", fontSize: 15, color: t.textSecondary, lineHeight: 1.5 }}>{s.description}</p>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
              {s.classAccess.map(a => (
                <span key={a.classId} style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  padding: "2px 7px", borderRadius: 4, fontSize: 13,
                  background: getClassColor(a.classId, isDark) + (isDark ? "22" : "18"),
                  color: getClassColor(a.classId, isDark),
                  border: "1px solid " + getClassColor(a.classId, isDark) + (isDark ? "44" : "40"),
                  fontWeight: 600,
                }}>
                  {a.classId} <span style={{ fontWeight: 400, opacity: 0.7 }}>{a.level}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}

      {showCount < filteredSpells.length && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => setShowCount(c => c + 50)}
            style={{
              padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 15,
              fontFamily: "inherit", fontWeight: 600, letterSpacing: 1,
              background: t.goldBg, color: t.gold, border: "1px solid " + t.goldBorder,
            }}
          >Show More ({filteredSpells.length - showCount} remaining)</button>
        </div>
      )}
    </div>
  );
}

function ZonesView() {
  const t = useTheme();
  const [allZones, setAllZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [eraFilter, setEraFilter] = useState(null);
  const [showCount, setShowCount] = useState(40);

  useEffect(() => {
    let isCancelled = false;

    async function loadZones() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/data/zones");
        if (!response.ok) throw new Error(`Failed to load zones (${response.status})`);
        const payload = await response.json();
        if (!isCancelled) {
          setAllZones(payload);
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadError(error instanceof Error ? error.message : "Failed to load zones");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadZones();
    return () => {
      isCancelled = true;
    };
  }, []);

  const eras = useMemo(() => [...new Set(allZones.map((zone) => zone.era))].sort(), [allZones]);

  const filteredZones = useMemo(() => {
    let zones = allZones;

    if (eraFilter) {
      zones = zones.filter((zone) => zone.era === eraFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      zones = zones.filter((zone) => {
        const haystack = [
          zone.name,
          zone.summary,
          zone.levelRange ?? "",
          zone.monsterTypes.join(" "),
          zone.notableNpcs.join(" "),
          zone.adjacentZones.join(" "),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    return zones;
  }, [eraFilter, searchQuery]);

  useEffect(() => {
    setShowCount(40);
  }, [eraFilter, searchQuery]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {loadError && (
        <div style={{ padding: "12px 14px", marginBottom: 12, borderRadius: 8, background: t.redBg, color: t.red, border: "1px solid " + t.redBorder }}>
          {loadError}
        </div>
      )}

      <input
        type="text"
        placeholder="Search zones, monsters, NPCs, or adjacent zones..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box", padding: "10px 14px", fontSize: 16,
          fontFamily: "inherit", borderRadius: 8, border: "1px solid " + t.inputBorder,
          background: t.inputBg, color: t.text, marginBottom: 14, outline: "none",
        }}
      />

      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setEraFilter(null)}
          style={{
            padding: "5px 14px", borderRadius: 5, cursor: "pointer", fontSize: 14,
            fontFamily: "inherit", fontWeight: !eraFilter ? 700 : 400,
            background: !eraFilter ? t.goldBg : "transparent",
            color: !eraFilter ? t.gold : t.textMuted,
            border: "1px solid " + (!eraFilter ? t.goldBorder : t.cardBorder),
          }}
        >All Eras</button>
        {eras.map(era => (
          <button key={era} onClick={() => setEraFilter(eraFilter === era ? null : era)}
            style={{
              padding: "5px 14px", borderRadius: 5, cursor: "pointer", fontSize: 14,
              fontFamily: "inherit", fontWeight: eraFilter === era ? 700 : 400,
              background: eraFilter === era ? t.goldBg : "transparent",
              color: eraFilter === era ? t.gold : t.textMuted,
              border: "1px solid " + (eraFilter === era ? t.goldBorder : t.cardBorder),
            }}
          >{era}</button>
        ))}
      </div>

      <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 12, textAlign: "center" }}>
        {isLoading ? "Loading zones..." : `${filteredZones.length} ${filteredZones.length === 1 ? "zone" : "zones"}`}
      </div>

      {filteredZones.slice(0, showCount).map(zone => (
        <div key={zone.id} style={{ padding: "14px 16px", marginBottom: 6, borderRadius: 10, background: t.cardBg, border: "1px solid " + t.cardBorder }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: t.text }}>{zone.name}</span>
            <span style={{ fontSize: 12, padding: "2px 7px", borderRadius: 4, fontWeight: 600, background: t.goldBg, color: t.gold }}>{zone.era}</span>
            {zone.levelRange && (
              <span style={{ fontSize: 14, color: t.blue }}>Lvl {zone.levelRange}</span>
            )}
            {zone.zem && (
              <span style={{ fontSize: 13, color: t.textMuted }}>ZEM {zone.zem}</span>
            )}
            {zone.whoName && (
              <span style={{ fontSize: 13, color: t.textMuted }}>/who {zone.whoName}</span>
            )}
          </div>

          <p style={{ margin: "0 0 8px", fontSize: 15, color: t.textSecondary, lineHeight: 1.6 }}>
            {zone.summary}
          </p>

          {zone.monsterTypes.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Monsters</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {zone.monsterTypes.slice(0, 10).map(monster => (
                  <span key={monster} style={{ fontSize: 12, padding: "2px 7px", borderRadius: 4, background: t.tagBg, color: t.textMuted }}>{monster}</span>
                ))}
                {zone.monsterTypes.length > 10 && (
                  <span style={{ fontSize: 12, color: t.textMuted }}>+{zone.monsterTypes.length - 10} more</span>
                )}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: 6 }}>
            {zone.adjacentZones.length > 0 && (
              <div style={{ fontSize: 14, color: t.textSecondary }}>
                <span style={{ color: t.textMuted }}>Adjacent:</span> {zone.adjacentZones.join(", ")}
              </div>
            )}
            {zone.notableNpcs.length > 0 && (
              <div style={{ fontSize: 14, color: t.textSecondary }}>
                <span style={{ color: t.textMuted }}>Notable NPCs:</span> {zone.notableNpcs.slice(0, 8).join(", ")}
                {zone.notableNpcs.length > 8 ? ` +${zone.notableNpcs.length - 8} more` : ""}
              </div>
            )}
            {zone.relatedQuests.length > 0 && (
              <div style={{ fontSize: 14, color: t.textSecondary }}>
                <span style={{ color: t.textMuted }}>Quests:</span> {zone.relatedQuests.slice(0, 6).join(", ")}
                {zone.relatedQuests.length > 6 ? ` +${zone.relatedQuests.length - 6} more` : ""}
              </div>
            )}
          </div>
        </div>
      ))}

      {showCount < filteredZones.length && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => setShowCount(c => c + 40)}
            style={{
              padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 15,
              fontFamily: "inherit", fontWeight: 600, letterSpacing: 1,
              background: t.goldBg, color: t.gold, border: "1px solid " + t.goldBorder,
            }}
          >Show More ({filteredZones.length - showCount} remaining)</button>
        </div>
      )}
    </div>
  );
}

function AboutView() {
  const t = useTheme();
  const linkCardStyle = {
    padding: "14px 18px",
    background: t.cardBg,
    border: "1px solid " + t.cardBorder,
    borderRadius: 10,
    marginBottom: 8,
    transition: "border-color 0.2s",
  };
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <SectionHeader>What is EQ Legends?</SectionHeader>
        <div style={{ fontSize: 16, color: t.textSecondary, lineHeight: 1.8 }}>
          <strong style={{ color: t.text }}>EQ Legends</strong> is an upcoming reimagining of EverQuest built around a flexible multiclass system.
          Every character picks a race and <strong style={{ color: t.text }}>3 classes</strong>, gaining access to all spells, abilities, and gear from each.
        </div>
        <div style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.8, marginTop: 12 }}>
          <div>Your <strong style={{ color: t.text }}>primary class</strong> is gated by race — the other 2 are free choice.</div>
          <div>Only <strong style={{ color: t.text }}>1 pet maximum</strong> per player, regardless of how many pet classes you take.</div>
          <div>Classes are <strong style={{ color: t.text }}>not permanent</strong> — you can swap at major city hubs.</div>
          <div>All content is designed to be <strong style={{ color: t.text }}>soloable</strong>, with a focus on solo and small group play.</div>
          <div><strong style={{ color: t.text }}>15 races</strong> at launch including Kerran, Iksar, and Froglok.</div>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <SectionHeader>How This Tool Works</SectionHeader>
        <div style={{ fontSize: 16, color: t.textSecondary, lineHeight: 1.8, marginBottom: 12 }}>
          This theory-crafting tool helps you explore every possible 3-class combination and understand how they compare.
        </div>
        <div style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.8 }}>
          <div><strong style={{ color: t.text }}>Ratings</strong> — Each build is scored on Tank, Heal, DPS, Utility, and Solo on a 1–10 scale. Scores are computed by combining the individual class contributions, accounting for synergies and diminishing returns.</div>
          <div style={{ marginTop: 8 }}><strong style={{ color: t.text }}>AA Overlap Analysis</strong> — Measures how much Alternate Advancement overlap exists between your chosen classes. An efficiency score (1–10) indicates how well you cover General, Archetype, and Class AA categories without redundancy.</div>
          <div style={{ marginTop: 8 }}><strong style={{ color: t.text }}>Data Sources</strong> — AA data is drawn from the Luclin/Planes of Power era, covering 90+ AAs across General, Archetype, and Class categories.</div>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <SectionHeader>Resources</SectionHeader>
        <a href="https://eqlfaq.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
          <div style={linkCardStyle} onMouseOver={e => e.currentTarget.style.borderColor = t.cardBorderHover} onMouseOut={e => e.currentTarget.style.borderColor = t.cardBorder}>
            <div style={{ fontSize: 16, color: t.gold, fontWeight: 600 }}>eqlfaq.com</div>
            <div style={{ fontSize: 14, color: t.textMuted, marginTop: 4 }}>Community FAQ for EQ Legends — classes, races, and game mechanics</div>
          </div>
        </a>
        <a href="https://wiki.project1999.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
          <div style={linkCardStyle} onMouseOver={e => e.currentTarget.style.borderColor = t.cardBorderHover} onMouseOut={e => e.currentTarget.style.borderColor = t.cardBorder}>
            <div style={{ fontSize: 16, color: t.gold, fontWeight: 600 }}>Project 1999 Wiki</div>
            <div style={{ fontSize: 14, color: t.textMuted, marginTop: 4 }}>Classic EverQuest reference — spells, AAs, zones, items, and quest data</div>
          </div>
        </a>
      </div>

    </div>
  );
}

export default function EQMulticlassGuide() {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("eq-theme") !== "light"; } catch { return true; }
  });
  const [view, setView] = useState("combos");
  const [sel, setSel] = useState(null);
  const [selClass, setSelClass] = useState(null);
  const [tierF, setTierF] = useState(null);
  const [combos, setCombos] = useState(SEED_COMBOS);

  const t = isDark ? themes.dark : themes.light;

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try { localStorage.setItem("eq-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  useEffect(() => {
    fetch("/api/combos")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCombos(data.map(c => ({
            id: c.id, name: c.name, classes: [c.class1, c.class2, c.class3],
            race: c.race, tier: c.tier, summary: c.summary,
            ratings: { tank: c.tank, heal: c.heal, dps: c.dps, utility: c.utility, solo: c.solo },
            synergies: c.synergies || [], playstyle: c.playstyle, weakness: c.weakness,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = tierF ? combos.filter(c => c.tier === tierF) : combos;

  return (
    <ThemeContext.Provider value={t}>
    <IsDarkContext.Provider value={isDark}>
      <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Georgia', 'Times New Roman', serif", padding: "28px 20px", transition: "background 0.3s, color 0.3s" }}>

        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 13, letterSpacing: 6, textTransform: "uppercase", color: t.gold + "88", marginBottom: 4 }}>EverQuest Legends — July 2026</div>
          <h1 style={{ fontSize: 34, fontWeight: 400, margin: 0, color: t.gold, textShadow: isDark ? "0 0 40px rgba(198,164,78,0.15)" : "none", letterSpacing: 2 }}>Multiclass Theorycrafting</h1>
          <p style={{ fontSize: 16, color: t.textMuted, margin: "8px auto 0", fontStyle: "italic", maxWidth: 660 }}>
            Pick a race + 3 classes. 560 combinations. All content soloable. {combos.length} builds analyzed.
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { id: "about", label: "About" },
            { id: "builder", label: "Builder" },
            { id: "combos", label: "Builds (" + combos.length + ")" },
            { id: "classes", label: "Classes (" + CLASS_IDS.length + ")" },
            { id: "races", label: "Races (" + Object.keys(RACES).length + ")" },
            { id: "aa", label: "AAs (" + ALL_AAS.length + ")" },
            { id: "spells", label: "Spells" },
            { id: "zones", label: "Zones" },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setView(tab.id); setSel(null); setSelClass(null); setTierF(null); }}
              style={{
                padding: "10px 20px", border: "1px solid",
                borderColor: view === tab.id ? t.goldBorder : t.cardBorder,
                background: view === tab.id ? t.goldBg : "transparent",
                color: view === tab.id ? t.gold : t.textMuted,
                borderRadius: 8, cursor: "pointer", fontSize: 15,
                fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase",
                fontWeight: view === tab.id ? 700 : 400, transition: "all 0.2s",
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Builder */}
        {view === "builder" && <ComboBuilder />}

        {/* Builds List */}
        {view === "combos" && !sel && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
              {[null, "S", "A", "B"].map(tier => (
                <button key={tier || "all"} onClick={() => setTierF(tier)}
                  style={{
                    padding: "6px 16px", borderRadius: 5, cursor: "pointer", fontSize: 15,
                    fontFamily: "inherit", letterSpacing: 1, fontWeight: tierF === tier ? 700 : 400,
                    background: tierF === tier ? t.goldBg : "transparent",
                    color: tierF === tier ? t.gold : t.textMuted,
                    border: "1px solid " + (tierF === tier ? t.goldBorder : t.cardBorder),
                  }}
                >{tier || "All"}</button>
              ))}
            </div>
            {filtered.map(c => (
              <div key={c.id} onClick={() => setSel(c)}
                style={{
                  padding: "14px 18px", marginBottom: 6, borderRadius: 10,
                  background: t.cardBg, border: "1px solid " + t.cardBorder,
                  cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.cardBgHover; e.currentTarget.style.borderColor = t.cardBorderHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.cardBg; e.currentTarget.style.borderColor = t.cardBorder; }}
              >
                <TierBadge tier={c.tier} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 18, fontWeight: 600, color: t.text }}>{c.name}</span>
                    <span style={{ fontSize: 15, color: t.textMuted }}>{RACES[c.race]?.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>{c.classes.map(cl => <ClassBadge key={cl} id={cl} small />)}</div>
                  <p style={{ fontSize: 15, color: t.textMuted, margin: "5px 0 0", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.summary}</p>
                </div>
                <span style={{ color: t.textFaint, fontSize: 20, flexShrink: 0 }}>&rsaquo;</span>
              </div>
            ))}
          </div>
        )}

        {/* Build Detail */}
        {view === "combos" && sel && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: t.gold, cursor: "pointer", fontSize: 15, fontFamily: "inherit", padding: 0, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>&larr; Back</button>
            <div style={{ padding: 24, background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <TierBadge tier={sel.tier} />
                <div>
                  <h2 style={{ margin: 0, fontSize: 26, color: t.gold, fontWeight: 400 }}>{sel.name}</h2>
                  <span style={{ fontSize: 15, color: t.textMuted }}>{RACES[sel.race]?.name} — {RACES[sel.race]?.traits}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>{sel.classes.map(cl => <ClassBadge key={cl} id={cl} />)}</div>
              <p style={{ fontSize: 17, color: t.textSecondary, lineHeight: 1.7, margin: "0 0 18px" }}>{sel.summary}</p>

              <div style={{ padding: 14, background: t.cardBg, borderRadius: 10, marginBottom: 20 }}>
                <StarRating value={sel.ratings.tank} label="Tank" />
                <StarRating value={sel.ratings.heal} label="Heal" />
                <StarRating value={sel.ratings.dps} label="DPS" />
                <StarRating value={sel.ratings.utility} label="Util" />
                <StarRating value={sel.ratings.solo} label="Solo" />
              </div>

              <SectionHeader>Synergies</SectionHeader>
              <div style={{ marginBottom: 20 }}>{sel.synergies.map((s, i) => (
                <div key={i} style={{ padding: "8px 14px", marginBottom: 4, borderRadius: 6, background: t.goldBg, borderLeft: "3px solid " + t.goldBorder, fontSize: 16, color: t.textSecondary, lineHeight: 1.6 }}>{s}</div>
              ))}</div>

              <SectionHeader>How to Play</SectionHeader>
              <p style={{ fontSize: 16, color: t.textSecondary, lineHeight: 1.7, margin: "0 0 20px", padding: "12px 16px", background: t.cardBg, borderRadius: 10 }}>{sel.playstyle}</p>

              <SectionHeader color={t.red}>Weaknesses</SectionHeader>
              <p style={{ fontSize: 16, color: t.red, lineHeight: 1.7, margin: "0 0 20px", padding: "12px 16px", background: t.redBg, borderRadius: 10, borderLeft: "3px solid " + t.redBorder }}>{sel.weakness}</p>

              {/* AA Overlap for this build */}
              {(() => { const ev = evaluateCombo(sel.classes); return ev.aa ? <AAOverlapSection aa={ev.aa} /> : null; })()}

              <SectionHeader>Class Breakdown</SectionHeader>
              {sel.classes.map(cl => { const c = CLASSES[cl]; if (!c) return null; const cc = getClassColor(cl, isDark); return (
                <div key={cl} style={{ padding: 14, background: cc + t.classBgAlpha, borderRadius: 10, marginBottom: 6, borderLeft: "4px solid " + cc + t.classBorderAlpha }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: cc, marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 5 }}>{c.archetype} — {c.armor} — {c.mana_stat ? c.mana_stat + " caster" : "No mana"}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>{c.abilities.map(a => (<span key={a} style={{ fontSize: 14, padding: "3px 8px", background: t.abilityBg, borderRadius: 4, color: t.textSecondary }}>{a}</span>))}</div>
                  <div style={{ fontSize: 16, color: t.textSecondary, lineHeight: 1.6 }}>{c.strengths}</div>
                </div>
              ); })}
            </div>
          </div>
        )}

        {/* Classes List */}
        {view === "classes" && !selClass && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {["Tank", "Priest", "Caster", "Melee"].map(arch => (
              <div key={arch} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid " + t.cardBorder }}>{arch}s</div>
                {Object.entries(CLASSES).filter(([, c]) => c.archetype === arch).map(([id, c]) => {
                  const cc = getClassColor(id, isDark);
                  return (
                  <div key={id} onClick={() => setSelClass(id)}
                    style={{
                      padding: "12px 16px", marginBottom: 4, borderRadius: 10,
                      background: t.cardBg, border: "1px solid " + t.cardBorder,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = cc + "0a"}
                    onMouseLeave={e => e.currentTarget.style.background = t.cardBg}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: cc, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 18, color: t.text }}>{c.name}</span>
                      <span style={{ fontSize: 15, color: t.textMuted, marginLeft: 10 }}>{c.armor} — {c.mana_stat || "No mana"}</span>
                    </div>
                    <span style={{ fontSize: 14, color: t.textMuted }}>In {combos.filter(co => co.classes.includes(id)).length} builds</span>
                  </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Class Detail */}
        {view === "classes" && selClass && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <button onClick={() => setSelClass(null)} style={{ background: "none", border: "none", color: t.gold, cursor: "pointer", fontSize: 15, fontFamily: "inherit", padding: 0, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>&larr; Back</button>
            {(() => { const c = CLASSES[selClass]; if (!c) return null; const cc = getClassColor(selClass, isDark); return (
              <div style={{ padding: 24, background: t.cardBg, border: "1px solid " + cc + "22", borderRadius: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: cc }} />
                  <h2 style={{ margin: 0, fontSize: 26, color: cc, fontWeight: 400 }}>{c.name}</h2>
                </div>
                <div style={{ fontSize: 16, color: t.textMuted, marginBottom: 14 }}>{c.archetype} — {c.armor} Armor — {c.mana_stat ? c.mana_stat + "-based mana" : "No mana pool"}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                  {c.abilities.map(a => (<span key={a} style={{ fontSize: 15, padding: "5px 12px", background: cc + "15", border: "1px solid " + cc + "22", borderRadius: 5, color: cc }}>{a}</span>))}
                </div>

                {c.key_abilities?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <SectionHeader>Key Abilities</SectionHeader>
                    {c.key_abilities.map((ka, i) => (
                      <div key={i} style={{ padding: "8px 12px", marginBottom: 4, borderRadius: 6, background: cc + t.classBgAlpha, fontSize: 16, lineHeight: 1.6 }}>
                        <span style={{ color: cc, fontWeight: 600 }}>{ka.name}</span>
                        <span style={{ color: t.textMuted }}> ({ka.category})</span>
                        <span style={{ color: t.textSecondary }}> — {ka.why_it_matters}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: 14, background: t.cardBg, borderRadius: 10, marginBottom: 10 }}>
                  <SectionHeader>Strengths</SectionHeader>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: t.textSecondary }}>{c.strengths}</p>
                </div>
                <div style={{ padding: 14, background: t.redBg, borderRadius: 10, marginBottom: 16 }}>
                  <SectionHeader color={t.red}>Weakness</SectionHeader>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: t.red }}>{c.weakness}</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <SectionHeader color={t.textMuted}>Synergy Tags</SectionHeader>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {c.synergy_tags.map(tag => (
                      <span key={tag} style={{ fontSize: 13, padding: "3px 8px", background: t.tagBg, borderRadius: 4, color: t.textMuted, fontFamily: "monospace" }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <SectionHeader color={t.textMuted}>Primary Class Races</SectionHeader>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
                  {Object.entries(RACES).filter(([, r]) => r.classes_primary?.includes(selClass)).map(([rid, r]) => (
                    <span key={rid} style={{ fontSize: 15, padding: "4px 10px", background: t.abilityBg, borderRadius: 5, color: t.textSecondary }}>{r.name}</span>
                  ))}
                </div>

                <SectionHeader color={t.textMuted}>Appears in Builds</SectionHeader>
                {combos.filter(co => co.classes.includes(selClass)).map(co => (
                  <div key={co.id} onClick={() => { setView("combos"); setSel(co); setSelClass(null); }}
                    style={{ fontSize: 16, color: t.gold, cursor: "pointer", padding: "6px 0", borderBottom: "1px solid " + t.cardBorder }}
                  >
                    <TierBadge tier={co.tier} />
                    <span style={{ marginLeft: 10 }}>{co.name}</span>
                    <span style={{ color: t.textMuted, marginLeft: 10 }}>({co.classes.map(cl => CLASSES[cl]?.name).join(" + ")})</span>
                  </div>
                ))}
              </div>
            ); })()}
          </div>
        )}

        {/* AAs */}
        {view === "aa" && <AAView />}

        {/* Spells */}
        {view === "spells" && <SpellsView />}

        {/* Zones */}
        {view === "zones" && <ZonesView />}

        {/* Races */}
        {view === "races" && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <TopRacePicks />
            <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 16, textAlign: "center", letterSpacing: 1, textTransform: "uppercase" }}>Primary class is race-gated — additional 2 classes are free choice</div>
            {Object.entries(RACES).map(([rid, r]) => (
              <div key={rid} style={{ padding: "12px 16px", marginBottom: 5, borderRadius: 10, background: t.cardBg, border: "1px solid " + t.cardBorder }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 18, color: t.text, fontWeight: 600 }}>{r.name}</span>
                  <span style={{ fontSize: 14, color: t.textMuted }}>{r.classes_primary?.length} primary</span>
                </div>
                <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 6, lineHeight: 1.5, fontStyle: "italic" }}>{r.traits}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{r.classes_primary?.map(cl => <ClassBadge key={cl} id={cl} small />)}</div>
              </div>
            ))}
          </div>
        )}

        {/* About */}
        {view === "about" && <AboutView />}

      </div>
    </IsDarkContext.Provider>
    </ThemeContext.Provider>
  );
}
