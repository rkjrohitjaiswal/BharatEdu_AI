import { dataRepository } from '../../repositories/data.repository.js';
import { IAssessmentGrade } from '../../models/assessment-grade.model.js';
import { IAssessmentSubmission } from '../../models/assessment-submission.model.js';

export interface TeacherReviewPayload {
  submissionId: string;
  teacherId: string;
  questionGrades: {
    questionId: string;
    score: number;
    maxScore: number;
    isObjective: boolean;
    teacherComment?: string;
    aiApproved?: boolean;
    rubricScores?: {
      criterionId: string;
      score: number;
      maxScore: number;
    }[];
  }[];
  teacherFeedback?: string;
}

export class AssessmentReviewService {
  static async approveAIEvaluations(submissionId: string, teacherId: string): Promise<IAssessmentGrade> {
    const sub = await dataRepository.getAssessmentSubmissionById(submissionId);
    if (!sub) throw new Error('Submission not found');

    const aiEvals = await dataRepository.getAIEvaluationsBySubmission(submissionId);
    const questions = await dataRepository.getTeacherAssessmentQuestions(sub.assessmentId);

    const questionGrades = questions.map((q) => {
      const evalObj = aiEvals.find((e) => e.questionId === q.questionId);
      const score = evalObj ? evalObj.proposedScore : 0;
      return {
        questionId: q.questionId,
        score,
        maxScore: q.marks,
        isObjective: ['mcq', 'multiple_select', 'true_false', 'numerical'].includes(q.questionType),
        aiProposedScore: evalObj?.proposedScore,
        aiApproved: true,
        teacherComment: evalObj?.feedback,
      };
    });

    const totalScore = questionGrades.reduce((sum, g) => sum + g.score, 0);
    const assessment = await dataRepository.getAssessmentById(sub.assessmentId);
    const totalMarks = assessment ? assessment.totalMarks : 100;
    const percentage = Math.round((totalScore / Math.max(1, totalMarks)) * 100 * 100) / 100;

    const gradeData: Partial<IAssessmentGrade> = {
      submissionId,
      studentId: sub.studentId,
      assessmentId: sub.assessmentId,
      questionGrades,
      totalScore,
      percentage,
      teacherFeedback: 'AI evaluation approved by teacher.',
      finalizedBy: teacherId,
      finalizedAt: new Date(),
    };

    const grade = await dataRepository.saveAssessmentGrade(gradeData);

    // Update submission status
    await dataRepository.updateAssessmentSubmission(submissionId, {
      status: 'teacher_reviewed',
      finalScore: totalScore,
      percentage,
    });

    // Add Audit Log
    await dataRepository.createAssessmentAudit({
      submissionId,
      actorUserId: teacherId,
      actorRole: 'teacher',
      action: 'ai_evaluated',
      newValue: { totalScore, percentage },
      reason: 'Teacher approved AI proposed evaluations',
      timestamp: new Date(),
    });

    return grade;
  }

  static async modifyAndFinalizeGrade(
    submissionId: string,
    teacherId: string,
    payload: TeacherReviewPayload
  ): Promise<IAssessmentGrade> {
    const sub = await dataRepository.getAssessmentSubmissionById(submissionId);
    if (!sub) throw new Error('Submission not found');

    const assessment = await dataRepository.getAssessmentById(sub.assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    if (assessment.teacherId !== teacherId) {
      throw new Error('Access denied. You can only grade assessments you created.');
    }

    const questionGrades = payload.questionGrades.map((qg) => ({
      questionId: qg.questionId,
      score: Math.max(0, Math.min(qg.maxScore, qg.score)), // Bound 0 <= score <= maxScore
      maxScore: qg.maxScore,
      isObjective: qg.isObjective,
      teacherComment: qg.teacherComment,
      aiApproved: qg.aiApproved || false,
      rubricScores: qg.rubricScores,
    }));

    const totalScore = questionGrades.reduce((sum, g) => sum + g.score, 0);
    const percentage = Math.round((totalScore / Math.max(1, assessment.totalMarks)) * 100 * 100) / 100;

    const gradeData: Partial<IAssessmentGrade> = {
      submissionId,
      studentId: sub.studentId,
      assessmentId: sub.assessmentId,
      questionGrades,
      totalScore,
      percentage,
      teacherFeedback: payload.teacherFeedback || 'Final grade published by teacher.',
      finalizedBy: teacherId,
      finalizedAt: new Date(),
      publishedAt: new Date(),
    };

    const grade = await dataRepository.saveAssessmentGrade(gradeData);

    // Update submission status to returned
    await dataRepository.updateAssessmentSubmission(submissionId, {
      status: 'returned',
      finalScore: totalScore,
      percentage,
      teacherFinalized: true,
      returnedAt: new Date(),
    });

    // Add Audit Log
    await dataRepository.createAssessmentAudit({
      submissionId,
      actorUserId: teacherId,
      actorRole: 'teacher',
      action: 'finalized',
      newValue: { totalScore, percentage },
      reason: 'Teacher finalized and returned assessment grade.',
      timestamp: new Date(),
    });

    return grade;
  }
}
