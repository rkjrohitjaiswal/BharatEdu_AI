import { AnalyticsAdviceData, ProgressTrendType } from './types.js';

export async function generateAILearningAnalyticsAdvice(
  studentName: string,
  overallMastery: number,
  overallTrend: ProgressTrendType,
  accuracy: number,
  streakDays: number,
  topWin?: string,
  topAttentionArea?: string
): Promise<AnalyticsAdviceData> {
  const key = process.env.AI_API_KEY;

  const defaultSummary = `${studentName} has reached an overall topic mastery of ${overallMastery}% with a ${overallTrend} learning trend and ${accuracy}% practice accuracy.`;
  const defaultTrendExplanation = `Your learning momentum is ${overallTrend}. Consistent daily practice has helped maintain a ${streakDays}-day activity streak.`;
  const defaultFeedback = topWin || `Great job staying active! Keep up the momentum to further strengthen your mastery.`;
  const defaultStrategy = `Focus on 15 minutes of adaptive practice daily on topics flagged for attention, starting with ${topAttentionArea || 'core concepts'}.`;
  const defaultPrioritization = `Topics with active learning gaps or lower mastery scores are prioritized to maximize your learning efficiency.`;

  if (!key) {
    return {
      naturalLanguageSummary: defaultSummary,
      trendExplanation: defaultTrendExplanation,
      encouragingFeedback: defaultFeedback,
      studyStrategy: defaultStrategy,
      prioritizationReason: defaultPrioritization,
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
              'You are a supportive learning analytics assistant. Explain supplied student analytics facts clearly. Never invent metrics, change scores, alter trends, create fake historical values, or claim gaps are resolved without supplied evidence.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              studentName,
              overallMastery,
              overallTrend,
              accuracy,
              streakDays,
              topWin,
              topAttentionArea,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error('Empty AI response');

    const safeText = sanitizeAnalyticsText(text);

    return {
      naturalLanguageSummary: safeText,
      trendExplanation: defaultTrendExplanation,
      encouragingFeedback: defaultFeedback,
      studyStrategy: defaultStrategy,
      prioritizationReason: defaultPrioritization,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      naturalLanguageSummary: defaultSummary,
      trendExplanation: defaultTrendExplanation,
      encouragingFeedback: defaultFeedback,
      studyStrategy: defaultStrategy,
      prioritizationReason: defaultPrioritization,
      aiGenerated: false,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

function sanitizeAnalyticsText(text: string): string {
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
