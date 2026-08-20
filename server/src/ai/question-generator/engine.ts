import { dataRepository } from '../../repositories/data.repository.js';
import { isDBConnected } from '../../services/db.js';
import { AdaptiveAssessment, AssessmentType } from '../../models/adaptive-assessment.model.js';
import { QuestionAttempt } from '../../models/question-attempt.model.js';
import { Question, QuestionDifficulty } from '../../models/question.model.js';
import { getStudentConceptReadinessList, getStudentRootLearningGaps } from '../knowledge-graph/engine.js';
import { getConceptById, getDirectPrerequisites } from '../knowledge-graph/rules.js';
import { generateAIQuestion } from './ai-coach.js';
import { STARTER_QUESTION_CATALOG } from './catalog.js';
import { adaptDifficulty, determineInitialDifficulty, filterAntiRepetition, validateQuestion } from './rules.js';
import {
  IAnswerSubmissionResult,
  IAssessmentSummaryData,
  IQuestionItem,
  IQuestionPublicItem,
} from './types.js';

// In-memory Fallback Storage
const inMemAssessments: Map<string, any> = new Map();
const inMemAttempts: any[] = [];

export function sanitizeQuestionForPublic(question: IQuestionItem): IQuestionPublicItem {
  const { questionId, conceptId, subject, classLevel, board, questionType, difficulty, stem, options, hint, sourceType } = question;
  return {
    questionId,
    conceptId,
    subject,
    classLevel,
    board,
    questionType,
    difficulty,
    stem,
    options,
    hint,
    sourceType,
  };
}

export async function selectConceptForAssessment(
  studentId: string,
  preferredConceptId?: string
): Promise<{ conceptId: string; conceptName: string; subject: string; prerequisiteNotice?: string }> {
  if (preferredConceptId) {
    const concept = getConceptById(preferredConceptId);
    if (concept) {
      // Check Knowledge Graph for weak prerequisites!
      const prereqs = getDirectPrerequisites(concept.conceptId);
      const studentReadiness = await getStudentConceptReadinessList(studentId);
      const readinessMap = new Map(studentReadiness.map((r) => [r.conceptId, r]));

      const weakPrereq = prereqs.find((p) => {
        const r = readinessMap.get(p.conceptId);
        return r && (r.readinessScore < 50 || r.isBlocked);
      });

      if (weakPrereq) {
        return {
          conceptId: weakPrereq.conceptId,
          conceptName: weakPrereq.name,
          subject: weakPrereq.subject,
          prerequisiteNotice: `${weakPrereq.name} is a weak prerequisite for ${concept.name}. Strengthening it first will unlock better mastery!`,
        };
      }

      return { conceptId: concept.conceptId, conceptName: concept.name, subject: concept.subject };
    }
  }

  // 1. Check Root Learning Gaps (Feature 21)
  const rootGaps = await getStudentRootLearningGaps(studentId);
  if (rootGaps.length > 0) {
    const topGap = rootGaps[0];
    return {
      conceptId: topGap.rootGapConceptId,
      conceptName: topGap.rootGapConceptName,
      subject: topGap.subject,
      prerequisiteNotice: `Root prerequisite gap detected in ${topGap.rootGapConceptName} affecting ${topGap.affectedConceptsCount} topic(s).`,
    };
  }

  // 2. Default fallback concept
  return { conceptId: 'math_linear_eq', conceptName: 'Linear Equations in Two Variables', subject: 'Mathematics' };
}

