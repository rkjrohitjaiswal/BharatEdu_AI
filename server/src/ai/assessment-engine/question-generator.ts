import { QuestionCandidate, QuestionGenerationContext, ValidatedQuestion } from './types.js';
import { QuestionValidator } from './question-validator.js';

export const VERIFIED_ASSESSMENT_QUESTION_BANK: QuestionCandidate[] = [
  {
    questionId: 'q_math_poly_01',
    conceptId: 'math_polynomials',
    subject: 'Mathematics',
    topic: 'Polynomials',
    questionType: 'mcq',
    difficulty: 'easy',
    questionText: 'What is the degree of a non-zero constant polynomial?',
    options: ['0', '1', '2', 'Undefined'],
    correctAnswer: '0',
    explanation: 'The degree of a non-zero constant polynomial P(x) = c (c ≠ 0) is 0 because x^0 = 1.',
    solutionSteps: ['Write P(x) = c * x^0', 'The exponent of x is 0', 'Hence degree is 0'],
    marks: 4,
    negativeMarks: 1,
    learningObjective: 'Understand degree of constant polynomials',
    sourceReference: 'NCERT Class 10 Mathematics Chapter 2',
    generationMethod: 'ai_validated',
  },
  {
    questionId: 'q_math_poly_02',
    conceptId: 'math_polynomials',
    subject: 'Mathematics',
    topic: 'Polynomials',
    questionType: 'mcq',
    difficulty: 'medium',
    questionText: 'If alpha and beta are the zeros of x^2 - 5x + 6, find (alpha + beta).',
    options: ['5', '-5', '6', '-6'],
    correctAnswer: '5',
    explanation: 'For ax^2 + bx + c, sum of zeros = -b/a. Here a=1, b=-5, so sum = -(-5)/1 = 5.',
    solutionSteps: ['Identify a=1, b=-5, c=6', 'Apply formula: alpha + beta = -b/a', 'Calculate: -(-5)/1 = 5'],
    marks: 4,
    negativeMarks: 1,
    learningObjective: 'Apply Vieta formulas to quadratic polynomials',
    sourceReference: 'NCERT Class 10 Mathematics Chapter 2',
    generationMethod: 'ai_validated',
  },
  {
    questionId: 'q_math_poly_03',
    conceptId: 'math_polynomials',
    subject: 'Mathematics',
    topic: 'Polynomials',
    questionType: 'mcq',
    difficulty: 'hard',
    questionText: 'Find a quadratic polynomial whose zeros are 3 + sqrt(2) and 3 - sqrt(2).',
    options: ['x^2 - 6x + 7', 'x^2 + 6x + 7', 'x^2 - 6x - 7', 'x^2 + 6x - 7'],
    correctAnswer: 'x^2 - 6x + 7',
    explanation: 'Sum = (3+sqrt2)+(3-sqrt2) = 6. Product = (3+sqrt2)(3-sqrt2) = 9-2 = 7. Polynomial: x^2 - Sx + P = x^2 - 6x + 7.',
    solutionSteps: ['Sum of zeros = 6', 'Product of zeros = 7', 'Form polynomial x^2 - (Sum)x + Product'],
    marks: 5,
    negativeMarks: 1,
    learningObjective: 'Form quadratic polynomial given irrational roots',
    sourceReference: 'NCERT Class 10 Mathematics Chapter 2',
    generationMethod: 'ai_validated',
  },
  {
    questionId: 'q_sci_light_01',
    conceptId: 'sci_light_reflection',
    subject: 'Science',
    topic: 'Light - Reflection and Refraction',
    questionType: 'mcq',
    difficulty: 'easy',
    questionText: 'What is the focal length of a plane mirror?',
    options: ['Infinity', 'Zero', '25 cm', '10 cm'],
    correctAnswer: 'Infinity',
    explanation: 'A plane mirror has a flat reflecting surface, so its radius of curvature R is infinite, making f = R/2 = infinity.',
    solutionSteps: ['Plane mirror surface is flat', 'Radius of curvature R = ∞', 'Focal length f = ∞'],
    marks: 4,
    negativeMarks: 1,
    learningObjective: 'State optical properties of plane mirrors',
    sourceReference: 'NCERT Class 10 Science Chapter 10',
    generationMethod: 'ai_validated',
  },
  {
    questionId: 'q_sci_light_02',
    conceptId: 'sci_light_reflection',
    subject: 'Science',
    topic: 'Light - Reflection and Refraction',
    questionType: 'mcq',
    difficulty: 'medium',
    questionText: 'An object is placed at 2f of a convex lens. Where is the image formed?',
    options: ['At 2F on the other side', 'At F', 'Between F and 2F', 'At Infinity'],
    correctAnswer: 'At 2F on the other side',
    explanation: 'When an object is placed at 2F1 of a convex lens, a real, inverted image of the same size is formed at 2F2.',
    solutionSteps: ['Object position = 2F1', 'Lens formula 1/f = 1/v - 1/u', 'v = +2f, same size real image'],
    marks: 4,
    negativeMarks: 1,
    learningObjective: 'Predict image position for convex lens ray diagrams',
    sourceReference: 'NCERT Class 10 Science Chapter 10',
    generationMethod: 'ai_validated',
  },
  {
    questionId: 'q_sci_light_03',
    conceptId: 'sci_light_reflection',
    subject: 'Science',
    topic: 'Light - Reflection and Refraction',
    questionType: 'short_answer',
    difficulty: 'medium',
    questionText: 'Define refractive index of a medium in terms of speed of light.',
    options: [],
    correctAnswer: 'Refractive index is the ratio of speed of light in vacuum (c) to speed of light in the medium (v).',
    explanation: 'n = c / v. It is a dimensionless ratio.',
    solutionSteps: ['Formula: n = c / v', 'c = 3x10^8 m/s', 'n measures optical density'],
    marks: 4,
    negativeMarks: 0,
    learningObjective: 'Define refractive index mathematically',
    sourceReference: 'NCERT Class 10 Science Chapter 10',
    generationMethod: 'ai_validated',
  },
];

