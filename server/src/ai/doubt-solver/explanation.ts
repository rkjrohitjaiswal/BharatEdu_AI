import { IDoubtResponseStep } from '../../models/doubt-response.model.js';
import { DoubtIntentCategory } from './types.js';

export function generateStepByStepExplanation(
  question: string,
  intent: DoubtIntentCategory,
  subject: string,
  topicId: string,
  conceptId?: string
): {
  answer: string;
  explanation: string;
  steps: IDoubtResponseStep[];
  keyConcepts: string[];
  prerequisiteConcepts: string[];
  examples: string[];
  commonMistakes: string[];
} {
  const normQ = question.trim();

  const keyConcepts = [topicId, conceptId || `${subject.toLowerCase()}_basics`].filter(Boolean) as string[];
  const prerequisiteConcepts = subject === 'Mathematics' ? ['math_algebra_basics'] : ['basic_terminology'];

  const steps: IDoubtResponseStep[] = [
    {
      stepNumber: 1,
      title: 'Identify Given Information',
      description: `Understand what is asked in: "${normQ}". Extract known variables and target requirements.`,
    },
    {
      stepNumber: 2,
      title: 'Apply Relevant Standard Formula / Rule',
      description: `Use the core ${subject} principle for ${topicId}. Set up the equation or logical structure.`,
      formula: subject === 'Mathematics' ? 'ax + b = c' : 'F = m * a',
    },
    {
      stepNumber: 3,
      title: 'Execute Step-by-Step Solution',
      description: 'Substitute known values and simplify carefully to obtain the resultant value.',
    },
    {
      stepNumber: 4,
      title: 'Verification & Final Check',
      description: 'Plug the computed result back into the original statement to confirm correctness.',
    },
  ];

  const answer = `To solve "${normQ}", apply standard ${topicId} principles. Follow the 4-step breakdown below for full accuracy.`;

  const explanation = `Here is the comprehensive step-by-step breakdown for ${topicId}. First, analyze the target concept. Second, apply standard formulas while checking for sign errors or unit mismatches.`;

  const examples = [
    `Example 1: Similar standard problem on ${topicId} solved with identical substitution.`,
    `Example 2: Common board exam question variation for ${subject}.`,
  ];

  const commonMistakes = [
    'Forgetting sign changes when moving terms across the equals sign.',
    'Confusing prerequisite terminology or unit conversions.',
  ];

  return { answer, explanation, steps, keyConcepts, prerequisiteConcepts, examples, commonMistakes };
}
