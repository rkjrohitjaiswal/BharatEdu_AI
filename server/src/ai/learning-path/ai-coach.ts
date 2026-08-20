export async function generateAILearningPathAdvice(
  studentName: string,
  currentStageTitle?: string,
  nextConceptName?: string,
  reason?: string
): Promise<string> {
  const key = process.env.AI_API_KEY;

  const defaultAdvice = nextConceptName
    ? `Welcome ${studentName}! You are currently on "${currentStageTitle || 'Stage 1'}". Your next key concept is "${nextConceptName}". ${reason || 'Mastering this will unblock downstream curriculum topics.'}`
    : `Welcome ${studentName}! Your personalized curriculum path is optimized based on your Knowledge Graph and learning goals.`;

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
              'You are an expert AI Learning Path Advisor. Provide a concise 2-sentence encouraging guidance explaining why the recommended concept sequence is optimal for the student. Never alter mastery, progress, priority, or dates.',
          },
          {
            role: 'user',
            content: JSON.stringify({ studentName, currentStageTitle, nextConceptName, reason }),
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
