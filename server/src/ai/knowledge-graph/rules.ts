import { STARTER_CONCEPT_DEPENDENCIES, STARTER_CONCEPTS_CATALOG } from './catalog.js';
import {
  IConceptDependencyEdge,
  IConceptNode,
  IConceptRecommendationData,
  IRootLearningGapData,
  IStudentConceptReadinessData,
  ReadinessLevel,
} from './types.js';

export function getConceptById(conceptId: string): IConceptNode | undefined {
  return STARTER_CONCEPTS_CATALOG.find(
    (c) =>
      c.conceptId.toLowerCase() === conceptId.toLowerCase() ||
      c.name.toLowerCase() === conceptId.toLowerCase() ||
      c.aliases.some((a) => a.toLowerCase() === conceptId.toLowerCase())
  );
}

export function getDirectPrerequisites(conceptId: string): IConceptNode[] {
  const target = getConceptById(conceptId);
  if (!target) return [];

  const edges = STARTER_CONCEPT_DEPENDENCIES.filter(
    (e) => e.dependentConceptId.toLowerCase() === target.conceptId.toLowerCase()
  );

  return edges
    .map((e) => getConceptById(e.prerequisiteConceptId))
    .filter((c): c is IConceptNode => c !== undefined);
}

export function getDirectDependents(conceptId: string): IConceptNode[] {
  const target = getConceptById(conceptId);
  if (!target) return [];

  const edges = STARTER_CONCEPT_DEPENDENCIES.filter(
    (e) => e.prerequisiteConceptId.toLowerCase() === target.conceptId.toLowerCase()
  );

  return edges
    .map((e) => getConceptById(e.dependentConceptId))
    .filter((c): c is IConceptNode => c !== undefined);
}

export function getAncestors(conceptId: string, visited = new Set<string>()): IConceptNode[] {
  const target = getConceptById(conceptId);
  if (!target || visited.has(target.conceptId)) return [];
  visited.add(target.conceptId);

  const direct = getDirectPrerequisites(target.conceptId);
  const ancestors: IConceptNode[] = [...direct];

  for (const parent of direct) {
    const parentAncestors = getAncestors(parent.conceptId, visited);
    parentAncestors.forEach((pa) => {
      if (!ancestors.some((a) => a.conceptId === pa.conceptId)) {
        ancestors.push(pa);
      }
    });
  }

  return ancestors;
}

export function getDescendants(conceptId: string, visited = new Set<string>()): IConceptNode[] {
  const target = getConceptById(conceptId);
  if (!target || visited.has(target.conceptId)) return [];
  visited.add(target.conceptId);

  const direct = getDirectDependents(target.conceptId);
  const descendants: IConceptNode[] = [...direct];

  for (const child of direct) {
    const childDescendants = getDescendants(child.conceptId, visited);
    childDescendants.forEach((cd) => {
      if (!descendants.some((d) => d.conceptId === cd.conceptId)) {
        descendants.push(cd);
      }
    });
  }

  return descendants;
}

export function getConceptPath(fromConceptId: string, toConceptId: string): string[] {
  const start = getConceptById(fromConceptId);
  const end = getConceptById(toConceptId);
  if (!start || !end) return [];

  const queue: Array<{ currentId: string; path: string[] }> = [{ currentId: start.conceptId, path: [start.name] }];
  const visited = new Set<string>([start.conceptId]);

  while (queue.length > 0) {
    const { currentId, path } = queue.shift()!;
    if (currentId === end.conceptId) return path;

    const dependents = getDirectDependents(currentId);
    for (const dep of dependents) {
      if (!visited.has(dep.conceptId)) {
        visited.add(dep.conceptId);
        queue.push({ currentId: dep.conceptId, path: [...path, dep.name] });
      }
    }
  }

  return [];
}

export function calculateDeterministicConceptReadiness(
  directMastery: number,
  prerequisiteMasteries: number[],
  confidenceScore: number = 80,
  practiceCount: number = 1
): { score: number; level: ReadinessLevel; isBlocked: boolean } {
  const avgPrereqMastery =
    prerequisiteMasteries.length > 0
      ? prerequisiteMasteries.reduce((a, b) => a + b, 0) / prerequisiteMasteries.length
      : 100;

  const practiceBonus = Math.min(10, practiceCount * 2);
  const rawScore = directMastery * 0.5 + avgPrereqMastery * 0.4 + practiceBonus * 0.1;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  const isBlocked = avgPrereqMastery < 40;

  let level: ReadinessLevel = 'developing';
  if (isBlocked || score < 30) level = 'blocked';
  else if (score < 50) level = 'weak';
  else if (score < 70) level = 'developing';
  else if (score < 85) level = 'ready';
  else level = 'strong';

  return { score, level, isBlocked };
}

export function identifyRootLearningGapsEngine(
  masteriesMap: Map<string, number>
): IRootLearningGapData[] {
  const rootGaps: IRootLearningGapData[] = [];

  STARTER_CONCEPTS_CATALOG.forEach((concept) => {
    const directMastery = masteriesMap.get(concept.conceptId) ?? 50;
    if (directMastery < 60) {
      const prereqs = getDirectPrerequisites(concept.conceptId);
      const weakPrereqs = prereqs.filter((p) => (masteriesMap.get(p.conceptId) ?? 50) < 50);

      // If this concept is weak AND has weak prerequisites, check if its prerequisites are root gaps
      if (weakPrereqs.length === 0) {
        // This weak concept has NO weak prerequisites -> IT IS A ROOT GAP!
        const dependents = getDescendants(concept.conceptId);
        const affectedConcepts = dependents.map((d) => d.name);

        const severity = directMastery < 35 ? 'critical' : directMastery < 50 ? 'high' : 'medium';

        rootGaps.push({
          rootGapConceptId: concept.conceptId,
          rootGapConceptName: concept.name,
          subject: concept.subject,
          masteryScore: directMastery,
          affectedConceptsCount: affectedConcepts.length,
          affectedConcepts,
          prerequisiteChain: [concept.name, ...affectedConcepts.slice(0, 3)],
          severity,
          recommendedNextConcept: concept.name,
          explanation: `${concept.name} is a foundational blocker affecting ${affectedConcepts.length} downstream concept(s). Strengthening it will unlock future learning.`,
        });
      }
    }
  });

  rootGaps.sort((a, b) => b.affectedConceptsCount - a.affectedConceptsCount);
  rootGaps.sort((a, b) => a.masteryScore - b.masteryScore);

  return rootGaps;
}

export function rankConceptsForRemediationEngine(
  masteriesMap: Map<string, number>
): IConceptRecommendationData[] {
  const recommendations: IConceptRecommendationData[] = [];
  const rootGaps = identifyRootLearningGapsEngine(masteriesMap);

  rootGaps.forEach((rg) => {
    const concept = getConceptById(rg.rootGapConceptId);
    if (concept) {
      const prereqMasteries = getDirectPrerequisites(concept.conceptId).map(
        (p) => masteriesMap.get(p.conceptId) ?? 50
      );
      const { score: readinessScore } = calculateDeterministicConceptReadiness(
        rg.masteryScore,
        prereqMasteries
      );

      recommendations.push({
        conceptId: concept.conceptId,
        conceptName: concept.name,
        subject: concept.subject,
        priority: rg.severity === 'critical' ? 'CRITICAL' : rg.severity === 'high' ? 'HIGH' : 'MEDIUM',
        reason: `Root prerequisite gap affecting ${rg.affectedConceptsCount} concept(s).`,
        readinessScore,
        unblocksCount: rg.affectedConceptsCount,
        actionUrl: '/practice',
      });
    }
  });

  return recommendations;
}
