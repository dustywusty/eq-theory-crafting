import { SynergyRule } from "./types";

export const SYNERGY_RULES: Record<string, SynergyRule> = {
  slow_is_king: {
    id: "slow_is_king",
    description: "Slow (SHM 75% or ENC 65%) is the single highest-impact ability. It effectively multiplies your tank's survivability by 3-4x.",
    implication: "Any build without slow has a major gap."
  },
  mana_sustain_loop: {
    id: "mana_sustain_loop",
    description: "NEC Lich + SHM Canni together = functionally unlimited mana. NEC Lich + ENC Clarity also works. SHM Canni alone is good. ENC Clarity alone is good but not infinite.",
    implication: "Builds with mana sustain can fight indefinitely without sitting."
  },
  fd_safety: {
    id: "fd_safety",
    description: "Feign Death (SK, NEC, MNK) is the best emergency escape. Double FD (SK+NEC, SK+MNK) is even safer.",
    implication: "FD allows aggressive pulling and safe recovery from mistakes."
  },
  dots_break_mez: {
    id: "dots_break_mez",
    description: "DoT damage ticks break Mesmerize. NEC/SHM/SK/DRU DoTs will break ENC/BRD mez.",
    implication: "NEC+ENC combos require careful targeting — only DoT the active target, not mezzed adds."
  },
  one_pet_max: {
    id: "one_pet_max",
    description: "Only 1 pet active at a time, regardless of classes.",
    implication: "Taking multiple pet classes (SK+NEC+MAG) is wasteful. Choose the BEST pet for your build."
  },
  armor_upgrade: {
    id: "armor_upgrade",
    description: "You wear the best armor ANY of your 3 classes allows.",
    implication: "Adding a plate class (WAR/PAL/SHD/CLR/BRD) to a cloth/chain build is a massive survivability upgrade."
  },
  haste_stacking: {
    id: "haste_stacking",
    description: "SHM spell haste, ENC spell haste, and BRD song haste may not all stack. In classic EQ only the highest haste applied.",
    implication: "Don't take multiple haste sources expecting them to stack unless confirmed."
  },
  charm_as_tank: {
    id: "charm_as_tank",
    description: "ENC/DRU Charm turns an enemy mob into your tank AND your DPS. The charmed mob hits as hard as it normally would.",
    implication: "Builds without a tank class can use charm to fill the gap, but charm breaks are dangerous."
  },
  clr_hammer_proc: {
    id: "clr_hammer_proc",
    description: "CLR's Summoned Hammer has an extremely high proc rate damage effect. It was considered the best weapon regardless of class.",
    implication: "Any build with CLR should use the summoned hammer for melee."
  }
};
