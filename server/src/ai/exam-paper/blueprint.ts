import { ExamPaperType } from '../../models/exam-paper.model.js';

export interface IBlueprintGenerated {
  totalMarks: number;
  durationMinutes: number;
  sections: {
    sectionId: string;
    title: string;
    instructions: string;
    sequence: number;
    questionType: string;
    questionCount: number;
    marksPerQuestion: number;
    totalMarks: number;
    negativeMarking: boolean;
    negativeMarks: number;
  }[];
  topicDistribution: { topicId: string; topicName: string; weightagePercent: number }[];
  difficultyDistribution: { easy: number; medium: number; hard: number };
}

export function generateExamPaperBlueprint(
  board: string,
  classLevel: string,
  subject: string,
  examType: ExamPaperType
): IBlueprintGenerated {
  let durationMinutes = 60;
  let totalMarks = 50;
  let easy = 30;
  let medium = 50;
  let hard = 20;

  if (examType === 'unit_test') {
    durationMinutes = 45;
    totalMarks = 25;
    easy = 40;
    medium = 40;
    hard = 20;
  } else if (examType === 'board_style' || examType === 'mock_exam') {
    durationMinutes = 90;
    totalMarks = 80;
    easy = 30;
    medium = 50;
    hard = 20;
  }

  const sections = [
    {
      sectionId: 'sec_a',
      title: 'Section A: Multiple Choice Questions',
      instructions: 'Choose the single best correct answer for each question.',
      sequence: 1,
      questionType: 'mcq',
      questionCount: Math.round(totalMarks * 0.4),
      marksPerQuestion: 1,
      totalMarks: Math.round(totalMarks * 0.4),
      negativeMarking: false,
      negativeMarks: 0,
    },
    {
      sectionId: 'sec_b',
      title: 'Section B: Short Answer Questions',
      instructions: 'Provide concise step-by-step calculations or explanations.',
      sequence: 2,
      questionType: 'short_answer',
      questionCount: Math.round(totalMarks * 0.3 / 2),
      marksPerQuestion: 2,
      totalMarks: Math.round(totalMarks * 0.3),
      negativeMarking: false,
      negativeMarks: 0,
    },
    {
      sectionId: 'sec_c',
      title: 'Section C: Long Answer / Analytical Questions',
      instructions: 'Show detailed mathematical proofs, working steps, or logical code solutions.',
      sequence: 3,
      questionType: 'long_answer',
      questionCount: Math.round(totalMarks * 0.3 / 5),
      marksPerQuestion: 5,
      totalMarks: Math.round(totalMarks * 0.3),
      negativeMarking: false,
      negativeMarks: 0,
    },
  ];

  const topicDistribution = [
    { topicId: 'Algebra', topicName: 'Algebra & Linear Equations', weightagePercent: 40 },
    { topicId: 'Geometry', topicName: 'Coordinate Geometry & Triangles', weightagePercent: 35 },
    { topicId: 'Trigonometry', topicName: 'Introduction to Trigonometry', weightagePercent: 25 },
  ];

  return {
    totalMarks,
    durationMinutes,
    sections,
    topicDistribution,
    difficultyDistribution: { easy, medium, hard },
  };
}
