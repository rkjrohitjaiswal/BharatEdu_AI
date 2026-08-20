import { DoubtDifficulty } from '../../models/doubt-session.model.js';
import { ExplanationLevel } from '../../models/doubt-message.model.js';
import { DoubtCategory } from './types.js';

export function classifyDoubtQuestion(questionText: string): {
  category: DoubtCategory;
  subject: string;
  explanationLevel: ExplanationLevel;
  difficulty: DoubtDifficulty;
} {
  const q = questionText.toLowerCase();

  let category: DoubtCategory = 'general_academic';
  let subject = 'Mathematics';
  let explanationLevel: ExplanationLevel = 'standard';
  let difficulty: DoubtDifficulty = 'intermediate';

  if (q.includes('code') || q.includes('python') || q.includes('function') || q.includes('java') || q.includes('algorithm')) {
    category = 'coding_question';
    subject = 'Computer Science';
    explanationLevel = 'coding';
  } else if (q.includes('exam') || q.includes('cbse') || q.includes('marks') || q.includes('board question')) {
    category = 'exam_question';
    explanationLevel = 'exam';
  } else if (q.includes('formula') || q.includes('equation') || q.includes('identity')) {
    category = 'formula_question';
  } else if (q.includes('calculate') || q.includes('solve') || q.includes('find x') || q.includes('value of')) {
    category = 'calculation';
  } else if (q.includes('mistake') || q.includes('wrong') || q.includes('error') || q.includes('why did i fail')) {
    category = 'mistake_analysis';
    explanationLevel = 'detailed';
  } else if (q.includes('career') || q.includes('job') || q.includes('engineer') || q.includes('future')) {
    category = 'career_application';
    subject = 'Career & Applied Tech';
  } else if (q.includes('prerequisite') || q.includes('basics') || q.includes('foundation') || q.includes('why does')) {
    category = 'prerequisite_gap';
    explanationLevel = 'simple';
    difficulty = 'beginner';
  } else if (q.includes('example') || q.includes('sample problem')) {
    category = 'worked_example';
  } else if (q.includes('revise') || q.includes('revision') || q.includes('remember')) {
    category = 'revision_question';
  } else if (q.includes('resource') || q.includes('book') || q.includes('video')) {
    category = 'resource_request';
  } else if (q.includes('what is') || q.includes('explain') || q.includes('define') || q.includes('concept')) {
    category = 'concept_explanation';
  }

  if (q.includes('science') || q.includes('physics') || q.includes('chemistry') || q.includes('biology')) {
    subject = 'Science';
  }

  return {
    category,
    subject,
    explanationLevel,
    difficulty,
  };
}

export function getSocraticHintForLevel(hintLevel: number, question: string): {
  guidingQuestion: string;
  hintContent: string;
  nextStepPrompt: string;
} {
  const level = Math.min(Math.max(hintLevel, 0), 3);

  switch (level) {
    case 0:
      return {
        guidingQuestion: 'What are the main variables and conditions given in the problem?',
        hintContent: 'Identify what is given and what you need to calculate first.',
        nextStepPrompt: 'Can you state the given values and equations?',
      };
    case 1:
      return {
        guidingQuestion: 'Which fundamental formula or theorem relates these given quantities?',
        hintContent: 'Recall standard algebraic identities or formulas for this topic.',
        nextStepPrompt: 'Substitute the given values into the formula.',
      };
    case 2:
      return {
        guidingQuestion: 'What algebraic simplification or step should you perform next?',
        hintContent: 'Perform substitution or elimination step-by-step.',
        nextStepPrompt: 'Solve for the target unknown variable.',
      };
    default:
      return {
        guidingQuestion: 'How can you verify your final result against given constraints?',
        hintContent: 'Plug your answer back into the original equation to check correctness.',
        nextStepPrompt: 'Ready to see the complete step-by-step solution?',
      };
  }
}
