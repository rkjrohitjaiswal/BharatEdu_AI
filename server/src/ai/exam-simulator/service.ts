import { dataRepository } from '../../repositories/data.repository.js';
import { analyzeExamResult } from './analysis.js';
import { buildExamBlueprint } from './blueprint.js';
import { evaluateExamAnswers } from './evaluator.js';
import { selectExamQuestions } from './question-selector.js';
import { computeServerExamTimer } from './timer.js';
import { ExamQuestion, MockExamConfig } from './types.js';
import { validateExamQuestion } from './validator.js';

export class MockExamService {
  async getExamRecommendations(studentId: string) {
    const student = await dataRepository.getStudentProfile(studentId);
    const board = student?.board || 'CBSE';
    const classLevel = student?.classLevel || 'Class 10';

    return [
      {
        recommendationId: `rec_exam_full_${Date.now()}`,
        examType: 'full_length',
        title: `${classLevel} Full-Length Grand Mock Test`,
        description: `Complete ${board} pattern 3-hour realistic exam covering Mathematics, Science, and Social Science.`,
        durationMinutes: 180,
        totalQuestions: 50,
        totalMarks: 100,
        priority: 'HIGH',
        reason: 'Recommended for overall exam readiness assessment',
      },
      {
        recommendationId: `rec_exam_adaptive_${Date.now()}`,
        examType: 'adaptive_mock',
        title: 'Adaptive Weakness Mock Test',
        description: 'Targeted exam focusing on your identified weak concepts and Knowledge Graph prerequisite gaps.',
        durationMinutes: 60,
        totalQuestions: 20,
        totalMarks: 40,
        priority: 'CRITICAL',
        reason: 'Identified 3 weak concepts requiring high-priority testing',
      },
      {
        recommendationId: `rec_exam_sec_${Date.now()}`,
        examType: 'sectional',
        title: 'Mathematics Sectional Speed Mock',
        description: 'Sectional test to improve accuracy and speed in Mathematics quadratic equations & trigonometry.',
        durationMinutes: 45,
        totalQuestions: 15,
        totalMarks: 30,
        priority: 'MEDIUM',
        reason: 'Improve section-specific time management',
      },
    ];
  }

  async createMockExam(studentId: string, config: MockExamConfig) {
    const blueprint = buildExamBlueprint(config);
    const examId = `exam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const examData = {
      examId,
      studentId,
      title: config.title || `${blueprint.classLevel} ${blueprint.targetExam}`,
      examType: config.examType || 'full_length',
      board: blueprint.board,
      classLevel: blueprint.classLevel,
      targetExam: blueprint.targetExam,
      durationMinutes: blueprint.durationMinutes,
      totalMarks: blueprint.totalMarks,
      passingMarks: Math.round(blueprint.totalMarks * 0.33),
      negativeMarking: blueprint.negativeMarking,
      negativeMarks: blueprint.negativeMarks,
      totalQuestions: blueprint.totalQuestions,
      sections: blueprint.sections.map((s) => ({
        sectionId: s.sectionId,
        name: s.name,
        subject: s.subject,
        questionCount: s.questionCount,
        totalMarks: s.totalMarks,
      })),
      difficultyDistribution: blueprint.difficultyDistribution,
      status: 'ready',
      createdAt: new Date(),
    };

    const savedExam = await dataRepository.createMockExam(examData);

    const questions = selectExamQuestions(blueprint);
    for (const q of questions) {
      q.examId = examId;
      const val = validateExamQuestion(q);
      if (val.valid) {
        await dataRepository.createMockExamQuestion(q);
      }
    }

    return savedExam;
  }

  async getMockExamInstructions(examId: string, studentId: string) {
    const exam = await dataRepository.getMockExamById(examId);
    if (!exam) throw new Error('Mock exam not found');

    return {
      exam,
      instructions: [
        `Total Duration: ${exam.durationMinutes} Minutes. Timer is managed authoritatively by the server.`,
        `Total Questions: ${exam.totalQuestions} across ${exam.sections.length} sections.`,
        exam.negativeMarking ? `Negative Marking: -${exam.negativeMarks} marks for each wrong answer.` : 'No negative marking.',
        'You can navigate between questions and sections freely unless section order is locked.',
        'Your selected answers are automatically saved.',
        'Clicking "Submit Exam" will finalize your attempt and process detailed AI analytics.',
      ],
    };
  }

  async startMockExam(examId: string, studentId: string) {
    const exam = await dataRepository.getMockExamById(examId);
    if (!exam) throw new Error('Mock exam not found');

    const attemptId = `att_exam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + exam.durationMinutes * 60 * 1000);

    const attemptData = {
      attemptId,
      examId,
      studentId,
      attemptNumber: 1,
      startedAt: now,
      expiresAt,
      status: 'in_progress',
      currentQuestionNumber: 1,
      answers: [],
      visitedQuestions: [1],
      markedForReview: [],
      score: 0,
      accuracy: 0,
      attemptedCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      skippedCount: exam.totalQuestions,
      timeSpentSeconds: 0,
    };

    await dataRepository.createMockExamAttempt(attemptData);

