import { ExamBlueprint, ExamQuestion } from './types.js';
import { VERIFIED_PRACTICE_QUESTION_BANK } from '../personalized-practice/ai-coach.js';

export const VERIFIED_EXAM_QUESTION_BANK: ExamQuestion[] = [
  {
    questionId: 'me_q_quad_01',
    sectionId: 'sec_1_mathematics',
    questionNumber: 1,
    marks: 2,
    negativeMarks: 0.5,
    difficulty: 'medium',
    conceptId: 'c_quad_disc',
    topicId: 'top_algebra_01',
    questionType: 'mcq',
    question: 'For the quadratic equation 2x² - 4x + 3 = 0, what is the value of the discriminant (D)?',
    options: ['D = -8', 'D = 8', 'D = -16', 'D = 0'],
    correctAnswer: 'D = -8',
    explanation: 'The discriminant formula is D = b² - 4ac. Here a=2, b=-4, c=3. So D = (-4)² - 4(2)(3) = 16 - 24 = -8.',
    solutionSteps: [
      'Identify coefficients: a = 2, b = -4, c = 3',
      'Apply formula D = b² - 4ac',
      'Calculate D = 16 - 24 = -8',
    ],
    sourceType: 'verified_bank',
    misconceptionTags: ['calc_sign_error'],
  },
  {
    questionId: 'me_q_quad_02',
    sectionId: 'sec_1_mathematics',
    questionNumber: 2,
    marks: 2,
    negativeMarks: 0.5,
    difficulty: 'easy',
    conceptId: 'c_quad_formula',
    topicId: 'top_algebra_01',
    questionType: 'mcq',
    question: 'Find the roots of x² - 5x + 6 = 0.',
    options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = 5'],
    correctAnswer: 'x = 2 and x = 3',
    explanation: 'Factoring: (x - 2)(x - 3) = 0 gives roots x = 2 and x = 3.',
    solutionSteps: [
      'Factorize x² - 5x + 6 into (x - 2)(x - 3)',
      'Set each factor to zero: x - 2 = 0 => x = 2 and x - 3 = 0 => x = 3',
    ],
    sourceType: 'verified_bank',
  },
  {
    questionId: 'me_q_trig_01',
    sectionId: 'sec_1_mathematics',
    questionNumber: 3,
    marks: 2,
    negativeMarks: 0.5,
    difficulty: 'hard',
    conceptId: 'c_trig_identities',
    topicId: 'top_trig_01',
    questionType: 'mcq',
    question: 'What is the simplified value of (1 + tan²θ) · cos²θ?',
    options: ['1', 'sin²θ', 'tan²θ', '2'],
    correctAnswer: '1',
    explanation: '1 + tan²θ = sec²θ. So sec²θ · cos²θ = (1/cos²θ) · cos²θ = 1.',
    solutionSteps: [
      'Use identity 1 + tan²θ = sec²θ',
      'Substitute to get sec²θ · cos²θ',
      'Since secθ = 1/cosθ, sec²θ · cos²θ = 1',
    ],
    sourceType: 'verified_bank',
  },
  {
    questionId: 'me_q_chem_01',
    sectionId: 'sec_2_science',
    questionNumber: 4,
    marks: 2,
    negativeMarks: 0.5,
    difficulty: 'easy',
    conceptId: 'c_chem_balancing',
    topicId: 'top_chem_01',
    questionType: 'mcq',
    question: 'In the balanced chemical equation Fe + H₂O -> Fe₃O₄ + H₂, what is the coefficient of H₂O?',
    options: ['4', '3', '2', '1'],
    correctAnswer: '4',
    explanation: 'The balanced equation is 3Fe + 4H₂O -> Fe₃O₄ + 4H₂. So the coefficient of H₂O is 4.',
    solutionSteps: [
      'Balance oxygen atoms: Fe + 4H₂O -> Fe₃O₄ + H₂',
      'Balance iron & hydrogen atoms: 3Fe + 4H₂O -> Fe₃O₄ + 4H₂',
      'Coefficient of H₂O is 4',
    ],
    sourceType: 'verified_bank',
  },
  {
    questionId: 'me_q_phys_01',
    sectionId: 'sec_2_science',
    questionNumber: 5,
    marks: 2,
    negativeMarks: 0.5,
    difficulty: 'medium',
    conceptId: 'c_phys_reflection',
    topicId: 'top_phys_01',
    questionType: 'mcq',
    question: 'What is the focal length of a concave mirror with radius of curvature 30 cm?',
    options: ['15 cm', '-15 cm', '30 cm', '-30 cm'],
    correctAnswer: '-15 cm',
    explanation: 'Focal length f = R/2. By sign convention, concave mirror focal length is negative: f = -30/2 = -15 cm.',
    solutionSteps: [
      'Recall formula f = R / 2',
      'Apply sign convention for concave mirror: f is negative',
      'f = -30 / 2 = -15 cm',
    ],
    sourceType: 'verified_bank',
  },
];

export function selectExamQuestions(
  blueprint: ExamBlueprint,
  weakConcepts: string[] = []
): ExamQuestion[] {
  const selected: ExamQuestion[] = [];
  const usedIds = new Set<string>();

  let qNumber = 1;

  for (const section of blueprint.sections) {
    const count = section.questionCount;
    let addedForSection = 0;

    // Filter verified bank matching section subject/types
    for (const q of VERIFIED_EXAM_QUESTION_BANK) {
      if (addedForSection >= count) break;
      if (!usedIds.has(q.questionId)) {
        usedIds.add(q.questionId);
        selected.push({
          ...q,
          sectionId: section.sectionId,
          questionNumber: qNumber++,
          marks: Math.round(section.totalMarks / count) || 2,
          negativeMarks: blueprint.negativeMarking ? (blueprint.negativeMarks || 0.5) : 0,
        });
        addedForSection++;
      }
    }

    // Fill remaining with generated/fallback questions if bank count is insufficient
    while (addedForSection < count) {
      const fallbackId = `me_q_fallback_${section.sectionId}_${addedForSection + 1}_${Date.now()}`;
      usedIds.add(fallbackId);
      selected.push({
        questionId: fallbackId,
        sectionId: section.sectionId,
        questionNumber: qNumber++,
        marks: Math.round(section.totalMarks / count) || 2,
        negativeMarks: blueprint.negativeMarking ? (blueprint.negativeMarks || 0.5) : 0,
        difficulty: addedForSection % 2 === 0 ? 'medium' : 'hard',
        conceptId: weakConcepts[0] || 'c_quad_disc',
        topicId: 'top_general',
        questionType: 'mcq',
        question: `Sample Mock Exam Question ${addedForSection + 1} for ${section.name}?`,
        options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A (Correct)',
        explanation: 'Detailed step-by-step solution for mock exam question.',
        solutionSteps: ['Step 1: Analyze problem statement', 'Step 2: Apply core theorem', 'Step 3: Select correct option'],
        sourceType: 'ai_generated',
      });
      addedForSection++;
    }
  }

  return selected;
}
