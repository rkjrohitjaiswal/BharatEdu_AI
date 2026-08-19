import { ParentCopilotAdvice, ParentCopilotStudentSnapshot } from './types.js';
import { evaluateDeterministicParentRecommendations } from './rules.js';

export async function generateAIParentCopilotAdvice(
  snapshot: ParentCopilotStudentSnapshot
): Promise<ParentCopilotAdvice> {
  const deterministic = evaluateDeterministicParentRecommendations(snapshot);
  const key = process.env.AI_API_KEY;

  if (!key) {
    return {
      studentId: snapshot.studentId,
      studentName: snapshot.studentName,
      ...deterministic,
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
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are a supportive, warm family education guide. Provide supportive 2-sentence parent advice. Use non-alarming, encouraging language. Do NOT calculate or alter numerical scores, risk levels, or mastery values. Do NOT include passwords, tokens, answer keys, or private teacher/tutor notes.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              name: snapshot.studentName,
              mastery: snapshot.overallMastery,
              riskLevel: snapshot.riskLevel,
              strengths: snapshot.strengths,
              areasRequiringAttention: snapshot.areasRequiringAttention,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error('Empty AI response');

    const safeText = sanitizeParentText(text);

    return {
      studentId: snapshot.studentId,
      studentName: snapshot.studentName,
      parentFriendlyExplanation: safeText,
      recommendedHomeSupportActions: deterministic.recommendedHomeSupportActions,
      weeklySupportPlan: deterministic.weeklySupportPlan,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      studentId: snapshot.studentId,
      studentName: snapshot.studentName,
      ...deterministic,
      aiGenerated: false,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

function sanitizeParentText(text: string): string {
  let safe = text;
  [
    'password',
    'JWT_SECRET',
    'AI_API_KEY',
    'correctAnswer',
    'token',
    'Bearer',
    'tutorConversationId',
    'failing',
    'dumb',
  ].forEach((kw) => {
    const regex = new RegExp(kw, 'gi');
    safe = safe.replace(regex, '[REDACTED]');
  });
  return safe;
}
