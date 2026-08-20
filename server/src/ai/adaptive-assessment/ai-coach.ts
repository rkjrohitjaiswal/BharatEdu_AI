export async function generateAIAssessmentPostInsight(
  score: number,
  accuracy: number,
  subject: string,
  topicName: string
): Promise<{ explanation: string; recommendations: string[] }> {
  const key = process.env.AI_API_KEY;

  const defaultExplanation = `You completed your ${subject} (${topicName}) assessment with a score of ${score} (${accuracy}% accuracy).`;
  const defaultRecs = [
    'Review key formulas and step-by-step solutions for missed questions.',
    'Complete a 15-minute quick revision sheet on weak concepts.',
    'Practice 3 similar adaptive questions to solidify mastery.',
  ];

  if (!key) {
    return { explanation: defaultExplanation, recommendations: defaultRecs };
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
            content: 'You are an Educational Assessment Coach. Provide structured post-assessment performance analysis.',
          },
          {
            role: 'user',
            content: JSON.stringify({ score, accuracy, subject, topicName }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return { explanation: defaultExplanation, recommendations: defaultRecs };
    }

    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    return {
      explanation: text || defaultExplanation,
      recommendations: defaultRecs,
    };
  } catch (err) {
    return { explanation: defaultExplanation, recommendations: defaultRecs };
  }
}