export async function createAdaptiveAssessmentEngine(
  studentId: string,
  targetConceptId?: string,
  assessmentType: AssessmentType = 'adaptive_practice',
  questionCount: number = 5
): Promise<any> {
  const { conceptId, conceptName, subject, prerequisiteNotice } = await selectConceptForAssessment(studentId, targetConceptId);

  const readinessList = await getStudentConceptReadinessList(studentId);
  const targetReadiness = readinessList.find((r) => r.conceptId === conceptId);
  const readinessBefore = targetReadiness?.readinessScore ?? 50;

  const startingDifficulty = determineInitialDifficulty(readinessBefore);
  const assessmentId = `assess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const assessmentDoc = {
    assessmentId,
    studentId,
    assessmentType,
    targetConceptId: conceptId,
    targetConceptName: conceptName,
    subject,
    prerequisiteConceptIds: targetReadiness?.blockingPrerequisites || [],
    questionCount,
    completedQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    startingDifficulty,
    currentDifficulty: startingDifficulty,
    readinessBefore,
    readinessAfter: readinessBefore,
    status: 'active',
    startedAt: new Date(),
    prerequisiteNotice,
  };

  if (isDBConnected()) {
    await AdaptiveAssessment.create(assessmentDoc);
  } else {
    inMemAssessments.set(assessmentId, assessmentDoc);
  }

  return assessmentDoc;
}

export async function fetchNextAssessmentQuestion(
  assessmentId: string,
  studentId: string
): Promise<{ question: IQuestionPublicItem | null; assessment: any; isCompleted: boolean }> {
  let assessment: any = null;

  if (isDBConnected()) {
    assessment = await AdaptiveAssessment.findOne({ assessmentId, studentId }).lean();
  } else {
    const raw = inMemAssessments.get(assessmentId);
    if (raw && String(raw.studentId) === String(studentId)) {
      assessment = raw;
    }
  }

  if (!assessment) throw new Error('Assessment not found');

  if (assessment.completedQuestions >= assessment.questionCount || assessment.status === 'completed') {
    return { question: null, assessment, isCompleted: true };
  }

  // Fetch candidate questions for this concept and current difficulty
  let candidates: IQuestionItem[] = [];

  if (isDBConnected()) {
    const dbQuestions = await Question.find({
      conceptId: assessment.targetConceptId,
      isActive: true,
    }).lean();
    candidates = dbQuestions as any;
  }

  if (candidates.length === 0) {
    candidates = STARTER_QUESTION_CATALOG.filter(
      (q) => q.conceptId === assessment.targetConceptId
    );
  }

  if (candidates.length === 0) {
    // General subject fallback if concept specific question missing
    candidates = STARTER_QUESTION_CATALOG.filter((q) => q.subject === assessment.subject);
  }

  // Attempt AI generation if key available and candidate pool small
  if (candidates.length < 2 && process.env.AI_API_KEY) {
    const aiQ = await generateAIQuestion(
      assessment.targetConceptId,
      assessment.targetConceptName || assessment.targetConceptId,
      assessment.subject || 'Mathematics',
      assessment.currentDifficulty
    );
    if (aiQ && validateQuestion(aiQ).isValid) {
      candidates.push(aiQ);
    }
  }

  if (candidates.length === 0) {
    candidates = [STARTER_QUESTION_CATALOG[0]];
  }

  // Anti-repetition filter
  const recentQuestionIds = inMemAttempts
    .filter((a) => a.studentId === studentId)
    .map((a) => a.questionId);

  const filtered = filterAntiRepetition(candidates, recentQuestionIds, 10);
  const selectedQuestion = filtered[0] || candidates[0];

  return {
    question: sanitizeQuestionForPublic(selectedQuestion),
    assessment,
    isCompleted: false,
  };
}

export async function submitAssessmentAnswerEngine(
  assessmentId: string,
  questionId: string,
  selectedAnswer: string,
  studentId: string,
  responseTimeSeconds: number = 10,
  hintsUsed: number = 0
): Promise<IAnswerSubmissionResult> {
  let assessment: any = null;

  if (isDBConnected()) {
    assessment = await AdaptiveAssessment.findOne({ assessmentId, studentId });
  } else {
    const raw = inMemAssessments.get(assessmentId);
    if (raw && String(raw.studentId) === String(studentId)) {
      assessment = raw;
    }
  }

  if (!assessment) throw new Error('Assessment not found');

  // Authoritative Question Lookup
  let question: IQuestionItem | undefined = STARTER_QUESTION_CATALOG.find(
    (q) => q.questionId === questionId
  );

  if (!question && isDBConnected()) {
    const dbQ = await Question.findOne({ questionId }).lean();
    if (dbQ) question = dbQ as any;
  }

  if (!question) {
    // Default fallback verification item
    question = STARTER_QUESTION_CATALOG[0];
  }

  // Authoritative Correctness Check
  const normSelected = String(selectedAnswer).trim().toLowerCase();
  const normCorrect = String(question.correctAnswer).trim().toLowerCase();
  const isCorrect = normSelected === normCorrect;

  // Update Assessment Stats
  assessment.completedQuestions = (assessment.completedQuestions || 0) + 1;
  if (isCorrect) {
    assessment.correctAnswers = (assessment.correctAnswers || 0) + 1;
  }

  const accuracy = Math.round((assessment.correctAnswers / assessment.completedQuestions) * 100);
  assessment.accuracy = accuracy;

  // Bounded Adaptive Difficulty Adjustment
  const newDifficulty = adaptDifficulty(assessment.currentDifficulty, accuracy);
  assessment.currentDifficulty = newDifficulty;

  const isCompleted = assessment.completedQuestions >= assessment.questionCount;
  if (isCompleted) {
    assessment.status = 'completed';
    assessment.completedAt = new Date();
    assessment.readinessAfter = Math.min(100, Math.max(0, assessment.readinessBefore + (accuracy >= 70 ? 10 : -5)));
  }

  // Persist Assessment & Attempt
  if (isDBConnected()) {
    await assessment.save();
    await QuestionAttempt.create({
      studentId,
      questionId,
      conceptId: question.conceptId,
      assessmentId,
      selectedAnswer,
      isCorrect,
      responseTimeSeconds,
      hintsUsed,
      attemptNumber: assessment.completedQuestions,
      difficulty: question.difficulty,
    });
  } else {
    inMemAssessments.set(assessmentId, assessment);
    inMemAttempts.push({
      studentId,
      questionId,
      conceptId: question.conceptId,
      assessmentId,
      selectedAnswer,
      isCorrect,
      responseTimeSeconds,
      hintsUsed,
      attemptNumber: assessment.completedQuestions,
      difficulty: question.difficulty,
    });
  }

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    masteryImpact: isCorrect ? 5 : -2,
    newDifficulty,
    isAssessmentCompleted: isCompleted,
  };
}

export async function getAssessmentSummaryEngine(
  assessmentId: string,
  studentId: string
): Promise<IAssessmentSummaryData> {
  let assessment: any = null;

  if (isDBConnected()) {
    assessment = await AdaptiveAssessment.findOne({ assessmentId, studentId }).lean();
  } else {
    const raw = inMemAssessments.get(assessmentId);
    if (raw && String(raw.studentId) === String(studentId)) {
      assessment = raw;
    }
  }

  if (!assessment) throw new Error('Assessment not found');

  const accuracy = assessment.accuracy || 0;
  let recommendedRemediation = 'Keep practicing to maintain your strong accuracy!';
  if (accuracy < 60) {
    recommendedRemediation = `Remediation recommended on ${assessment.targetConceptName || assessment.targetConceptId}. Review foundational prerequisites before retrying.`;
  }

  return {
    assessmentId: assessment.assessmentId,
    studentId: String(studentId),
    assessmentType: assessment.assessmentType,
    targetConceptId: assessment.targetConceptId,
    targetConceptName: assessment.targetConceptName || assessment.targetConceptId,
    subject: assessment.subject || 'Mathematics',
    questionCount: assessment.questionCount,
    completedQuestions: assessment.completedQuestions,
    correctAnswers: assessment.correctAnswers,
    accuracy,
    startingDifficulty: assessment.startingDifficulty,
    endingDifficulty: assessment.currentDifficulty,
    readinessBefore: assessment.readinessBefore,
    readinessAfter: assessment.readinessAfter,
    status: assessment.status,
    startedAt: new Date(assessment.startedAt).toISOString(),
    completedAt: assessment.completedAt ? new Date(assessment.completedAt).toISOString() : undefined,
    recommendedRemediation,
    aiExplanation: `Assessment complete! Your score was ${accuracy}%. ${recommendedRemediation}`,
  };
}
