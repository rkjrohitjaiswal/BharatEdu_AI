import { ExplanationLanguage, ExplanationLevel } from './types.js';

export function personalizeDoubtExplanation(
  explanation: string,
  level: ExplanationLevel = 'standard',
  language: ExplanationLanguage = 'en'
): { personalizedExplanation: string; levelNote: string } {
  let personalized = explanation;

  if (level === 'beginner') {
    personalized = `[Beginner Level Breakdown]: Simple intuitive explanation — ${explanation} Remember: practice one step at a time!`;
  } else if (level === 'advanced') {
    personalized = `[Advanced Level Depth]: Formal rigorous derivation — ${explanation} Includes deep structural proof context.`;
  } else if (level === 'exam_focused') {
    personalized = `[Exam-Focused Marking Scheme]: Focus on step marks — ${explanation} Ensure steps 1 through 4 are clearly written to secure full marks.`;
  }

  if (language === 'hi') {
    personalized = `(हिंदी अनुवाद) ${personalized}`;
  } else if (language === 'gu') {
    personalized = `(ગુજરાતી અનુવાદ) ${personalized}`;
  }

  const levelNote = `Tailored for ${level.toUpperCase()} level in ${language.toUpperCase()} language.`;

  return { personalizedExplanation: personalized, levelNote };
}
