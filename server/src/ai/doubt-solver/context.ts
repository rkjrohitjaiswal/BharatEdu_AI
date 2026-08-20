import { dataRepository } from '../../repositories/data.repository.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { getStudentLearningPathDetailsEngine } from '../learning-path/engine.js';

export interface IDoubtContextAggregated {
  studentId: string;
  masteryScore: number;
  confidenceScore: number;
  riskLevel: string;
  examUrgency: boolean;
  learningPathStage: number;
  prerequisiteConceptIds: string[];
  learningGapIds: string[];
  revisionDue: boolean;
  recommendedDifficulty: 'beginner' | 'intermediate' | 'advanced';
  recentMistakesCount: number;
  topConceptId?: string;
  topConceptName?: string;
}

export async function aggregateStudentDoubtContext(studentId: string): Promise<IDoubtContextAggregated> {
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const readinessList = await getStudentConceptReadinessList(studentId);
  const learningPath = await getStudentLearningPathDetailsEngine(studentId);

  const topGap = rootGaps[0];
  const topReadiness = readinessList[0];

  const masteryScore = topReadiness?.directMastery ?? 50;
  const prerequisiteConceptIds = topGap ? [topGap.rootGapConceptId] : ['math_algebra_basics'];

  const learningGapIds = rootGaps.map((g) => g.rootGapConceptId);
  const riskLevel = topGap?.severity === 'critical' ? 'HIGH' : 'LOW';
  const revisionDue = masteryScore < 50;
  const examUrgency = false;
  const recommendedDifficulty = masteryScore < 50 ? 'beginner' : masteryScore > 80 ? 'advanced' : 'intermediate';

  return {
    studentId,
    masteryScore,
    confidenceScore: 75,
    riskLevel,
    examUrgency,
    learningPathStage: learningPath.currentStage,
    prerequisiteConceptIds,
    learningGapIds,
    revisionDue,
    recommendedDifficulty,
    recentMistakesCount: rootGaps.length,
    topConceptId: topReadiness?.conceptId || 'math_linear_eq',
    topConceptName: topReadiness?.conceptName || 'Pair of Linear Equations',
  };
}
