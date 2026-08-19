import { ParentSafeProgressSummary, StudentAnalyticsOverview, TeacherClassAnalytics } from './types.js';

export async function generateStudentWeeklySummary(
  analytics: Omit<StudentAnalyticsOverview, 'weeklySummary'>
): Promise<{ text: string; aiEnhanced: boolean }> {
  const key = process.env.AI_API_KEY;
  if (!key) {
    return { text: fallbackStudentSummary(analytics), aiEnhanced: false };
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
              'You are an encouraging educational analytics assistant. Summarize the student learning data into a concise, supportive 2-3 sentence weekly review. Do NOT alter scores, risk levels, or facts.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              mastery: analytics.overallMastery,
              accuracy: analytics.practiceAccuracy,
              gaps: analytics.learningGaps,
              risk: analytics.riskIndicators,
              adherence: analytics.studyPlanAdherence,
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
    return { text: fallbackStudentSummary(analytics), aiEnhanced: false };
  }
}

export async function generateTeacherClassSummary(
  analytics: Omit<TeacherClassAnalytics, 'weeklySummary'>
): Promise<{ text: string; aiEnhanced: boolean }> {
  const key = process.env.AI_API_KEY;
  if (!key) {
    return { text: fallbackTeacherSummary(analytics), aiEnhanced: false };
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
              'You are a professional educational teacher assistant. Provide a concise 2-3 sentence class performance summary for teachers based strictly on the provided data. Do not alter numbers.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              averageMastery: analytics.averageMastery,
              improvingCount: analytics.improvingStudents.length,
              strugglingCount: analytics.strugglingStudents.length,
              interventionEffectiveness: analytics.interventionEffectiveness,
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
    return { text: fallbackTeacherSummary(analytics), aiEnhanced: false };
  }
}

export async function generateParentProgressSummary(
  analytics: Omit<ParentSafeProgressSummary, 'weeklySummary'>
): Promise<{ text: string; aiEnhanced: boolean }> {
  const key = process.env.AI_API_KEY;
  if (!key) {
    return { text: fallbackParentSummary(analytics), aiEnhanced: false };
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
              'You are a supportive family education guide. Provide a clear, reassuring 2-sentence progress overview for a parent about their student.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              name: analytics.studentName,
              mastery: analytics.overallMastery,
              gaps: analytics.activeGapsCount,
              risk: analytics.riskLevel,
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
    return { text: fallbackParentSummary(analytics), aiEnhanced: false };
  }
}

function fallbackStudentSummary(analytics: Omit<StudentAnalyticsOverview, 'weeklySummary'>): string {
  const risk = analytics.riskIndicators.riskLevel;
  if (risk === 'critical' || risk === 'high') {
    return `Your overall mastery is ${analytics.overallMastery}%. Focus on resolving your active learning gaps and complete high-priority study tasks to lower risk.`;
  }
  return `Great progress! Your overall mastery is ${analytics.overallMastery}% with ${analytics.practiceAccuracy}% practice accuracy. Keep up consistent daily study sessions to achieve your learning goals.`;
}

function fallbackTeacherSummary(analytics: Omit<TeacherClassAnalytics, 'weeklySummary'>): string {
  return `Class average mastery is ${analytics.averageMastery}% across ${analytics.totalStudents} students. ${analytics.strugglingStudents.length} student(s) currently require targeted support, while intervention effectiveness is at ${analytics.interventionEffectiveness.effectivenessRate}%.`;
}

function fallbackParentSummary(analytics: Omit<ParentSafeProgressSummary, 'weeklySummary'>): string {
  return `${analytics.studentName} has reached an overall topic mastery of ${analytics.overallMastery}% with ${analytics.activeGapsCount} active learning gap(s). Encouraging regular practice will help maintain strong learning momentum.`;
}
