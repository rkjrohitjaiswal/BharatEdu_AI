import { buildCareerRoadmap } from './engine.js';

export async function generateCareerAdvice(studentId: string, goalId: string) {
  const roadmap = await buildCareerRoadmap(studentId, goalId);
  const key = process.env.AI_API_KEY;
  if (!key) return { aiEnhanced: false, advice: fallbackAdvice(roadmap), roadmap };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          { role: 'system', content: 'You are a concise educational career coach. Do not change scores. Explain priorities using only the supplied roadmap data. Never invent credentials, jobs, salaries, or prerequisites.' },
          { role: 'user', content: JSON.stringify({ role: roadmap.career.title, readiness: roadmap.readiness, skills: roadmap.skills.map(s => ({ name: s.name, score: s.score, priority: s.priority })), stages: roadmap.stages.slice(0, 5) }) },
        ],
      }),
    });
    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const advice = json?.choices?.[0]?.message?.content?.trim();
    if (!advice) throw new Error('Empty AI response');
    return { aiEnhanced: true, advice, roadmap };
  } catch {
    return { aiEnhanced: false, advice: fallbackAdvice(roadmap), roadmap };
  }
}

function fallbackAdvice(roadmap: any) {
  const first = roadmap.stages[0];
  if (!first) return 'You have strong coverage across the current career skill map. Keep practicing and build portfolio projects to maintain readiness.';
  return `Your highest-priority skill is ${first.skill}. Focus on reaching 80% mastery through targeted practice, then complete the suggested project: ${first.project}. Your current career readiness is ${roadmap.readiness}%.`;
}
