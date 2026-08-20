import { dataRepository } from '../../repositories/data.repository.js';
import { AssessmentAICoach } from './ai-coach.js';
import { AssessmentReviewService, TeacherReviewPayload } from './review-service.js';
import { AssessmentSubmissionManager } from './submission.js';
import { AssessmentFeedbackGenerator } from './feedback.js';
import { MisconceptionEngine } from './misconceptions.js';
import { AssessmentAnalyticsEngine } from './analytics.js';
import { IAssessment } from '../../models/assessment.model.js';
import { IAssessmentQuestion } from '../../models/assessment-question.model.js';
import { IAssessmentRubric } from '../../models/assessment-rubric.model.js';
import { IAssessmentSubmission } from '../../models/assessment-submission.model.js';
import { IAssessmentAnswer } from '../../models/assessment-answer.model.js';
import { IAIEvaluation } from '../../models/ai-evaluation.model.js';

export class AssessmentService {
  // --- TEACHER ACTIONS ---
  async createAssessment(teacherId: string, payload: Partial<IAssessment>): Promise<IAssessment> {
    const assessmentId = `asm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const data: Partial<IAssessment> = {
      ...payload,
      assessmentId,
      teacherId,
      status: payload.status || 'draft',
      totalQuestions: payload.totalQuestions || (payload as any).questionCount || 0,
      totalMarks: payload.totalMarks || 100,
      passingMarks: payload.passingMarks || 33,
      ...(payload as any),
    };
    return await dataRepository.createAssessment(data);
  }

  async updateAssessment(assessmentId: string, teacherId: string, updates: Partial<IAssessment>): Promise<IAssessment> {
    const assessment = await dataRepository.getAssessmentById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.teacherId !== teacherId) throw new Error('Access denied. You do not own this assessment.');
    return await dataRepository.updateAssessment(assessmentId, updates);
  }

  async publishAssessment(assessmentId: string, teacherId: string): Promise<IAssessment> {
    return await this.updateAssessment(assessmentId, teacherId, { status: 'published' });
  }

  async closeAssessment(assessmentId: string, teacherId: string): Promise<IAssessment> {
    return await this.updateAssessment(assessmentId, teacherId, { status: 'archived' as any });
  }

  async reopenAssessment(assessmentId: string, teacherId: string): Promise<IAssessment> {
    return await this.updateAssessment(assessmentId, teacherId, { status: 'published' });
  }

  async addQuestionToAssessment(teacherId: string, assessmentId: string, qData: Partial<IAssessmentQuestion>): Promise<IAssessmentQuestion> {
    const assessment = await dataRepository.getAssessmentById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.teacherId !== teacherId) throw new Error('Access denied. You do not own this assessment.');

    const questionId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const question = await dataRepository.createTeacherAssessmentQuestion({
      ...qData,
      assessmentId,
      questionId,
      verified: true,
    });

    // Update question count
    const questions = await dataRepository.getTeacherAssessmentQuestions(assessmentId);
    await dataRepository.updateAssessment(assessmentId, { questionCount: questions.length });

    return question;
  }

  async createRubric(teacherId: string, rubricData: Partial<IAssessmentRubric>): Promise<IAssessmentRubric> {
    const rubricId = `rub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return await dataRepository.createAssessmentRubric({
      ...rubricData,
      rubricId,
      teacherId,
      version: 1,
      active: true,
    });
  }

  async getTeacherAssessments(teacherId: string): Promise<IAssessment[]> {
    return await dataRepository.getAssessmentsByTeacher(teacherId);
  }

