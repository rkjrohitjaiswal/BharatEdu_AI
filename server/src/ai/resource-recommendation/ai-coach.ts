export async function generateAIResourceExplanation(
  studentName: string,
  resourceTitle: string,
  provider: string,
  reason: string
): Promise<string> {
  const key = process.env.AI_API_KEY;

  const defaultExplanation = `Hello ${studentName}! We recommend "${resourceTitle}" from ${provider}. ${reason}`;

  if (!key) return defaultExplanation;

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
              'You are an expert Educational Resource Coach. Provide a concise 2-sentence explanation of how to study the recommended educational resource. Do NOT alter URLs or relevance scores.',
          },
          {
            role: 'user',
            content: JSON.stringify({ studentName, resourceTitle, provider, reason }),
          },
        ],
      }),
    });

    if (!response.ok) return defaultExplanation;
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    return text || defaultExplanation;
  } catch (err) {
    return defaultExplanation;
  }
}
