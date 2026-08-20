import { ExamBlueprint, ExamSectionConfig, MockExamConfig } from './types.js';

export function buildExamBlueprint(config: MockExamConfig, weakConcepts: string[] = []): ExamBlueprint {
  const board = config.board || 'CBSE';
  const classLevel = config.classLevel || 'Class 10';
  const targetExam = config.targetExam || `${classLevel} Board Exam`;
  const examType = config.examType || 'full_length';

  let durationMinutes = config.durationMinutes || 180;
  let totalQuestions = config.totalQuestions || 50;
  let totalMarks = config.totalMarks || 100;
  const negativeMarking = config.negativeMarking ?? true;
  const negativeMarks = config.negativeMarks ?? 0.25;

  if (examType === 'sectional') {
    durationMinutes = 45;
    totalQuestions = 15;
    totalMarks = 30;
  } else if (examType === 'topic_test' || examType === 'revision_test') {
    durationMinutes = 30;
    totalQuestions = 10;
    totalMarks = 20;
  } else if (examType === 'quick' as any) {
    durationMinutes = 20;
    totalQuestions = 5;
    totalMarks = 10;
  }

  const subjects = config.subjects && config.subjects.length > 0
    ? config.subjects
    : ['Mathematics', 'Science', 'Social Science'];

  const questionsPerSubject = Math.floor(totalQuestions / subjects.length);
  let remainingQs = totalQuestions % subjects.length;

  const sections: ExamSectionConfig[] = subjects.map((subj, idx) => {
    const qCount = questionsPerSubject + (idx === 0 ? remainingQs : 0);
    const sectionMarks = Math.round((qCount / totalQuestions) * totalMarks);
    return {
      sectionId: `sec_${idx + 1}_${subj.toLowerCase().replace(/\s+/g, '_')}`,
      name: `${subj} Section`,
      subject: subj,
      questionCount: qCount,
      totalMarks: sectionMarks,
      allowedQuestionTypes: ['mcq', 'numerical', 'assertion_reason'],
    };
  });

  const easyPct = examType === 'adaptive_mock' ? 30 : 40;
  const mediumPct = examType === 'adaptive_mock' ? 40 : 40;
  const hardPct = 100 - easyPct - mediumPct;

  const defaultConcepts = [
    { conceptId: 'c_quad_disc', topicId: 'top_algebra_01', subject: 'Mathematics' },
    { conceptId: 'c_quad_formula', topicId: 'top_algebra_01', subject: 'Mathematics' },
    { conceptId: 'c_linear_pair', topicId: 'top_algebra_01', subject: 'Mathematics' },
    { conceptId: 'c_trig_identities', topicId: 'top_trig_01', subject: 'Mathematics' },
    { conceptId: 'c_chem_balancing', topicId: 'top_chem_01', subject: 'Science' },
    { conceptId: 'c_chem_reactions', topicId: 'top_chem_01', subject: 'Science' },
    { conceptId: 'c_phys_reflection', topicId: 'top_phys_01', subject: 'Science' },
    { conceptId: 'c_phys_refraction', topicId: 'top_phys_01', subject: 'Science' },
    { conceptId: 'c_hist_nationalism', topicId: 'top_hist_01', subject: 'Social Science' },
  ];

  const conceptDistribution = defaultConcepts.map((item) => ({
    ...item,
    questionCount: Math.max(1, Math.floor(totalQuestions / defaultConcepts.length)),
  }));

  return {
    blueprintId: `bp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    targetExam,
    board,
    classLevel,
    durationMinutes,
    totalMarks,
    totalQuestions,
    negativeMarking,
    negativeMarks,
    sections,
    difficultyDistribution: {
      easy: easyPct,
      medium: mediumPct,
      hard: hardPct,
    },
    conceptDistribution,
  };
}
