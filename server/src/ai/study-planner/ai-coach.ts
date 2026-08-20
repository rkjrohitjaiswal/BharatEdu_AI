import { IPlannerAdviceData } from './types.js';

export async function generateAIStudyPlannerAdvice(
  studentName: string,
  availableMinutes: number,
  plannedMinutes: number,
  topPriority: string,
  riskLevel: string,
  gapsCount: number
): Promise<IPlannerAdviceData> {
  const key = process.env.AI_API_KEY;

  const defaultSelectionReason = `Today's tasks were selected to focus on ${topPriority} based on your learning gaps (${gapsCount} active) and risk indicator (${riskLevel}).`;
  const defaultEncouragement = `You have ${plannedMinutes} minutes planned out of ${availableMinutes} available minutes. Taking small, consistent steps each day leads to big breakthroughs!`;
  const defaultSummaryMessage = `Your daily plan is optimized for your target goals and time budget.`;
  const defaultStrategies = [
    'Take a 5-minute break between practice sets.',
    'Start with a quick mistake review before attempting new adaptive practice questions.',
  ];

  if (!key) {
    return {
      selectionReason: defaultSelectionReason,
      encouragement: defaultEncouragement,
      summaryMessage: defaultSummaryMessage,
      studyStrategies: defaultStrategies,
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
              'You are a supportive educational study planner companion. Explain why today\'s tasks were selected, provide encouragement, summarize the schedule, and suggest study strategies. Never invent metrics, modify time limits, change risk scores, or fabricate student activity.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              studentName,
              availableMinutes,
              plannedMinutes,
              topPriority,
              riskLevel,
              gapsCount,
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
      selectionReason: defaultSelectionReason,
      encouragement: safeText,
      summaryMessage: defaultSummaryMessage,
      studyStrategies: defaultStrategies,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      selectionReason: defaultSelectionReason,
      encouragement: defaultEncouragement,
      summaryMessage: defaultSummaryMessage,
      studyStrategies: defaultStrategies,
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
