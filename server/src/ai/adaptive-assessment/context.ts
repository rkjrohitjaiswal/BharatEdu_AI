import { AssessmentDifficulty } from '../../models/adaptive-assessment.model.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { getStudentLearningPathDetailsEngine } from '../learning-path/engine.js';

export interface IAssessmentContextAggregated {
  studentId: string;
  topicId: string;
  conceptId: string;
  conceptName: string;
  masteryScore: number;
  confidenceScore: number;
  riskLevel: string;
  examUrgency: boolean;
  learningPathStage: number;
  prerequisiteConceptIds: string[];
  learningGapIds: string[];
  revisionDue: boolean;
  recommendedDifficulty: AssessmentDifficulty;
}

export async function aggregateStudentAssessmentContext(studentId: string, conceptId?: string): Promise<IAssessmentContextAggregated> {
  const rootGaps = await getStudentRootLearningGaps(studentId);
  const readinessList = await getStudentConceptReadinessList(studentId);
  const learningPath = await getStudentLearningPathDetailsEngine(studentId);

  const topGap = rootGaps[0];
  const activeConceptId = conceptId || learningPath.nextBestConcept?.conceptId || topGap?.rootGapConceptId || 'math_linear_eq';
  const matchingReadiness = readinessList.find((r) => r.conceptId === activeConceptId);

  const masteryScore = matchingReadiness?.directMastery ?? 50;
  const prerequisiteConceptIds = topGap ? [topGap.rootGapConceptId] : ['math_algebra_basics'];
  const learningGapIds = rootGaps.map((g) => g.rootGapConceptId);
  const riskLevel = topGap?.severity === 'critical' ? 'HIGH' : 'LOW';

  let recommendedDifficulty: AssessmentDifficulty = 'medium';
  if (masteryScore < 40) recommendedDifficulty = 'beginner';
  else if (masteryScore < 60) recommendedDifficulty = 'easy';
  else if (masteryScore < 75) recommendedDifficulty = 'medium';
  else if (masteryScore < 90) recommendedDifficulty = 'hard';
  else recommendedDifficulty = 'advanced';

  return {
    studentId,
    topicId: 'Algebra',
    conceptId: activeConceptId,
    conceptName: matchingReadiness?.conceptName || 'Pair of Linear Equations',
    masteryScore,
    confidenceScore: 75,
    riskLevel,
    examUrgency: false,
    learningPathStage: learningPath.currentStage,
    prerequisiteConceptIds,
    learningGapIds,
    revisionDue: masteryScore < 50,
    recommendedDifficulty,
  };
}
