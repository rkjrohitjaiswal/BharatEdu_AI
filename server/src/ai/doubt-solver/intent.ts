import { DoubtIntentCategory } from './types.js';

export function detectDoubtIntent(question: string): {
  intent: DoubtIntentCategory;
  subject: string;
  topicId: string;
  conceptId?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
} {
  const q = (question || '').toLowerCase().trim();

  let intent: DoubtIntentCategory = 'general_academic';
  if (q.includes('solve') || q.includes('find') || q.includes('calculate') || q.includes('evaluate')) {
    intent = 'solve_problem';
  } else if (q.includes('formula') || q.includes('theorem')) {
    intent = 'formula_explanation';
  } else if (q.includes('why') || q.includes('explain answer')) {
    intent = 'explain_answer';
  } else if (q.includes('difference') || q.includes('compare') || q.includes('versus') || q.includes('vs')) {
    intent = 'compare_concepts';
  } else if (q.includes('prerequisite') || q.includes('before learning')) {
    intent = 'prerequisite_help';
  } else if (q.includes('exam') || q.includes('board') || q.includes('marks')) {
    intent = 'exam_question';
  } else if (q.includes('code') || q.includes('function') || q.includes('python')) {
    intent = 'coding_help';
  } else if (q.includes('what is') || q.includes('define') || q.includes('concept')) {
    intent = 'concept_explanation';
  }

  let subject = 'Mathematics';
  if (q.includes('physics') || q.includes('force') || q.includes('velocity') || q.includes('energy') || q.includes('mass')) {
    subject = 'Physics';
  } else if (q.includes('chemistry') || q.includes('atom') || q.includes('reaction') || q.includes('acid') || q.includes('base')) {
    subject = 'Chemistry';
  } else if (q.includes('biology') || q.includes('cell') || q.includes('dna') || q.includes('plant') || q.includes('organ')) {
    subject = 'Biology';
  }

  let topicId = 'Algebra';
  let conceptId: string | undefined = 'math_linear_eq';
  if (subject === 'Physics') {
    topicId = 'Mechanics';
    conceptId = 'phys_kinematics';
  } else if (subject === 'Chemistry') {
    topicId = 'Organic Chemistry';
    conceptId = 'chem_hydrocarbons';
  } else if (subject === 'Biology') {
    topicId = 'Genetics';
    conceptId = 'bio_heredity';
  }

  const difficulty = q.length > 80 ? 'hard' : q.length > 30 ? 'medium' : 'easy';

  return { intent, subject, topicId, conceptId, difficulty };
}
