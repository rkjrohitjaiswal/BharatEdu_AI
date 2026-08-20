import { IAssessmentGrade } from '../../models/assessment-grade.model.js';
import { IAssessmentQuestion } from '../../models/assessment-question.model.js';
import { IAssessmentSubmission } from '../../models/assessment-submission.model.js';
import { IAssessmentAnswer } from '../../models/assessment-answer.model.js';
import { StudentFeedback } from './types.js';

export class AssessmentFeedbackGenerator {
  static generateStudentFeedback(
    submission: IAssessmentSubmission,
    grade: IAssessmentGrade,
    questions: IAssessmentQuestion[],
    answers: IAssessmentAnswer[]
  ): StudentFeedback {
    const totalScore = grade.totalScore;
    const totalMarks = grade.questionGrades.reduce((sum, g) => sum + g.maxScore, 0);
    const percentage = grade.percentage;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendedRevisionTopics: string[] = [];
    const questionBreakdown: any[] = [];

    for (const qg of grade.questionGrades) {
      const q = questions.find((item) => item.questionId === qg.questionId);
      const ans = answers.find((item) => item.questionId === qg.questionId);
      const isFullMarks = qg.score === qg.maxScore;

      if (q) {
        if (isFullMarks) {
          strengths.push(`Mastered concept in ${(q as any).topic || (q as any).topicId || 'question'} (${qg.score}/${qg.maxScore} marks)`);
        } else {
          weaknesses.push(`Needs review in ${(q as any).topic || (q as any).topicId || 'question'} (${qg.score}/${qg.maxScore} marks)`);
          const top = (q as any).topic || (q as any).topicId;
          if (top && !recommendedRevisionTopics.includes(top)) {
            recommendedRevisionTopics.push(top);
          }
        }

        // Show correctAnswer ONLY if submission is finalized & returned
        const isReturned = submission.status === 'returned' || submission.teacherFinalized;
        const correctAnswer = isReturned ? q.correctAnswer : undefined;

        questionBreakdown.push({
          questionId: q.questionId,
          questionText: (q as any).questionText || (q as any).question || '',
          score: qg.score,
          maxMarks: qg.maxScore,
          studentAnswer: ans?.answer,
          correctAnswer,
          teacherComment: qg.teacherComment,
          improvementSuggestion: isFullMarks
            ? 'Great work! You demonstrated complete mastery.'
            : 'Review key formulas and model answers to improve accuracy.',
        });
      }
    }

    const generalFeedback =
      grade.teacherFeedback ||
      (percentage >= 80
        ? 'Excellent performance! You showed strong conceptual grasp.'
        : percentage >= 50
        ? 'Good effort! Review the highlighted areas to improve further.'
        : 'Needs revision. Focus on weak concepts and practice similar questions.');

    return {
      submissionId: submission.submissionId,
      totalScore,
      totalMarks,
      percentage,
      grade: grade.grade || (percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'),
      generalFeedback,
      strengths: strengths.slice(0, 5),
      weaknesses: weaknesses.slice(0, 5),
      recommendedRevisionTopics,
      recommendedResources: recommendedRevisionTopics.map((topic) => ({
        title: `Comprehensive Guide: ${topic}`,
        type: 'Study Note',
        url: `/resources?topic=${encodeURIComponent(topic)}`,
      })),
      questionBreakdown,
    };
  }
}
