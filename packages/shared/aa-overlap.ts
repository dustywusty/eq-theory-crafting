import { ALL_AAS, AA, getClassAAs } from "./aas";

export interface AAOverlapResult {
  /** Total unique AAs you get from this combo */
  totalUniqueAAs: number;
  /** Total AAs if you just added up all 3 classes (before dedup) */
  totalRawAAs: number;
  /** Number of AAs that overlap (appear in 2+ of your classes) */
  overlapCount: number;
  /** Overlap percentage — lower is better (more efficient) */
  overlapPercent: number;
  /** AAs that are unique to just one of your chosen classes */
  exclusiveAAs: { classId: string; aas: AA[] }[];
  /** AAs shared by exactly 2 of your 3 chosen classes */
  sharedBy2: AA[];
  /** AAs shared by all 3 of your chosen classes */
  sharedBy3: AA[];
  /** Archetype groups covered by this combo */
  archetypeCoverage: string[];
  /** Key unique AAs from each class (the "selling points") */
  keyUniqueAAs: { classId: string; aas: string[] }[];
  /** Brief analysis text */
  overlapAnalysis: string;
  /** AA efficiency rating 1-10 */
  aaEfficiency: number;
}

export function analyzeAAOverlap(classIds: [string, string, string]): AAOverlapResult {
  const [c1, c2, c3] = classIds;
  const aas1 = getClassAAs(c1);
  const aas2 = getClassAAs(c2);
  const aas3 = getClassAAs(c3);

  // Build sets of AA names per class
  const set1 = new Set(aas1.map(a => a.name));
  const set2 = new Set(aas2.map(a => a.name));
  const set3 = new Set(aas3.map(a => a.name));

  // Union = total unique AAs
  const union = new Set([...set1, ...set2, ...set3]);
  const totalUniqueAAs = union.size;
  const totalRawAAs = set1.size + set2.size + set3.size;
  const overlapCount = totalRawAAs - totalUniqueAAs;
  const overlapPercent = totalRawAAs > 0 ? Math.round((overlapCount / totalRawAAs) * 100) : 0;

  // Classify each AA
  const sharedBy2: AA[] = [];
  const sharedBy3: AA[] = [];
  const exclusive1: AA[] = [];
  const exclusive2: AA[] = [];
  const exclusive3: AA[] = [];

  for (const aaName of union) {
    const in1 = set1.has(aaName);
    const in2 = set2.has(aaName);
    const in3 = set3.has(aaName);
    const count = (in1 ? 1 : 0) + (in2 ? 1 : 0) + (in3 ? 1 : 0);
    const aa = ALL_AAS.find(a => a.name === aaName);
    if (!aa) continue;

    if (count === 3) {
      sharedBy3.push(aa);
    } else if (count === 2) {
      sharedBy2.push(aa);
    } else {
      if (in1) exclusive1.push(aa);
      if (in2) exclusive2.push(aa);
      if (in3) exclusive3.push(aa);
    }
  }

  const exclusiveAAs = [
    { classId: c1, aas: exclusive1 },
    { classId: c2, aas: exclusive2 },
    { classId: c3, aas: exclusive3 },
  ];

  // Archetype coverage
  const archetypeGroups = new Set<string>();
  for (const aaName of union) {
    const aa = ALL_AAS.find(a => a.name === aaName);
    if (aa?.archetype_group) archetypeGroups.add(aa.archetype_group);
  }
  const archetypeCoverage = [...archetypeGroups];

  // Key unique AAs (class-specific, non-general, non-archetype)
  const keyUniqueAAs = classIds.map(cid => {
    const classSpecific = ALL_AAS.filter(
      aa => aa.category === "class" && aa.classes.includes(cid) && aa.classes.length <= 2
    );
    return {
      classId: cid,
      aas: classSpecific.map(a => a.name),
    };
  });

  // Efficiency rating
  let aaEfficiency: number;
  if (overlapPercent <= 20) aaEfficiency = 10;
  else if (overlapPercent <= 25) aaEfficiency = 9;
  else if (overlapPercent <= 30) aaEfficiency = 8;
  else if (overlapPercent <= 35) aaEfficiency = 7;
  else if (overlapPercent <= 40) aaEfficiency = 6;
  else if (overlapPercent <= 45) aaEfficiency = 5;
  else if (overlapPercent <= 50) aaEfficiency = 4;
  else if (overlapPercent <= 55) aaEfficiency = 3;
  else aaEfficiency = 2;

  // Bump efficiency for good archetype coverage
  if (archetypeCoverage.length >= 4) aaEfficiency = Math.min(10, aaEfficiency + 1);

  // Generate analysis text
  let overlapAnalysis = "";
  if (overlapPercent <= 25) {
    overlapAnalysis = `Excellent AA efficiency (${overlapPercent}% overlap). These classes span different archetype groups, giving you access to ${totalUniqueAAs} unique AAs with minimal waste.`;
  } else if (overlapPercent <= 35) {
    overlapAnalysis = `Good AA efficiency (${overlapPercent}% overlap). Some archetype AAs are shared but each class brings strong unique abilities. ${totalUniqueAAs} unique AAs total.`;
  } else if (overlapPercent <= 45) {
    overlapAnalysis = `Moderate AA overlap (${overlapPercent}%). These classes share ${sharedBy3.length} AAs across all three and ${sharedBy2.length} between pairs. Consider if the synergy is worth the AA redundancy.`;
  } else {
    overlapAnalysis = `High AA overlap (${overlapPercent}%). ${sharedBy3.length} AAs are shared by all three classes. These classes are in similar archetype groups — you're paying AA points for abilities you already have.`;
  }

  return {
    totalUniqueAAs,
    totalRawAAs,
    overlapCount,
    overlapPercent,
    exclusiveAAs,
    sharedBy2,
    sharedBy3,
    archetypeCoverage,
    keyUniqueAAs,
    overlapAnalysis,
    aaEfficiency,
  };
}
