export async function generateAIDoubtExplanation(
  question: string,
  subject: string,
  topicId: string
): Promise<string> {
  const key = process.env.AI_API_KEY;

  const defaultExp = `To answer "${question}" in ${subject} (${topicId}): Break the problem into standard given variables, apply the core principle, and perform step-by-step simplification.`;

  if (!key) return defaultExp;

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
            content: 'You are an Educational Doubt Solver Coach. Provide concise, step-by-step academic explanations without fabricating facts or citations.',
          },
          { role: 'user', content: `Question: ${question} | Subject: ${subject} | Topic: ${topicId}` },
        ],
      }),
    });

    if (!response.ok) return defaultExp;

    const json: any = await response.json();
    return json?.choices?.[0]?.message?.content?.trim() || defaultExp;
  } catch (err) {
    return defaultExp;
  }
}
