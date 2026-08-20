import { AssessmentAttemptSummary, QuestionCandidate } from './types.js';

export class AssessmentAnalyticsEngine {
  static calculateClassAnalytics(attempts: AssessmentAttemptSummary[], questions: QuestionCandidate[] = []) {
    if (!attempts || attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        medianScore: 0,
        completionRate: 0,
        averageAccuracy: 0,
        scoreDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
      };
    }

    const total = attempts.length;
    const scores = attempts.map((a) => a.percentage).sort((a, b) => a - b);
    const sumScore = scores.reduce((acc, val) => acc + val, 0);
    const averageScore = Math.round(sumScore / total);

    const mid = Math.floor(scores.length / 2);
    const medianScore = scores.length % 2 !== 0 ? scores[mid] : Math.round((scores[mid - 1] + scores[mid]) / 2);

    const completedCount = attempts.filter((a) => a.status === 'evaluated' || a.status === 'submitted').length;
    const completionRate = Math.round((completedCount / total) * 100);

    const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
    const totalAnswered = attempts.reduce((acc, a) => acc + a.answeredCount, 0);
    const averageAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    scores.forEach((s) => {
      if (s >= 90) distribution.A++;
      else if (s >= 75) distribution.B++;
      else if (s >= 60) distribution.C++;
      else if (s >= 40) distribution.D++;
      else distribution.F++;
    });

    return {
      totalAttempts: total,
      averageScore,
      medianScore,
      completionRate,
      averageAccuracy,
      scoreDistribution: distribution,
    };
  }

  static calculateQuestionAnalytics(questions: QuestionCandidate[], responses: any[]) {
    return questions.map((q) => {
      const qResponses = responses.filter((r) => r.questionId === q.questionId || r.question === q.questionId);
      const attemptsCount = qResponses.length;
      const correctCount = qResponses.filter((r) => r.isCorrect).length;
      const incorrectCount = qResponses.filter((r) => r.isCorrect === false && r.answer !== undefined).length;
      const skipCount = qResponses.filter((r) => r.answer === undefined || r.answer === null || r.answer === '').length;

      const successRate = attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 0;
      const avgTimeSeconds =
        attemptsCount > 0
          ? Math.round(qResponses.reduce((acc, r) => acc + (r.timeSpentSeconds || 0), 0) / attemptsCount)
          : 0;

      let flag: 'none' | 'too_hard' | 'too_easy' | 'ambiguous' = 'none';
      if (attemptsCount >= 3) {
        if (successRate < 20) flag = 'too_hard';
        else if (successRate > 95) flag = 'too_easy';
      }

      return {
        questionId: q.questionId,
        questionText: q.questionText,
        difficulty: q.difficulty,
        attemptsCount,
        correctCount,
        incorrectCount,
        skipCount,
        successRate,
        avgTimeSeconds,
        qualityFlag: flag,
      };
    });
  }
}
