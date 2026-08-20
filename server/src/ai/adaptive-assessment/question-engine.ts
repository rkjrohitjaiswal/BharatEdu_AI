import { AssessmentDifficulty } from '../../models/adaptive-assessment.model.js';
import { QuestionType } from '../../models/adaptive-assessment-question.model.js';
import { validateQuestionQuality } from './rules.js';

export interface IGeneratedQuestionData {
  question: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
  timeLimitSeconds: number;
  questionType: QuestionType;
  difficulty: AssessmentDifficulty;
  sourceType: string;
  generatedBy: 'catalog' | 'deterministic' | 'ai' | 'hybrid';
}

export function getFallbackQuestionForConcept(
  subject: string,
  topicId: string,
  conceptId: string,
  difficulty: AssessmentDifficulty,
  sequence: number
): IGeneratedQuestionData {
  const isMath = subject.toLowerCase().includes('math') || topicId.toLowerCase().includes('alg');

  if (sequence % 2 === 1) {
    const q = isMath
      ? `Solve for x in the equation 2x + 4 = 10.`
      : `Which cellular organelle is known as the powerhouse of the cell?`;
    const options = isMath ? ['x = 2', 'x = 3', 'x = 4', 'x = 5'] : ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Body'];
    const correctAnswer = isMath ? 'x = 3' : 'Mitochondria';

    return {
      question: q,
      options,
      correctAnswer,
      marks: 1,
      timeLimitSeconds: 90,
      questionType: 'mcq',
      difficulty,
      sourceType: 'BharatEdu Catalog',
      generatedBy: 'deterministic',
    };
  } else {
    const q = isMath
      ? `If a pair of linear equations has unique solutions, their lines intersect at exactly how many points?`
      : `True or False: Electric current is measured in Amperes (A).`;
    const options = isMath ? ['0', '1', 'Infinitely many', '2'] : ['True', 'False'];
    const correctAnswer = isMath ? '1' : 'True';

    return {
      question: q,
      options,
      correctAnswer,
      marks: 1,
      timeLimitSeconds: 60,
      questionType: isMath ? 'mcq' : 'true_false',
      difficulty,
      sourceType: 'BharatEdu Catalog',
      generatedBy: 'deterministic',
    };
  }
}
