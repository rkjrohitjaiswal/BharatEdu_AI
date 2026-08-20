import { ExamPaperType } from '../../models/exam-paper.model.js';
import { createStudentExamPaperEngine } from './engine.js';
import { IExamPaperDTO } from './types.js';

export async function createFullLengthMockExam(studentId: string, options?: { subject?: string; board?: string }): Promise<IExamPaperDTO> {
  return await createStudentExamPaperEngine(studentId, {
    examType: 'mock_exam',
    subject: options?.subject || 'Mathematics',
    board: options?.board || 'CBSE',
    title: `${options?.subject || 'Mathematics'} Full-Length Mock Exam`,
  });
}

export async function createWeakAreaMockExam(studentId: string): Promise<IExamPaperDTO> {
  return await createStudentExamPaperEngine(studentId, {
    examType: 'practice_paper',
    subject: 'Mathematics',
    title: 'Weak Area Targeted Remediation Mock Exam',
  });
}

export async function createExamReadinessMockExam(studentId: string): Promise<IExamPaperDTO> {
  return await createStudentExamPaperEngine(studentId, {
    examType: 'board_style',
    subject: 'Mathematics',
    title: 'Board-Style Exam Readiness Benchmark Mock',
  });
}
