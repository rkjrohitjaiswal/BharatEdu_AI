import { ExamQuestion, ExamRecommendation, ExamResult, TimeManagementMetrics } from './types.js';

export function analyzeExamResult(
  attemptId: string,
  studentId: string,
  examId: string,
  questions: ExamQuestion[],
  submittedAnswers: Record<string, string>,
  totalScore: number,
  totalMarks: number,
  accuracy: number,
  attemptedCount: number,
  correctCount: number,
  incorrectCount: number,
  skippedCount: number,
  timeSpentSeconds: number
): ExamResult {
  const percentage = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;

  // Topic performance
  const topicMap: Record<string, { topicName: string; correct: number; total: number }> = {};
  // Concept performance
  const conceptMap: Record<string, { conceptName: string; correct: number; total: number }> = {};
  // Difficulty performance
  const diffMap = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };

  for (const q of questions) {
    const ans = submittedAnswers[q.questionId];
    const isCorrect = ans && ans.trim() === q.correctAnswer.trim();

    if (!topicMap[q.topicId]) {
      topicMap[q.topicId] = { topicName: q.topicId, correct: 0, total: 0 };
    }
    topicMap[q.topicId].total++;
    if (isCorrect) topicMap[q.topicId].correct++;

    if (!conceptMap[q.conceptId]) {
      conceptMap[q.conceptId] = { conceptName: q.conceptId, correct: 0, total: 0 };
    }
    conceptMap[q.conceptId].total++;
    if (isCorrect) conceptMap[q.conceptId].correct++;

    const diffKey = (q.difficulty || 'medium') as 'easy' | 'medium' | 'hard';
    diffMap[diffKey].total++;
    if (isCorrect) diffMap[diffKey].correct++;
  }

  const topicPerformance = Object.entries(topicMap).map(([topicId, val]) => ({
    topicId,
    topicName: val.topicName,
    correct: val.correct,
    total: val.total,
    accuracy: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
  }));

  const conceptPerformance = Object.entries(conceptMap).map(([conceptId, val]) => ({
    conceptId,
    conceptName: val.conceptName,
    correct: val.correct,
    total: val.total,
    accuracy: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
  }));

  const difficultyPerformance = {
    easy: {
      correct: diffMap.easy.correct,
      total: diffMap.easy.total,
      accuracy: diffMap.easy.total > 0 ? Math.round((diffMap.easy.correct / diffMap.easy.total) * 100) : 0,
    },
    medium: {
      correct: diffMap.medium.correct,
      total: diffMap.medium.total,
      accuracy: diffMap.medium.total > 0 ? Math.round((diffMap.medium.correct / diffMap.medium.total) * 100) : 0,
    },
    hard: {
      correct: diffMap.hard.correct,
      total: diffMap.hard.total,
      accuracy: diffMap.hard.total > 0 ? Math.round((diffMap.hard.correct / diffMap.hard.total) * 100) : 0,
    },
  };

  const avgTime = questions.length > 0 ? Math.round(timeSpentSeconds / questions.length) : 0;
  const timeManagement: TimeManagementMetrics = {
    totalTimeSpentSeconds: timeSpentSeconds,
    averageTimePerQuestionSeconds: avgTime,
    slowQuestionCount: 0,
    rushedQuestionCount: 0,
    timeEfficiencyScore: 85,
    recommendation: 'Good pace overall. Focus on spending less time on difficult questions during initial pass.',
  };

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const riskAreas: string[] = [];
  const recommendedActions: ExamRecommendation[] = [];

  for (const c of conceptPerformance) {
    if (c.accuracy >= 75) {
      strengths.push(`Mastered Concept: ${c.conceptId}`);
    } else if (c.accuracy < 50) {
      weaknesses.push(`Weak Concept: ${c.conceptId}`);
      riskAreas.push(`Knowledge Gap in ${c.conceptId}`);

      recommendedActions.push({
        actionType: 'revision',
        title: `Revise ${c.conceptId}`,
        description: `Accuracy was ${c.accuracy}%. Complete a Smart Revision session before next mock.`,
        targetId: c.conceptId,
        reason: 'Concept accuracy below 50%',
      });
    }
  }

  if (strengths.length === 0) strengths.push('Strong effort across foundational sections.');

  return {
    resultId: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    attemptId,
    studentId,
    examId,
    totalScore,
    totalMarks,
    percentage,
    accuracy,
    attemptedCount,
    correctCount,
    incorrectCount,
    skippedCount,
    percentileEstimate: Math.min(99, Math.max(10, Math.round(percentage * 0.95))),
    sectionResults: [],
    topicPerformance,
    conceptPerformance,
    difficultyPerformance,
    timeManagement,
    strengths,
    weaknesses,
    riskAreas,
    recommendedActions,
    generatedAt: new Date().toISOString(),
  };
}
