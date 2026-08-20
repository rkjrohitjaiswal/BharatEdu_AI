import { dataRepository } from '../../repositories/data.repository.js';
import { generateAIDoubtExplanation } from './ai-coach.js';
import { aggregateStudentDoubtContext } from './context.js';
import { classifyDoubtQuestion, getSocraticHintForLevel } from './rules.js';
import { IDoubtSolutionDTO, ISocraticHintDTO } from './types.js';

export async function solveStudentDoubtEngine(studentId: string, sessionId: string, questionText: string): Promise<IDoubtSolutionDTO> {
  const context = await aggregateStudentDoubtContext(studentId);
  const { category, subject, explanationLevel, difficulty } = classifyDoubtQuestion(questionText);

  const prerequisiteChain = context.prerequisiteConceptIds.length > 0
    ? context.prerequisiteConceptIds
    : ['Fundamental Algebra', 'Equations', 'Basic Principles'];

  const { summary, steps, followUpQuestions, sourceReferences, generatedBy } = await generateAIDoubtExplanation(
    questionText,
    category,
    explanationLevel,
    subject,
    context.topConceptName || 'Mathematics',
    prerequisiteChain
  );

  // Record Tutor Response Message
  await dataRepository.createDoubtMessage({
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    sessionId,
    studentId,
    role: 'tutor',
    content: `${summary}\n\n${steps.map((s) => `Step ${s.stepNumber}: ${s.title}\n${s.description}`).join('\n\n')}`,
    explanationLevel,
    referencedConceptIds: context.topConceptId ? [context.topConceptId] : [],
    sourceReferences,
    generatedBy,
  });

  return {
    sessionId,
    category,
    explanationLevel,
    summary,
    steps,
    prerequisiteChain,
    followUpQuestions,
    sourceReferences,
    generatedBy,
  };
}

export async function getSocraticHintEngine(sessionId: string, hintLevel: number, questionText: string): Promise<ISocraticHintDTO> {
  const { guidingQuestion, hintContent, nextStepPrompt } = getSocraticHintForLevel(hintLevel, questionText);

  return {
    sessionId,
    hintLevel: Math.min(Math.max(hintLevel, 0), 3),
    guidingQuestion,
    hintContent,
    nextStepPrompt,
  };
}
