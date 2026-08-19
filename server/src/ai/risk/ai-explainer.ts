import { ParentSafeRiskSummaryData, StudentRiskProfileData, TeacherAtRiskAnalyticsData } from './types.js';

export async function generateStudentRiskExplanation(
  profile: Omit<StudentRiskProfileData, 'aiExplanation'>
): Promise<{ text: string; aiEnhanced: boolean }> {
  const key = process.env.AI_API_KEY;
  if (!key) {
    return { text: fallbackStudentExplanation(profile), aiEnhanced: false };
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
              'You are a supportive academic risk advisor. Provide a clear, constructive 2-3 sentence explanation of the student risk indicators and encouragement. Do NOT calculate or alter risk scores, risk levels, or trends.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              name: profile.studentName,
              score: profile.riskScore,
              level: profile.riskLevel,
              trend: profile.riskTrend,
              factors: profile.contributingFactors,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty AI response');

    return { text, aiEnhanced: true };
  } catch (err) {
    return { text: fallbackStudentExplanation(profile), aiEnhanced: false };
  }
}

export async function generateTeacherRiskClassSummary(
  data: Omit<TeacherAtRiskAnalyticsData, 'classSummary'>
): Promise<{ text: string; aiEnhanced: boolean }> {
  const key = process.env.AI_API_KEY;
  if (!key) {
    return { text: fallbackTeacherClassSummary(data), aiEnhanced: false };
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
              'You are an educational class management assistant. Provide a concise 2-sentence risk summary for the teacher based strictly on the at-risk student count and factors provided.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              totalStudents: data.totalStudents,
              atRiskCount: data.atRiskCount,
              criticalCount: data.criticalCount,
              highCount: data.highCount,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty AI response');

    return { text, aiEnhanced: true };
  } catch (err) {
    return { text: fallbackTeacherClassSummary(data), aiEnhanced: false };
  }
}

export async function generateParentRiskSummary(
  data: Omit<ParentSafeRiskSummaryData, 'summaryText'>
): Promise<{ text: string; aiEnhanced: boolean }> {
  const key = process.env.AI_API_KEY;
  if (!key) {
    return { text: fallbackParentRiskSummary(data), aiEnhanced: false };
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
              'You are a supportive family education guide. Provide a reassuring 2-sentence risk summary for a parent regarding their student.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              name: data.studentName,
              level: data.riskLevel,
              trend: data.riskTrend,
            }),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('AI request failed');
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty AI response');

    return { text, aiEnhanced: true };
  } catch (err) {
    return { text: fallbackParentRiskSummary(data), aiEnhanced: false };
  }
}

function fallbackStudentExplanation(profile: Omit<StudentRiskProfileData, 'aiExplanation'>): string {
  if (profile.riskLevel === 'critical' || profile.riskLevel === 'high') {
    return `Your risk level is currently ${profile.riskLevel} (${profile.riskScore}/100) due to low mastery and active learning gaps. Completing recommended recovery actions will help stabilize your progress.`;
  }
  if (profile.riskLevel === 'moderate') {
    return `Your risk level is moderate (${profile.riskScore}/100). Focus on reviewing past mistakes and adhering to your daily study plan to move into low risk.`;
  }
  return `Excellent academic stability! Your risk level is low (${profile.riskScore}/100) with positive progress momentum.`;
}

function fallbackTeacherClassSummary(data: Omit<TeacherAtRiskAnalyticsData, 'classSummary'>): string {
  return `${data.atRiskCount} out of ${data.totalStudents} student(s) currently require academic attention (${data.criticalCount} critical, ${data.highCount} high risk). Assigning targeted remediation tasks is recommended.`;
}

function fallbackParentRiskSummary(data: Omit<ParentSafeRiskSummaryData, 'summaryText'>): string {
  return `${data.studentName}'s learning status shows a ${data.riskLevel} risk level with a ${data.riskTrend} trend. Encouraging daily 20-minute practice sessions is recommended.`;
}
