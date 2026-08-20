import { dataRepository } from '../../repositories/data.repository.js';
import { ExamPaperType } from '../../models/exam-paper.model.js';
import { generateAIExamPostInsight } from './ai-coach.js';
import { generateExamPaperBlueprint } from './blueprint.js';
import { calculateQuestionDifficultyForSequence } from './difficulty.js';
import { evaluateExamPaperQuestionAnswer } from './evaluation.js';
import { getFallbackQuestionForExamSection } from './question-generator.js';
import { IExamPaperDTO, IExamPaperQuestionClientDTO, IExamPaperResultsDTO } from './types.js';

export async function createStudentExamPaperEngine(
  studentId: string,
  options?: {
    board?: string;
    classLevel?: string;
    subject?: string;
    examType?: ExamPaperType;
    title?: string;
  }
): Promise<IExamPaperDTO> {
  const paperId = `ep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const board = options?.board || 'CBSE';
  const classLevel = options?.classLevel || 'Class 10';
  const subject = options?.subject || 'Mathematics';
  const examType = options?.examType || 'mock_exam';
  const title = options?.title || `${subject} ${examType.replace('_', ' ').toUpperCase()} Paper`;

  const blueprint = generateExamPaperBlueprint(board, classLevel, subject, examType);

  const createdPaper = await dataRepository.createExamPaper({
    paperId,
    studentId,
    title,
    board,
    classLevel,
    subject,
    academicYear: '2025-2026',
    examType,
    durationMinutes: blueprint.durationMinutes,
    totalMarks: blueprint.totalMarks,
    questionCount: blueprint.sections.reduce((acc, s) => acc + s.questionCount, 0),
    difficultyDistribution: blueprint.difficultyDistribution,
    sectionCount: blueprint.sections.length,
    status: 'ready',
  });

  const pDbId = String(createdPaper._id || createdPaper.id || paperId);

  await dataRepository.createExamPaperBlueprint({
    paperId: pDbId,
    board,
    classLevel,
    subject,
    examType,
    totalMarks: blueprint.totalMarks,
    durationMinutes: blueprint.durationMinutes,
    sectionBlueprint: blueprint.sections,
    topicDistribution: blueprint.topicDistribution,
    difficultyDistribution: blueprint.difficultyDistribution,
    questionTypeDistribution: { mcq: 40, short_answer: 30, long_answer: 30 },
    learningObjectiveDistribution: { recall: 25, understanding: 40, application: 25, analysis: 10 },
  });

  let seqCounter = 1;
  for (const sec of blueprint.sections) {
    const secId = `sec_${pDbId}_${sec.sequence}`;
    await dataRepository.createExamPaperSection({
      paperId: pDbId,
      sectionId: secId,
      title: sec.title,
      instructions: sec.instructions,
      sequence: sec.sequence,
      questionType: sec.questionType,
      questionCount: sec.questionCount,
      marksPerQuestion: sec.marksPerQuestion,
      totalMarks: sec.totalMarks,
      negativeMarking: sec.negativeMarking,
      negativeMarks: sec.negativeMarks,
    });

    for (let i = 1; i <= sec.questionCount; i++) {
      const qDiff = calculateQuestionDifficultyForSequence(seqCounter, blueprint.sections.reduce((a, b) => a + b.questionCount, 0), blueprint.difficultyDistribution);
      const qData = getFallbackQuestionForExamSection(subject, 'Algebra', 'math_linear_eq', qDiff, sec.questionType as any, sec.marksPerQuestion, seqCounter);

      await dataRepository.createExamPaperQuestion({
        paperId: pDbId,
        sectionId: secId,
        questionId: `q_${Date.now()}_${seqCounter}`,
        sequence: seqCounter,
        subject,
        topicId: 'Algebra',
        conceptId: 'math_linear_eq',
        difficulty: qDiff,
        questionType: sec.questionType as any,
        questionText: qData.questionText,
        options: qData.options,
        correctAnswer: qData.correctAnswer, // Server-side only!
        expectedConceptCoverage: qData.expectedConceptCoverage,
        rubric: qData.rubric,
        marks: sec.marksPerQuestion,
        negativeMarks: sec.negativeMarks,
        sourceType: qData.sourceType,
        generatedBy: qData.generatedBy,
        status: 'unanswered',
      });
      seqCounter++;
    }
  }

  const sections = await dataRepository.getExamPaperSections(pDbId);
  const currentQ = await getCurrentExamPaperQuestionEngine(studentId, pDbId);

  return {
    id: pDbId,
    paperId,
    studentId: String(studentId),
    title,
    board,
    classLevel,
    subject,
    academicYear: '2025-2026',
    examType,
    durationMinutes: blueprint.durationMinutes,
    totalMarks: blueprint.totalMarks,
    questionCount: seqCounter - 1,
    difficultyDistribution: blueprint.difficultyDistribution,
    sections: (sections || []).map((s: any) => ({
      sectionId: String(s.sectionId || s._id),
      paperId: String(pDbId),
      title: s.title,
      instructions: s.instructions,
      sequence: s.sequence,
      questionType: s.questionType,
      questionCount: s.questionCount,
      marksPerQuestion: s.marksPerQuestion,
      totalMarks: s.totalMarks,
      negativeMarking: s.negativeMarking,
      negativeMarks: s.negativeMarks,
    })),
    status: 'ready',
    currentQuestion: currentQ || undefined,
    createdAt: createdPaper.createdAt ? new Date(createdPaper.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: createdPaper.updatedAt ? new Date(createdPaper.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function getCurrentExamPaperQuestionEngine(
  studentId: string,
  paperId: string
): Promise<IExamPaperQuestionClientDTO | null> {
  const questions = await dataRepository.getExamPaperQuestions(paperId);
  const target = questions.find((q) => q.status === 'unanswered' || q.status === 'marked_for_review') || questions[0];
  if (!target) return null;

  // SANITIZE Payload: OMIT correctAnswer from payload returned to client during exam!
  return {
    id: String(target._id || target.id || target.questionId),
    questionId: target.questionId,
    paperId: String(paperId),
    sectionId: target.sectionId,
    sequence: target.sequence,
    subject: target.subject,
    topicId: target.topicId,
    conceptId: target.conceptId,
    difficulty: target.difficulty,
    questionType: target.questionType,
    questionText: target.questionText,
    options: target.options,
    marks: target.marks,
    negativeMarks: target.negativeMarks,
    sourceType: target.sourceType,
    status: target.status,
  };
}

export async function submitExamPaperAnswerEngine(
  studentId: string,
  paperId: string,
  questionId: string,
  submittedAnswer: string,
  responseTimeSeconds = 30
) {
  const paper = await dataRepository.getExamPaper(paperId, studentId);
  const q = await dataRepository.getExamPaperQuestion(questionId);
  if (!paper || !q) throw new Error('Paper or question not found');

  const evalResult = evaluateExamPaperQuestionAnswer(q.questionType, submittedAnswer, q.correctAnswer, q.marks, q.negativeMarks);

  await dataRepository.createExamPaperAttempt({
    paperId,
    questionId,
    studentId,
    answer: submittedAnswer,
    submittedAt: new Date(),
    responseTimeSeconds,
    isCorrect: evalResult.isCorrect,
    marksAwarded: evalResult.marksAwarded,
    negativeMarksApplied: evalResult.negativeMarksApplied,
    feedback: evalResult.feedback,
  });

  await dataRepository.updateExamPaperQuestion(questionId, { status: 'answered', updatedAt: new Date() });

  const nextQ = await getCurrentExamPaperQuestionEngine(studentId, paperId);

  return {
    paperId,
    questionId,
    isCorrect: evalResult.isCorrect,
    marksAwarded: evalResult.marksAwarded,
    negativeMarksApplied: evalResult.negativeMarksApplied,
    feedback: evalResult.feedback,
    nextQuestion: nextQ,
  };
}

export async function markExamPaperQuestionForReviewEngine(studentId: string, paperId: string, questionId: string) {
  await dataRepository.updateExamPaperQuestion(questionId, { status: 'marked_for_review', updatedAt: new Date() });
  return await getCurrentExamPaperQuestionEngine(studentId, paperId);
}

export async function getExamPaperResultsEngine(studentId: string, paperId: string): Promise<IExamPaperResultsDTO> {
  const paper = await dataRepository.getExamPaper(paperId, studentId);
  const attempts = await dataRepository.getExamPaperAttempts(paperId);

  const grossMarks = attempts.reduce((acc, a) => acc + (a.marksAwarded || 0), 0);
  const negativeMarks = attempts.reduce((acc, a) => acc + (a.negativeMarksApplied || 0), 0);
  const netMarks = Math.max(0, grossMarks - negativeMarks);
  const totalMarks = paper?.totalMarks || 50;

  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / (attempts.length || 1)) * 100);
  const percentage = Math.round((netMarks / totalMarks) * 100);

  const insight = await generateAIExamPostInsight(
    netMarks,
    totalMarks,
    accuracy,
    paper?.subject || 'Mathematics',
    paper?.title || 'Mock Exam'
  );

  return {
    paperId,
    studentId,
    title: paper?.title || 'Mock Exam Paper',
    grossMarks,
    negativeMarks,
    netMarks,
    totalMarks,
    accuracy,
    percentage,
    completionRate: 100,
    sectionPerformance: [{ sectionId: 'sec_a', title: 'Section A', score: netMarks, totalMarks }],
    topicPerformance: [{ topicId: 'Algebra', topicName: 'Algebra', accuracy }],
    difficultyPerformance: [{ difficulty: 'medium', accuracy }],
    aiInsight: insight,
    evaluatedAt: new Date().toISOString(),
  };
}
