import { ParentMessageDraft, TeacherCopilotAdvice, TeacherCopilotStudentSnapshot } from './types.js';
import { evaluateDeterministicCopilotRecommendations } from './rules.js';

export async function generateAICopilotAdvice(
  snapshot: TeacherCopilotStudentSnapshot
): Promise<TeacherCopilotAdvice> {
  const deterministic = evaluateDeterministicCopilotRecommendations(snapshot);
  const key = process.env.AI_API_KEY;

  if (!key) {
    return {
      studentId: snapshot.studentId,
      studentName: snapshot.studentName,
      ...deterministic,
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
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert AI Teacher Copilot. Synthesize existing student learning metrics into concise, professional teacher advice. Do NOT calculate or alter numerical scores, risk levels, or mastery values.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              name: snapshot.studentName,
              mastery: snapshot.overallMastery,
              riskLevel: snapshot.riskLevel,
              gaps: snapshot.topLearningGaps,
              recommendations: deterministic.recommendedRemediationActions,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error('Empty AI response');

    return {
      studentId: snapshot.studentId,
      studentName: snapshot.studentName,
      recommendedIntervention: text,
      recommendedPracticeTopics: deterministic.recommendedPracticeTopics,
      recommendedRemediationActions: deterministic.recommendedRemediationActions,
      weeklyActionPlan: deterministic.weeklyActionPlan,
      aiGenerated: true,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      studentId: snapshot.studentId,
      studentName: snapshot.studentName,
      ...deterministic,
      aiGenerated: false,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export async function generateParentCommunicationDraft(
  snapshot: TeacherCopilotStudentSnapshot
): Promise<{
  subject: string;
  body: string;
  disclaimer: string;
  aiGenerated: boolean;
}> {
  const key = process.env.AI_API_KEY;
  const disclaimer = 'AI-generated draft — review before sending.';

  if (!key) {
    return {
      subject: `Weekly Learning Update: ${snapshot.studentName}`,
      body: fallbackParentMessage(snapshot),
      disclaimer,
      aiGenerated: false,
    };
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
            content:
              'You are an encouraging teacher writing a weekly learning update to a parent. Be supportive and professional. Mention positive progress, areas needing attention, and recommended support. Do NOT include passwords, tokens, answer keys, or internal IDs.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              studentName: snapshot.studentName,
              mastery: snapshot.overallMastery,
              riskLevel: snapshot.riskLevel,
              strengths: snapshot.strengths,
              attentionAreas: snapshot.areasRequiringAttention,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error('Empty AI response');

    // Safety sanitization: remove any sensitive tokens/keys if present
    const safeText = sanitizeMessage(text);

    return {
      subject: `Weekly Learning Update: ${snapshot.studentName}`,
      body: safeText,
      disclaimer,
      aiGenerated: true,
    };
  } catch (err) {
    return {
      subject: `Weekly Learning Update: ${snapshot.studentName}`,
      body: fallbackParentMessage(snapshot),
      disclaimer,
      aiGenerated: false,
    };
  }
}

function fallbackParentMessage(snapshot: TeacherCopilotStudentSnapshot): string {
  const strengthStr = snapshot.strengths.length
    ? snapshot.strengths.join(', ')
    : 'consistent effort and engagement';
  const attentionStr = snapshot.areasRequiringAttention.length
    ? snapshot.areasRequiringAttention.join(', ')
    : 'reinforcing foundational topic practice';

  return `Dear Parent,\n\nHere is a quick learning update for ${snapshot.studentName}.\n\n` +
    `• Positive Progress: ${snapshot.studentName} has demonstrated strong work in ${strengthStr} with an overall mastery level of ${snapshot.overallMastery}%.\n` +
    `• Current Focus Area: We are currently giving extra attention to ${attentionStr}.\n` +
    `• Recommended Home Support: Encouraging 15–20 minutes of daily adaptive practice on BharatEdu AI will help build learning momentum.\n\n` +
    `Please feel free to reach out if you have any questions.\n\nWarm regards,\nTeacher`;
}

function sanitizeMessage(text: string): string {
  let safe = text;
  ['password', 'JWT_SECRET', 'AI_API_KEY', 'correctAnswer', 'token', 'Bearer'].forEach((kw) => {
    const regex = new RegExp(kw, 'gi');
    safe = safe.replace(regex, '[REDACTED]');
  });
  return safe;
}
