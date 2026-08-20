import { dataRepository } from '../../repositories/data.repository.js';
import { isDBConnected } from '../../services/db.js';
import { StudentConceptMastery } from '../../models/student-concept-mastery.model.js';
import { STARTER_CONCEPTS_CATALOG } from './catalog.js';
import {
  calculateDeterministicConceptReadiness,
  getConceptById,
  getDirectPrerequisites,
  identifyRootLearningGapsEngine,
  rankConceptsForRemediationEngine,
} from './rules.js';
import {
  IConceptRecommendationData,
  IKnowledgeGraphSummaryData,
  IRootLearningGapData,
  IStudentConceptReadinessData,
} from './types.js';

// In-Memory Storage Fallback
const inMemStudentConceptMastery: Map<string, Map<string, number>> = new Map();

export async function getStudentMasteriesMap(studentId: string): Promise<Map<string, number>> {
  const masteriesMap = new Map<string, number>();

  // Initialize defaults from catalog
  STARTER_CONCEPTS_CATALOG.forEach((c) => masteriesMap.set(c.conceptId, 50));

  // Merge authoritative data from TopicMastery repository (Feature 1+)
  const storedTopicMasteries = await dataRepository.getTopicMastery(studentId);
  (storedTopicMasteries || []).forEach((tm: any) => {
    const concept = getConceptById(tm.topicName || tm.subject || '');
    if (concept) {
      masteriesMap.set(concept.conceptId, Number(tm.masteryScore || 50));
    }
  });

  // Merge learning gaps repository (Feature 1+)
  const gaps = await dataRepository.getStudentGaps(studentId);
  (gaps || []).forEach((g: any) => {
    if (g.status === 'active') {
      const concept = getConceptById(g.topicName || g.topic || '');
      if (concept) {
        const currentScore = masteriesMap.get(concept.conceptId) || 50;
        const penalty = g.severity === 'critical' ? 30 : g.severity === 'high' ? 20 : 10;
        masteriesMap.set(concept.conceptId, Math.max(10, currentScore - penalty));
      }
    }
  });

  // DB / In-memory custom StudentConceptMastery override
  if (isDBConnected()) {
    const customMasteries = await StudentConceptMastery.find({ studentId }).lean();
    customMasteries.forEach((cm: any) => {
      masteriesMap.set(cm.conceptId, cm.masteryScore);
    });
  } else {
    const studentInMem = inMemStudentConceptMastery.get(studentId);
    if (studentInMem) {
      studentInMem.forEach((val, key) => masteriesMap.set(key, val));
    }
  }

  return masteriesMap;
}

export async function getStudentConceptReadinessList(
  studentId: string
): Promise<IStudentConceptReadinessData[]> {
  const masteriesMap = await getStudentMasteriesMap(studentId);
  const readinessList: IStudentConceptReadinessData[] = [];

  STARTER_CONCEPTS_CATALOG.forEach((concept) => {
    const directMastery = masteriesMap.get(concept.conceptId) ?? 50;
    const prereqs = getDirectPrerequisites(concept.conceptId);
    const prereqMasteries = prereqs.map((p) => masteriesMap.get(p.conceptId) ?? 50);

    const { score: readinessScore, level: readinessLevel, isBlocked } =
      calculateDeterministicConceptReadiness(directMastery, prereqMasteries);

    const blockingPrereqs = prereqs
      .filter((p) => (masteriesMap.get(p.conceptId) ?? 50) < 50)
      .map((p) => p.name);

    readinessList.push({
      conceptId: concept.conceptId,
      conceptName: concept.name,
      subject: concept.subject,
      directMastery,
      prerequisiteMastery:
        prereqMasteries.length > 0
          ? Math.round(prereqMasteries.reduce((a, b) => a + b, 0) / prereqMasteries.length)
          : 100,
      readinessScore,
      readinessLevel,
      masteryStatus:
        readinessLevel === 'strong'
          ? 'strong'
          : readinessLevel === 'ready'
          ? 'ready'
          : readinessLevel === 'developing'
          ? 'developing'
          : 'weak',
      isBlocked,
      blockingPrerequisites: blockingPrereqs,
      lastAssessedAt: new Date().toISOString(),
    });
  });

  return readinessList;
}

export async function getStudentRootLearningGaps(studentId: string): Promise<IRootLearningGapData[]> {
  const masteriesMap = await getStudentMasteriesMap(studentId);
  return identifyRootLearningGapsEngine(masteriesMap);
}

export async function getStudentConceptRecommendations(
  studentId: string
): Promise<IConceptRecommendationData[]> {
  const masteriesMap = await getStudentMasteriesMap(studentId);
  return rankConceptsForRemediationEngine(masteriesMap);
}

export async function getKnowledgeGraphSummaryEngine(
  studentId: string
): Promise<IKnowledgeGraphSummaryData> {
  const readinessList = await getStudentConceptReadinessList(studentId);
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const user = await dataRepository.getUserById(studentId);

  const strongCount = readinessList.filter((r) => r.readinessLevel === 'strong' || r.readinessLevel === 'ready').length;
  const developingCount = readinessList.filter((r) => r.readinessLevel === 'developing').length;
  const weakCount = readinessList.filter((r) => r.readinessLevel === 'weak').length;
  const blockedCount = readinessList.filter((r) => r.isBlocked || r.readinessLevel === 'blocked').length;

  const totalReadiness = readinessList.reduce((acc, r) => acc + r.readinessScore, 0);
  const overallHealthScore = readinessList.length > 0 ? Math.round(totalReadiness / readinessList.length) : 75;

  const topRootGap = rootGaps[0] || null;

  let summaryMessage = `Your knowledge graph is healthy (${overallHealthScore}% readiness). All prerequisites are stable.`;
  if (topRootGap) {
    summaryMessage = `Foundational gap detected in ${topRootGap.rootGapConceptName} affecting ${topRootGap.affectedConceptsCount} downstream concept(s). Strengthen it to boost your entire learning map!`;
  }

  return {
    studentId: String(studentId),
    studentName: user?.name || 'Student',
    totalConcepts: readinessList.length,
    strongConceptsCount: strongCount,
    developingConceptsCount: developingCount,
    weakConceptsCount: weakCount,
    blockedConceptsCount: blockedCount,
    rootGapsCount: rootGaps.length,
    topRootGap,
    overallHealthScore,
    summaryMessage,
    evaluatedAt: new Date().toISOString(),
  };
}
