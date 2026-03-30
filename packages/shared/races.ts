import { EQRace } from "./types";

export const EQ_RACES: Record<string, EQRace> = {
  HUM: { id: "HUM", name: "Human", size: "Medium", alignment: "Neutral", traits: "No special traits, no penalties. Widest class access.", classes_primary: ["WAR","PAL","SHD","CLR","DRU","ENC","MAG","MNK","NEC","WIZ","RNG","ROG"] },
  BAR: { id: "BAR", name: "Barbarian", size: "Large", alignment: "Neutral", traits: "Slam (interrupt), +10 Cold Resist. Large race.", classes_primary: ["WAR","ROG","SHM"] },
  DEF: { id: "DEF", name: "Dark Elf", size: "Small", alignment: "Evil", traits: "Ultravision, Hide (50). Evil race.", classes_primary: ["WAR","SHD","CLR","ENC","MAG","NEC","WIZ","ROG"] },
  DWF: { id: "DWF", name: "Dwarf", size: "Small", alignment: "Good", traits: "Infravision, +5 Poison/Magic Resist. Small race.", classes_primary: ["WAR","PAL","CLR","ROG"] },
  ERU: { id: "ERU", name: "Erudite", size: "Medium", alignment: "Neutral", traits: "+5 Magic Resist, -5 Disease Resist. Highest INT.", classes_primary: ["PAL","SHD","CLR","ENC","MAG","NEC","WIZ"] },
  GNM: { id: "GNM", name: "Gnome", size: "Small", alignment: "Good", traits: "Tinkering tradeskill. Small race.", classes_primary: ["WAR","PAL","SHD","CLR","ENC","MAG","NEC","WIZ","ROG"] },
  HEF: { id: "HEF", name: "Half Elf", size: "Medium", alignment: "Good", traits: "Infravision.", classes_primary: ["WAR","PAL","DRU","BRD","RNG","ROG"] },
  HFL: { id: "HFL", name: "Halfling", size: "Small", alignment: "Good", traits: "Infravision, Sneak/Hide (50). Small race.", classes_primary: ["WAR","PAL","CLR","DRU","RNG","ROG"] },
  HIE: { id: "HIE", name: "High Elf", size: "Medium", alignment: "Good", traits: "Infravision. Good faction everywhere.", classes_primary: ["PAL","CLR","ENC","MAG","WIZ"] },
  WEF: { id: "WEF", name: "Wood Elf", size: "Small", alignment: "Good", traits: "Infravision, Forage.", classes_primary: ["WAR","BRD","DRU","RNG","ROG"] },
  OGR: { id: "OGR", name: "Ogre", size: "Large", alignment: "Evil", traits: "★ FRONTAL STUN IMMUNITY ★ Slam. Highest STR/STA.", classes_primary: ["WAR","SHD","SHM"] },
  TRL: { id: "TRL", name: "Troll", size: "Large", alignment: "Evil", traits: "HP Regeneration, Slam. Evil race.", classes_primary: ["WAR","SHD","SHM"] },
  IKS: { id: "IKS", name: "Iksar", size: "Medium", alignment: "Evil", traits: "HP Regen, +15-35 AC bonus, Forage, Swim 100. Hated everywhere.", classes_primary: ["WAR","SHD","SHM","MNK","NEC"] },
  KER: { id: "KER", name: "Kerran", size: "Medium", alignment: "Good", traits: "New to EQL! Cat folk from Kerra Isle. Details TBD.", classes_primary: ["WAR","SHM","BRD","ROG"] },
  FRG: { id: "FRG", name: "Froglok", size: "Small", alignment: "Good", traits: "Ultravision. New starting area in Rathe Mountains.", classes_primary: ["WAR","PAL","SHD","CLR","SHM","NEC","WIZ","ROG"] }
};
