import { detectDoubtIntent } from './intent.js';

export function classifyDoubtQuestion(questionText: string) {
  const result = detectDoubtIntent(questionText);
  return {
    category: result.intent,
    subject: result.subject,
    explanationLevel: 'standard',
    difficulty: result.difficulty,
  };
}
