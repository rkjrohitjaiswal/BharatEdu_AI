export async function generateAIResourceExplanation(
  studentName: string,
  topResourceTitle?: string,
  reason?: string
): Promise<string> {
  const key = process.env.AI_API_KEY;

  const defaultMsg = topResourceTitle
    ? `Hello ${studentName}! Based on your learning graph, studying "${topResourceTitle}" is your highest priority right now. ${reason}`
    : `Hello ${studentName}! Explore curated resources aligned with your study goals and prerequisite learning map.`;

  if (!key) return defaultMsg;

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
              'You are an expert educational resource advisor. Provide a concise, encouraging 2-sentence explanation of why the recommended study resource is crucial for the student. Never invent resources, alter priority scores, or leak secrets.',
          },
          {
            role: 'user',
            content: JSON.stringify({ studentName, topResourceTitle, reason }),
          },
        ],
      }),
    });

    if (!response.ok) return defaultMsg;
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    return text || defaultMsg;
  } catch (err) {
    return defaultMsg;
  }
}
