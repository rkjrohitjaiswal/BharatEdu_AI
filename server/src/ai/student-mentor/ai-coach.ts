import { StudentMentorAdvice, StudentMentorSnapshot } from './types.js';

export async function generateAIStudentMentorAdvice(
  snapshot: StudentMentorSnapshot
): Promise<StudentMentorAdvice> {
  const key = process.env.AI_API_KEY;

  const name = snapshot.studentName || 'Student';
  const topGapName = snapshot.topLearningGaps[0]?.topicName;
  const weakSubj = snapshot.subjectMastery.find((s) => s.score < 50)?.subject;
  const topPriorityArea = topGapName || weakSubj || 'Daily Concept Practice';

  const defaultGreeting = `Good morning, ${name} 👋`;
  const defaultTopPriorityMessage = `Your biggest priority today is ${topPriorityArea} because strengthening foundational concepts will boost your overall confidence.`;
  const defaultEncouragingMessage = `You're making steady progress! Taking 15–20 minutes to complete today's focused tasks will help maintain your momentum.`;
  const defaultStudyStrategy = `Start with a 10-minute mistake review, followed by 15 minutes of adaptive practice.`;
  const defaultMotivationalGuidance = `Consistency is key. Every small step adds up to long-term success.`;

  if (!key) {
    return {
      greeting: defaultGreeting,
      topPriorityMessage: defaultTopPriorityMessage,
      encouragingMessage: defaultEncouragingMessage,
      studyStrategy: defaultStudyStrategy,
      motivationalGuidance: defaultMotivationalGuidance,
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
              'You are a supportive educational mentor. Never invent academic metrics, deadlines, scores, scholarships, achievements or recommendations. Use only supplied facts. Do not modify deterministic values.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              name,
              mastery: snapshot.overallMastery,
              riskLevel: snapshot.riskLevel,
              topGaps: snapshot.topLearningGaps,
              streak: snapshot.practiceHistory.streakDays,
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
      greeting: defaultGreeting,
      topPriorityMessage: defaultTopPriorityMessage,
      encouragingMessage: safeText,
      studyStrategy: defaultStudyStrategy,
      motivationalGuidance: defaultMotivationalGuidance,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      greeting: defaultGreeting,
      topPriorityMessage: defaultTopPriorityMessage,
      encouragingMessage: defaultEncouragingMessage,
      studyStrategy: defaultStudyStrategy,
      motivationalGuidance: defaultMotivationalGuidance,
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
