import { IResourceAdviceData } from './types.js';

export async function generateAIResourceAdvice(
  studentName: string,
  totalRecommended: number,
  topPriorityTopic: string,
  gapsCount: number,
  riskLevel: string
): Promise<IResourceAdviceData> {
  const key = process.env.AI_API_KEY;

  const defaultReasoning = `Selected ${totalRecommended} learning resources prioritizing ${topPriorityTopic} based on your active learning gaps (${gapsCount}) and current risk level (${riskLevel}).`;
  const defaultStrategy = `Start with short notes or videos (10–15 mins) before attempting targeted practice quizzes to reinforce weak concepts.`;
  const defaultTip = `Focus on one high-priority topic at a time to build long-term retention.`;

  if (!key) {
    return {
      recommendationReasoning: defaultReasoning,
      studyStrategy: defaultStrategy,
      personalizedTip: defaultTip,
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
              'You are a supportive educational resource advisor. Explain why these learning resources were selected based on student progress, suggest how to study them, and provide an encouraging learning strategy. Never invent metrics, modify relevance/trust scores, fabricate URLs, or expose private data.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              studentName,
              totalRecommended,
              topPriorityTopic,
              gapsCount,
              riskLevel,
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
      recommendationReasoning: defaultReasoning,
      studyStrategy: safeText,
      personalizedTip: defaultTip,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      recommendationReasoning: defaultReasoning,
      studyStrategy: defaultStrategy,
      personalizedTip: defaultTip,
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