  async getAssessmentSubmissions(assessmentId: string, teacherId: string): Promise<IAssessmentSubmission[]> {
    const assessment = await dataRepository.getAssessmentById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.teacherId !== teacherId) throw new Error('Access denied. You do not own this assessment.');
    return await dataRepository.getSubmissionsByAssessment(assessmentId);
  }

  // --- STUDENT ACTIONS ---
  async getStudentAssessments(studentId: string): Promise<IAssessment[]> {
    return await dataRepository.getPublishedAssessmentsForStudent();
  }

  async getAssessmentForStudent(assessmentId: string, studentId: string): Promise<IAssessment> {
    const asm = await dataRepository.getAssessmentById(assessmentId);
    if (!asm) throw new Error('Assessment not found');
    if (asm.status === 'draft') throw new Error('Access denied. Assessment is not published.');
    return asm;
  }

  async getAssessmentQuestionsForStudent(assessmentId: string, studentId: string): Promise<any[]> {
    const asm = await dataRepository.getAssessmentById(assessmentId);
    if (!asm) throw new Error('Assessment not found');
    if (asm.status === 'draft') throw new Error('Access denied. Assessment is not published.');

    const questions = await dataRepository.getTeacherAssessmentQuestions(assessmentId);
    // Strip correctAnswer, modelAnswer, expectedPoints for security pre-submission
    return questions.map((q) => {
      const { correctAnswer, modelAnswer, expectedPoints, ...safeQ } = q.toObject ? q.toObject() : q;
      return safeQ;
    });
  }

  async saveDraftSubmission(
    assessmentId: string,
    studentId: string,
    answersPayload: { questionId: string; answer: any; attachments?: string[] }[]
  ): Promise<IAssessmentSubmission> {
    const asm = await dataRepository.getAssessmentById(assessmentId);
    if (!asm) throw new Error('Assessment not found');
    if (asm.status === 'draft') throw new Error('Access denied. Assessment is not published.');

    let sub = await dataRepository.getStudentSubmissionForAssessment(assessmentId, studentId);
    if (!sub) {
      const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      sub = await dataRepository.createAssessmentSubmission({
        submissionId,
        assessmentId,
        studentId,
        status: 'draft',
        attemptNumber: 1,
        totalQuestions: asm.questionCount || answersPayload.length,
        answeredQuestions: answersPayload.length,
        completionPercent: Math.round((answersPayload.length / Math.max(1, asm.questionCount)) * 100),
      });
    } else if (sub.status === 'returned') {
      throw new Error('Submission is finalized and locked. You cannot modify a returned submission.');
    }

    // Save or update answers
    for (const item of answersPayload) {
      await dataRepository.saveAssessmentAnswer({
        submissionId: sub.submissionId,
        questionId: item.questionId,
        studentId,
        answer: item.answer,
        attachments: item.attachments,
        submittedAt: new Date(),
        answerType: typeof item.answer === 'object' ? 'complex' : 'text',
      });
    }

    // Update submission completion
    const savedAnswers = await dataRepository.getAssessmentAnswers(sub.submissionId);
    const updatedSub = await dataRepository.updateAssessmentSubmission(sub.submissionId, {
      answeredQuestions: savedAnswers.length,
      completionPercent: Math.round((savedAnswers.length / Math.max(1, asm.questionCount)) * 100),
    });

    return updatedSub;
  }

  async submitAssessment(
    assessmentId: string,
    studentId: string,
    answersPayload: { questionId: string; answer: any; attachments?: string[] }[]
  ): Promise<{ submission: IAssessmentSubmission; evaluations: IAIEvaluation[] }> {
    const asm = await dataRepository.getAssessmentById(assessmentId);
    if (!asm) throw new Error('Assessment not found');
    if (asm.status === 'draft') throw new Error('Access denied. Assessment is not published.');

    // Validate deadline and late penalty
    const lateCheck = AssessmentSubmissionManager.validateAndCalculateLatePenalty(asm);

    let sub = await dataRepository.getStudentSubmissionForAssessment(assessmentId, studentId);
    const submissionId = sub ? sub.submissionId : `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Save answers
    for (const item of answersPayload) {
      await dataRepository.saveAssessmentAnswer({
        submissionId,
        questionId: item.questionId,
        studentId,
        answer: item.answer,
        attachments: item.attachments,
        submittedAt: new Date(),
        answerType: typeof item.answer === 'object' ? 'complex' : 'text',
      });
    }

    const questions = await dataRepository.getTeacherAssessmentQuestions(assessmentId);
    const answers = await dataRepository.getAssessmentAnswers(submissionId);
    const rubric = asm.rubricId ? await dataRepository.getAssessmentRubricById(asm.rubricId) : undefined;

    // Run AI / Objective Evaluation for each question
    const evaluations: IAIEvaluation[] = [];

    for (const q of questions) {
      const studentAnsObj = answers.find((a) => a.questionId === q.questionId);
      const studentAnsValue = studentAnsObj ? studentAnsObj.answer : undefined;

      const evalResult = AssessmentAICoach.evaluateSubmissionQuestion(q, studentAnsValue, rubric);

      const aiEvalData: Partial<IAIEvaluation> = {
        evaluationId: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        submissionId,
        questionId: q.questionId,
        proposedScore: evalResult.proposedScore,
        maxScore: evalResult.maxScore,
        confidence: evalResult.confidence,
        rubricScores: evalResult.rubricScores,
        strengths: evalResult.strengths,
        weaknesses: evalResult.weaknesses,
        evidence: evalResult.evidence,
        misconceptionTags: evalResult.misconceptions,
        feedback: evalResult.feedback,
        recommendedActions: evalResult.recommendedActions,
        modelVersion: 'bharatedu-ai-eval-v1',
        evaluationStatus: evalResult.aiStatus === 'generated' ? 'generated' : 'pending',
        generatedAt: new Date(),
      };

      const savedEval = await dataRepository.saveAIEvaluation(aiEvalData);
      evaluations.push(savedEval);
    }

    // Save or update submission status
    const subStatus = lateCheck.isLate ? 'late' : 'ai_evaluated';
    const finalSub = await dataRepository.createAssessmentSubmission({
      submissionId,
      assessmentId,
      studentId,
      submittedAt: new Date(),
      status: subStatus,
      attemptNumber: sub ? sub.attemptNumber : 1,
      totalQuestions: questions.length,
      answeredQuestions: answers.length,
      completionPercent: 100,
      lateByMinutes: lateCheck.lateByMinutes,
      finalScore: evaluations.reduce((sum, e) => sum + e.proposedScore, 0),
      percentage: Math.round((evaluations.reduce((sum, e) => sum + e.proposedScore, 0) / Math.max(1, asm.totalMarks)) * 100),
      teacherFinalized: false,
    });

    // Create Audit Log
    await dataRepository.createAssessmentAudit({
      submissionId,
      actorUserId: studentId,
      actorRole: 'student',
      action: 'submitted',
      newValue: { submittedAt: new Date(), lateByMinutes: lateCheck.lateByMinutes },
      reason: 'Student completed assessment submission',
      timestamp: new Date(),
    });

    return { submission: finalSub, evaluations };
  }

  async getStudentSubmissionResult(submissionId: string, studentId: string) {
    const sub = await dataRepository.getAssessmentSubmissionById(submissionId);
    if (!sub) throw new Error('Submission not found');
    if (sub.studentId !== studentId) throw new Error('Access denied. You do not own this submission.');

    const grade = await dataRepository.getAssessmentGradeBySubmission(submissionId);
    if (!grade) {
      return {
        submission: sub,
        status: sub.status,
        message: 'Submission received and evaluated by AI. Teacher review pending.',
      };
    }

    const questions = await dataRepository.getTeacherAssessmentQuestions(sub.assessmentId);
    const answers = await dataRepository.getAssessmentAnswers(submissionId);

    const feedback = AssessmentFeedbackGenerator.generateStudentFeedback(sub, grade, questions, answers);

    return {
      submission: sub,
      grade,
      feedback,
    };
  }

  // --- REVIEW & TEACHER FINALIZATION ---
  async approveAIEvaluation(submissionId: string, teacherId: string) {
    return await AssessmentReviewService.approveAIEvaluations(submissionId, teacherId);
  }

  async modifyAndFinalizeGrade(submissionId: string, teacherId: string, payload: TeacherReviewPayload) {
    return await AssessmentReviewService.modifyAndFinalizeGrade(submissionId, teacherId, payload);
  }

  // --- ANALYTICS & PARENT SUMMARY ---
  async getAssessmentAnalytics(assessmentId: string, teacherId: string) {
    const assessment = await dataRepository.getAssessmentById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.teacherId !== teacherId) throw new Error('Access denied. You do not own this assessment.');

    const questions = await dataRepository.getTeacherAssessmentQuestions(assessmentId);
    const submissions = await dataRepository.getSubmissionsByAssessment(assessmentId);

    const grades = [];
    const evaluations = [];
    for (const sub of submissions) {
      const g = await dataRepository.getAssessmentGradeBySubmission(sub.submissionId);
      if (g) grades.push(g);
      const evs = await dataRepository.getAIEvaluationsBySubmission(sub.submissionId);
      evaluations.push(...evs);
    }

    return AssessmentAnalyticsEngine.computeAnalytics(assessment, questions, submissions, grades, evaluations);
  }

  async getParentStudentSummary(studentId: string) {
    const submissions = await dataRepository.getSubmissionsByStudent(studentId);
    const returnedSubmissions = submissions.filter((s) => s.status === 'returned' || s.teacherFinalized);

    const totalScoreSum = returnedSubmissions.reduce((sum, s) => sum + s.finalScore, 0);
    const avgPercentage = returnedSubmissions.length > 0
      ? Math.round(returnedSubmissions.reduce((sum, s) => sum + s.percentage, 0) / returnedSubmissions.length)
      : 0;

    return {
      studentId,
      totalAssessmentsTaken: submissions.length,
      returnedAssessmentsCount: returnedSubmissions.length,
      averagePercentage: avgPercentage,
      recentSubmissions: returnedSubmissions.map((s) => ({
        submissionId: s.submissionId,
        assessmentId: s.assessmentId,
        finalScore: s.finalScore,
        percentage: s.percentage,
        returnedAt: s.returnedAt,
      })),
    };
  }
}

export const assessmentService = new AssessmentService();
