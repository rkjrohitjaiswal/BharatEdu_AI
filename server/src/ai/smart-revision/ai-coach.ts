export async function generateAIRevisionAdvice(
  studentName: string,
  totalDue: number,
  criticalCount: number,
  topConcept?: string
): Promise<string> {
  const key = process.env.AI_API_KEY;

  const defaultAdvice = criticalCount > 0
    ? `Hello ${studentName}! You have ${criticalCount} critical revision items due today, starting with "${topConcept || 'Prerequisite Concepts'}". Tackle these first to solidify your foundation.`
    : `Hello ${studentName}! You have ${totalDue} study items due for spaced revision. Consistent 10-minute daily review improves 30-day retention by over 80%!`;

  if (!key) return defaultAdvice;

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
              'You are an encouraging AI Revision Coach. Provide a concise 2-sentence motivational study tip for the student based on their due revision items. Never alter priority, dates, or scores.',
          },
          {
            role: 'user',
            content: JSON.stringify({ studentName, totalDue, criticalCount, topConcept }),
          },
        ],
      }),
    });

    if (!response.ok) return defaultAdvice;
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    return text || defaultAdvice;
  } catch (err) {
    return defaultAdvice;
  }
}