    return {
      attemptId,
      examId,
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      durationMinutes: exam.durationMinutes,
      totalQuestions: exam.totalQuestions,
    };
  }

  async getExamQuestion(examId: string, questionNumber: number, studentId: string) {
    const attempt = await dataRepository.getStudentMockExamAttempt(examId, studentId);
    if (!attempt) throw new Error('Active exam attempt not found');

    const question = await dataRepository.getMockExamQuestionByNumber(examId, questionNumber);
    if (!question) throw new Error('Question not found');

    // CRITICAL ANSWER KEY SECURITY:
    // Destructure correctAnswer, explanation, solution out of question object before returning!
    const { correctAnswer, explanation, solutionSteps, ...sanitizedQuestion } = question;

    const timer = computeServerExamTimer(attempt.startedAt, attempt.examId ? 180 : 60);

    return {
      question: sanitizedQuestion,
      currentIndex: questionNumber,
      totalQuestions: attempt.totalQuestions || 50,
      savedAnswer: attempt.answers?.find((a: any) => a.questionNumber === questionNumber)?.selectedAnswer || '',
      isMarkedForReview: attempt.markedForReview?.includes(questionNumber) || false,
      timer,
    };
  }

  async submitAnswer(examId: string, studentId: string, payload: { questionNumber: number; selectedAnswer: string }) {
    const attempt = await dataRepository.getStudentMockExamAttempt(examId, studentId);
    if (!attempt || attempt.status !== 'in_progress') throw new Error('Active attempt not found');

    const question = await dataRepository.getMockExamQuestionByNumber(examId, payload.questionNumber);
    if (!question) throw new Error('Question not found');

    const answersMap: Record<string, string> = {};
    (attempt.answers || []).forEach((a: any) => {
      answersMap[a.questionId] = a.selectedAnswer;
    });
    answersMap[question.questionId] = payload.selectedAnswer;

    const updatedAnswers = Object.entries(answersMap).map(([qId, ans]) => ({
      questionId: qId,
      questionNumber: payload.questionNumber,
      selectedAnswer: ans,
    }));

    attempt.answers = updatedAnswers;
    if (!attempt.visitedQuestions.includes(payload.questionNumber)) {
      attempt.visitedQuestions.push(payload.questionNumber);
    }

    await dataRepository.saveMockExamAttempt(attempt);

    return { success: true, savedAnswer: payload.selectedAnswer };
  }

  async autosave(examId: string, studentId: string, payload: any) {
    const attempt = await dataRepository.getStudentMockExamAttempt(examId, studentId);
    if (!attempt) return { success: false };

    if (payload.currentQuestionNumber) attempt.currentQuestionNumber = payload.currentQuestionNumber;
    if (payload.visitedQuestions) attempt.visitedQuestions = payload.visitedQuestions;
    if (payload.markedForReview) attempt.markedForReview = payload.markedForReview;

    await dataRepository.saveMockExamAttempt(attempt);
    return { success: true };
  }

  async submitExam(examId: string, studentId: string) {
    const attempt = await dataRepository.getStudentMockExamAttempt(examId, studentId);
    if (!attempt) throw new Error('Active exam attempt not found');

    const questions = await dataRepository.getMockExamQuestions(examId);

    const answersMap: Record<string, string> = {};
    (attempt.answers || []).forEach((a: any) => {
      answersMap[a.questionId] = a.selectedAnswer;
    });

    const timer = computeServerExamTimer(attempt.startedAt, 180);
    const evalRes = evaluateExamAnswers(questions, answersMap, timer.totalElapsedSeconds);

    attempt.status = 'evaluated';
    attempt.submittedAt = new Date();
    attempt.score = evalRes.score;
    attempt.accuracy = evalRes.accuracy;
    attempt.attemptedCount = evalRes.attemptedCount;
    attempt.correctCount = evalRes.correctCount;
    attempt.incorrectCount = evalRes.incorrectCount;
    attempt.skippedCount = evalRes.skippedCount;
    attempt.timeSpentSeconds = timer.totalElapsedSeconds;

    await dataRepository.saveMockExamAttempt(attempt);

    const result = analyzeExamResult(
      attempt.attemptId,
      studentId,
      examId,
      questions,
      answersMap,
      evalRes.score,
      evalRes.totalMarks,
      evalRes.accuracy,
      evalRes.attemptedCount,
      evalRes.correctCount,
      evalRes.incorrectCount,
      evalRes.skippedCount,
      timer.totalElapsedSeconds
    );

    await dataRepository.saveMockExamResult(result);

    return result;
  }

  async getExamResult(examId: string, studentId: string) {
    const result = await dataRepository.getMockExamResultByStudent(examId, studentId);
    if (!result) throw new Error('Result not found');
    return result;
  }

  async getStudentExamHistory(studentId: string) {
    return await dataRepository.getStudentMockExamAttempts(studentId);
  }

  async getTeacherSummary(studentId: string) {
    const attempts = await dataRepository.getStudentMockExamAttempts(studentId);
    return {
      studentId,
      totalMocksTaken: attempts.length,
      averageScore: attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + (b.score || 0), 0) / attempts.length) : 0,
      averageAccuracy: attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + (b.accuracy || 0), 0) / attempts.length) : 0,
      attempts,
    };
  }

  async getParentSummary(studentId: string) {
    const attempts = await dataRepository.getStudentMockExamAttempts(studentId);
    return {
      studentId,
      totalMocksTaken: attempts.length,
      averageScore: attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + (b.score || 0), 0) / attempts.length) : 0,
      averageAccuracy: attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + (b.accuracy || 0), 0) / attempts.length) : 0,
      lastMockDate: attempts[0]?.submittedAt || attempts[0]?.startedAt || null,
    };
  }
}

export const mockExamService = new MockExamService();