export class QuestionGenerator {
  static async generateQuestionDraft(context: QuestionGenerationContext): Promise<QuestionCandidate> {
    // 1. Search verified bank first
    const match = VERIFIED_ASSESSMENT_QUESTION_BANK.find(
      (q) =>
        (q.conceptId === context.conceptId || q.topic.toLowerCase().includes(context.topic.toLowerCase())) &&
        q.difficulty === context.difficulty &&
        q.questionType === context.questionType
    );

    if (match) {
      return {
        ...match,
        questionId: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        generationMethod: 'ai_validated',
      };
    }

    // 2. Deterministic Fallback Draft Template
    const topicTitle = context.topic || 'Concept Mastery';
    const draft: QuestionCandidate = {
      questionId: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      conceptId: context.conceptId || 'general_concept',
      subject: context.subject || 'General',
      topic: topicTitle,
      questionType: context.questionType || 'mcq',
      difficulty: context.difficulty || 'medium',
      questionText: `Which statement accurately describes fundamental principles of ${topicTitle}?`,
      options: [
        `Core principle A of ${topicTitle}`,
        `Secondary principle B of ${topicTitle}`,
        `Alternative interpretation C of ${topicTitle}`,
        `Incorrect assumption D of ${topicTitle}`,
      ],
      correctAnswer: `Core principle A of ${topicTitle}`,
      explanation: `Option A correctly states the fundamental concept of ${topicTitle} according to NCERT curriculum guidelines.`,
      solutionSteps: [`Identify the concept ${topicTitle}`, `Review core properties`, `Select Option A`],
      marks: context.difficulty === 'hard' ? 5 : 4,
      negativeMarks: 1,
      learningObjective: context.learningObjective || `Master key principles of ${topicTitle}`,
      sourceReference: `NCERT Class ${context.classLevel || 10} ${context.subject || 'Subject'}`,
      generationMethod: 'template',
    };

    return draft;
  }

  static async generateAndValidateQuestion(
    context: QuestionGenerationContext,
    existingTextList: string[] = []
  ): Promise<ValidatedQuestion> {
    const draft = await this.generateQuestionDraft(context);
    return QuestionValidator.validate(draft, existingTextList);
  }
}
