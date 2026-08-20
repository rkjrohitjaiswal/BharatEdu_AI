import { IKnowledgeGraphAIAdviceData } from './types.js';

export async function generateAIKnowledgeGraphAdvice(
  studentName: string,
  rootGapName?: string,
  affectedCount: number = 0,
  healthScore: number = 75
): Promise<IKnowledgeGraphAIAdviceData> {
  const key = process.env.AI_API_KEY;

  const defaultExplanation = rootGapName
    ? `Hello ${studentName}! Your main learning blocker is ${rootGapName}. Strengthening this foundational skill will automatically unblock ${affectedCount} downstream concepts.`
    : `Hello ${studentName}! Your learning map is balanced (Health Score: ${healthScore}%). Keep building strong prerequisite foundations across Mathematics and Science.`;

  const defaultSequence = rootGapName
    ? [rootGapName, 'Practice Basic Applications', 'Review Connected Concepts']
    : ['Continue Daily Practice', 'Explore Advanced Concepts'];

  const defaultTeacherTip = rootGapName
    ? `Targeted 15-minute remediation on ${rootGapName} recommended before assigning advanced practice.`
    : `Student has solid concept readiness. Ready for higher-order problem solving.`;

  const defaultParentTip = rootGapName
    ? `Your child is strengthening a key foundational topic (${rootGapName}). Supporting this now makes later topics much easier.`
    : `Your child is maintaining strong progress across their learning map!`;

  if (!key) {
    return {
      explanation: defaultExplanation,
      recommendedSequence: defaultSequence,
      teacherTip: defaultTeacherTip,
      parentTip: defaultParentTip,
      aiGenerated: false,
      evaluatedAt: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert educational knowledge graph advisor. Explain concept relationships, prerequisite dependencies, root learning gaps, and learning pathways. Never invent prerequisites, alter mastery scores, modify readiness levels, override exam readiness, or fabricate curriculum standards.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              studentName,
              rootGapName,
              affectedCount,
              healthScore,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error('Empty AI response');

    const safeText = sanitizeText(text);

    return {
      explanation: safeText,
      recommendedSequence: defaultSequence,
      teacherTip: defaultTeacherTip,
      parentTip: defaultParentTip,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      explanation: defaultExplanation,
      recommendedSequence: defaultSequence,
      teacherTip: defaultTeacherTip,
      parentTip: defaultParentTip,
      aiGenerated: false,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

function sanitizeText(text: string): string {
  let safe = text;
  [
    'password',
    'JWT_SECRET',
    'AI_API_KEY',
    'correctAnswer',
    'token',
    'Bearer',
    'tutorConversationId',
    'privateTeacherNote',
  ].forEach((kw) => {
    const regex = new RegExp(kw, 'gi');
    safe = safe.replace(regex, '[REDACTED]');
  });
  return safe;
}
