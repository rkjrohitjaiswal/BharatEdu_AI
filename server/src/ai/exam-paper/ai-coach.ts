export async function generateAIExamPostInsight(
  netMarks: number,
  totalMarks: number,
  accuracy: number,
  subject: string,
  title: string
): Promise<string> {
  const key = process.env.AI_API_KEY;

  const defaultInsight = `You scored ${netMarks} / ${totalMarks} (${accuracy}% accuracy) on "${title}". Focus on strengthening core formulas and reviewing missed multi-step questions.`;

  if (!key) return defaultInsight;

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
            content: 'You are an Educational Exam Coach. Provide a concise, motivating performance analysis.',
          },
          {
            role: 'user',
            content: JSON.stringify({ netMarks, totalMarks, accuracy, subject, title }),
          },
        ],
      }),
    });

    if (!response.ok) return defaultInsight;

    const json: any = await response.json();
    return json?.choices?.[0]?.message?.content?.trim() || defaultInsight;
  } catch (err) {
    return defaultInsight;
  }
}
