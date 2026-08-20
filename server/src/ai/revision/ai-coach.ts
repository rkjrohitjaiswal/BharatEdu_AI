import { IRevisionAdviceData } from './types.js';

export async function generateAIRevisionAdvice(
  studentName: string,
  totalDue: number,
  topPriorityTopic: string,
  overdueCount: number,
  averageRetention: number
): Promise<IRevisionAdviceData> {
  const key = process.env.AI_API_KEY;

  const defaultDueReasoning = `You have ${totalDue} revision topics due today (including ${overdueCount} overdue). Top priority is ${topPriorityTopic} to prevent memory decay.`;
  const defaultStrategy = `Use 15-minute focused flashcard or practice sessions. Reviewing concepts right before memory drops reinforces long-term retention.`;
  const defaultEncouragement = `Consistent daily reviews keep your average retention (${averageRetention}%) high and make exam prep stress-free!`;

  if (!key) {
    return {
      dueReasoning: defaultDueReasoning,
      revisionStrategy: defaultStrategy,
      encouragement: defaultEncouragement,
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
              'You are a supportive educational revision advisor specializing in spaced repetition. Explain why revision topics are due, suggest revision strategies, summarize progress, and explain spaced repetition simply. Never invent retention scores, alter priority levels, modify next review dates, override exam readiness, or fabricate student activity.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              studentName,
              totalDue,
              topPriorityTopic,
              overdueCount,
              averageRetention,
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
      dueReasoning: defaultDueReasoning,
      revisionStrategy: safeText,
      encouragement: defaultEncouragement,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      dueReasoning: defaultDueReasoning,
      revisionStrategy: defaultStrategy,
      encouragement: defaultEncouragement,
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
