import { QuestionCandidate, AssessmentResult, AssessmentAttemptSummary } from './types.js';
import { QuestionEvaluator } from './evaluator.js';

export class AssessmentScoringEngine {
  static evaluateAttempt(
    attemptId: string,
    assessmentId: string,
    studentId: string,
    questions: QuestionCandidate[],
    responses: Array<{ questionId: string; answer: any; timeSpentSeconds?: number }>
  ): AssessmentResult {
    let totalMarks = 0;
    let obtainedMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    let answeredCount = 0;
    let timeSpentSeconds = 0;

    const conceptPerf: Record<string, { total: number; correct: number; percentage: number }> = {};
    const topicPerf: Record<string, { total: number; correct: number; percentage: number }> = {};
    const diffPerf: Record<string, { total: number; correct: number; percentage: number }> = {};

    questions.forEach((q) => {
      totalMarks += q.marks || 4;
      const resp = responses.find((r) => r.questionId === q.questionId || (r as any).question === q.questionId);

      // Track Concept, Topic, Difficulty Stats
      if (!conceptPerf[q.conceptId]) conceptPerf[q.conceptId] = { total: 0, correct: 0, percentage: 0 };
      if (!topicPerf[q.topic]) topicPerf[q.topic] = { total: 0, correct: 0, percentage: 0 };
      if (!diffPerf[q.difficulty]) diffPerf[q.difficulty] = { total: 0, correct: 0, percentage: 0 };

      conceptPerf[q.conceptId].total++;
      topicPerf[q.topic].total++;
      diffPerf[q.difficulty].total++;

      if (!resp || resp.answer === undefined || resp.answer === null || String(resp.answer).trim() === '') {
        skippedCount++;
      } else {
        answeredCount++;
        timeSpentSeconds += resp.timeSpentSeconds || 0;

        const evalRes = QuestionEvaluator.evaluate(q, resp.answer);
        obtainedMarks += evalRes.marksAwarded;

        if (evalRes.isCorrect) {
          correctCount++;
          conceptPerf[q.conceptId].correct++;
          topicPerf[q.topic].correct++;
          diffPerf[q.difficulty].correct++;
        } else {
          incorrectCount++;
        }
      }
    });

    // Compute Percentages
    Object.keys(conceptPerf).forEach((c) => {
      conceptPerf[c].percentage = Math.round((conceptPerf[c].correct / conceptPerf[c].total) * 100);
    });
    Object.keys(topicPerf).forEach((t) => {
      topicPerf[t].percentage = Math.round((topicPerf[t].correct / topicPerf[t].total) * 100);
    });
    Object.keys(diffPerf).forEach((d) => {
      diffPerf[d].percentage = Math.round((diffPerf[d].correct / diffPerf[d].total) * 100);
    });

    const percentage = totalMarks > 0 ? Math.round((Math.max(0, obtainedMarks) / totalMarks) * 100) : 0;

    const strongConcepts = Object.keys(conceptPerf).filter((c) => conceptPerf[c].percentage >= 70);
    const weakConcepts = Object.keys(conceptPerf).filter((c) => conceptPerf[c].percentage < 60);

    const recommendedActions: string[] = [];
    if (weakConcepts.length > 0) {
      recommendedActions.push(`Review foundational concepts for: ${weakConcepts.join(', ')}`);
      recommendedActions.push('Practice targeted 15-minute diagnostic exercise sets');
    } else {
      recommendedActions.push('Great job! Proceed to advanced concept modules and mock exams.');
    }

    const attemptSummary: AssessmentAttemptSummary = {
      attemptId,
      assessmentId,
      studentId,
      status: 'evaluated',
      totalQuestions: questions.length,
      answeredCount,
      correctCount,
      incorrectCount,
      skippedCount,
      totalMarks,
      obtainedMarks: Math.max(0, obtainedMarks),
      percentage,
      timeSpentSeconds,
    };

    return {
      attempt: attemptSummary,
      conceptPerformance: conceptPerf,
      topicPerformance: topicPerf,
      difficultyPerformance: diffPerf,
      strongConcepts,
      weakConcepts,
      recommendedActions,
    };
  }
}
