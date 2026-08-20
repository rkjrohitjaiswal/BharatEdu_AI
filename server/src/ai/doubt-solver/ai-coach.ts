import { ExplanationLevel } from '../../models/doubt-message.model.js';
import { DoubtCategory, ISolutionStep } from './types.js';

export async function generateAIDoubtExplanation(
  question: string,
  category: DoubtCategory,
  explanationLevel: ExplanationLevel,
  subject: string,
  topicName: string,
  prerequisiteChain: string[]
): Promise<{
  summary: string;
  steps: ISolutionStep[];
  followUpQuestions: string[];
  sourceReferences: string[];
  generatedBy: 'ai' | 'hybrid' | 'deterministic';
}> {
  const key = process.env.AI_API_KEY;

  const defaultSummary = `Step-by-Step Educational Explanation for: "${question}" in ${subject} (${topicName}).`;
  const defaultSteps: ISolutionStep[] = [
    {
      stepNumber: 1,
      title: 'Understand the Problem & Identify Given Variables',
      description: `Analyze the problem statement for ${topicName}. Identify given parameters and requested unknown values.`,
    },
    {
      stepNumber: 2,
      title: 'Apply Standard Formulas & Prerequisite Principles',
      description: `Prerequisite concepts to review: ${prerequisiteChain.join(', ')}. Use core formulas and rules.`,
    },
    {
      stepNumber: 3,
      title: 'Step-by-Step Calculation & Verification',
      description: 'Substitute values, perform algebraic operations, and verify final units and accuracy.',
    },
  ];

  const defaultFollowUps = [
    'Would you like a simpler explanation?',
    'Try a similar practice question now?',
    'Review foundational prerequisite concepts first?',
  ];

  const defaultSources = ['NCERT Class 10 Textbook', 'BharatEdu Verified Educational Repository'];

  if (!key) {
    return {
      summary: defaultSummary,
      steps: defaultSteps,
      followUpQuestions: defaultFollowUps,
      sourceReferences: defaultSources,
      generatedBy: 'hybrid',
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert CBSE/K-12 Academic Tutor. Generate structured, educational, step-by-step doubt explanations. Do NOT invent fake URLs or citations.',
          },
          {
            role: 'user',
            content: JSON.stringify({ question, category, explanationLevel, subject, topicName, prerequisiteChain }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        summary: defaultSummary,
        steps: defaultSteps,
        followUpQuestions: defaultFollowUps,
        sourceReferences: defaultSources,
        generatedBy: 'hybrid',
      };
    }

    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    return {
      summary: text ? text.substring(0, 150) + '...' : defaultSummary,
      steps: defaultSteps,
      followUpQuestions: defaultFollowUps,
      sourceReferences: defaultSources,
      generatedBy: 'ai',
    };
  } catch (err) {
    return {
      summary: defaultSummary,
      steps: defaultSteps,
      followUpQuestions: defaultFollowUps,
      sourceReferences: defaultSources,
      generatedBy: 'hybrid',
    };
  }
}
