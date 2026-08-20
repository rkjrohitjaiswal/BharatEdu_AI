import { IAssessment } from '../../models/assessment.model.js';
import { IAssessmentQuestion } from '../../models/assessment-question.model.js';
import { IAssessmentSubmission } from '../../models/assessment-submission.model.js';
import { IAssessmentGrade } from '../../models/assessment-grade.model.js';
import { IAIEvaluation } from '../../models/ai-evaluation.model.js';
import { AssessmentAnalytics } from './types.js';

export class AssessmentAnalyticsEngine {
  static computeAnalytics(
    assessment: IAssessment,
    questions: IAssessmentQuestion[],
    submissions: IAssessmentSubmission[],
    grades: IAssessmentGrade[],
    evaluations: IAIEvaluation[]
  ): AssessmentAnalytics {
    const totalSubmissions = submissions.filter((s) => s.status !== 'draft').length;

    if (totalSubmissions === 0 || grades.length === 0) {
      return {
        assessmentId: assessment.assessmentId,
        title: assessment.title,
        totalSubmissions: 0,
        classAverage: 0,
        medianScore: 0,
        highestScore: 0,
        lowestScore: 0,
        completionRate: 0,
        questionPerformance: questions.map((q, idx) => ({
          questionId: q.questionId,
          questionNumber: idx + 1,
          averageScore: 0,
          maxMarks: q.marks,
          successRate: 0,
        })),
        topMisconceptions: [],
        studentsNeedingAttention: [],
      };
    }

    const scores = grades.map((g) => g.totalScore).sort((a, b) => a - b);
    const sumScore = scores.reduce((a, b) => a + b, 0);
    const classAverage = Math.round((sumScore / scores.length) * 100) / 100;
    const medianScore = scores[Math.floor(scores.length / 2)] || 0;
    const highestScore = scores[scores.length - 1] || 0;
    const lowestScore = scores[0] || 0;
    const completionRate = Math.round((totalSubmissions / Math.max(1, submissions.length)) * 100);

    // Question Performance
    const questionPerformance = questions.map((q, idx) => {
      let qTotalScore = 0;
      let count = 0;

      for (const g of grades) {
        const qg = g.questionGrades.find((item) => item.questionId === q.questionId);
        if (qg) {
          qTotalScore += qg.score;
          count++;
        }
      }

      const avg = count > 0 ? Math.round((qTotalScore / count) * 100) / 100 : 0;
      const successRate = q.marks > 0 ? Math.round((avg / q.marks) * 100) : 0;

      let flaggedQualityIssue: string | undefined;
      if (successRate < 25 && count >= 3) {
        flaggedQualityIssue = 'Unusually low success rate (< 25%). Question may be overly difficult or ambiguous.';
      } else if (successRate > 95 && count >= 3) {
        flaggedQualityIssue = 'Unusually high success rate (> 95%). Question may provide insufficient discrimination.';
      }

      return {
        questionId: q.questionId,
        questionNumber: idx + 1,
        averageScore: avg,
        maxMarks: q.marks,
        successRate,
        flaggedQualityIssue,
      };
    });

    // Top Misconceptions
    const miscCounts = new Map<string, Set<string>>();
    for (const ev of evaluations) {
      for (const tag of ev.misconceptionTags || []) {
        if (!miscCounts.has(tag)) miscCounts.set(tag, new Set());
        const sub = submissions.find((s) => s.submissionId === ev.submissionId);
        if (sub) miscCounts.get(tag)!.add(sub.studentId);
      }
    }

    const topMisconceptions = Array.from(miscCounts.entries())
      .map(([tag, studentSet]) => ({
        tag,
        count: studentSet.size,
        affectedStudentsCount: studentSet.size,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Students needing attention
    const studentsNeedingAttention = grades
      .filter((g) => g.percentage < 40)
      .map((g) => ({
        studentId: g.studentId,
        score: g.totalScore,
        percentage: g.percentage,
        riskReason: `Score below passing threshold (${g.percentage}% < 40%)`,
      }));

    return {
      assessmentId: assessment.assessmentId,
      title: assessment.title,
      totalSubmissions,
      classAverage,
      medianScore,
      highestScore,
      lowestScore,
      completionRate,
      questionPerformance,
      topMisconceptions,
      studentsNeedingAttention,
    };
  }
}
