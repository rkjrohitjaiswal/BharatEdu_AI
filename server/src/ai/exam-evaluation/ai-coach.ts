export async function generateAIEvaluationInsight(
  earnedMarks: number,
  totalMarks: number,
  accuracy: number,
  overallLevel: string
): Promise<string> {
  const key = process.env.AI_API_KEY;

  const defaultInsight = `Evaluation Summary: Earned ${earnedMarks}/${totalMarks} marks (${accuracy}% accuracy). Overall Level: ${overallLevel.toUpperCase()}. Focus on revising key prerequisite formulas to eliminate calculation errors.`;

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
            content: 'You are an Educational Evaluation Coach. Provide concise, constructive answer analysis feedback.',
          },
          {
            role: 'user',
            content: JSON.stringify({ earnedMarks, totalMarks, accuracy, overallLevel }),
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
