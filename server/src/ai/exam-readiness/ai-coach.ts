import { ExamReadinessResult } from './types.js';

export class ExamAICoach {
  /**
   * Enriches deterministic exam readiness evaluation with optional AI explanations.
   * Never alters deterministic score, priorities, or days remaining.
   */
  static async enrichReadinessExplanation(
    readiness: ExamReadinessResult
  ): Promise<{ explanation: string; recommendations: string[]; aiEnhanced: boolean }> {
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      return {
        explanation: readiness.explanation,
        recommendations: readiness.recommendations,
        aiEnhanced: false,
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are an empathetic, highly structured AI Exam Coach for students in India. Explain the student’s exam readiness based strictly on deterministic numbers provided. Do NOT invent dates, mastery scores, syllabus items, or citations.',
            },
            {
              role: 'user',
              content: `Exam: ${readiness.title}\nDays Remaining: ${readiness.daysRemaining}\nReadiness Score: ${readiness.readinessScore}/100 (${readiness.readinessLevel})\nCritical Topics: ${readiness.criticalTopics.map((t) => t.topicName).join(', ') || 'None'}\nHigh Priority Topics: ${readiness.highPriorityTopics.map((t) => t.topicName).join(', ') || 'None'}\nProvide a concise 2-sentence encouragement and 3 actionable study recommendations.`,
            },
          ],
          temperature: 0.5,
          max_tokens: 250,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content?.trim();
        if (content) {
          return {
            explanation: content,
            recommendations: readiness.recommendations,
            aiEnhanced: true,
          };
        }
      }
    } catch (e) {
      // Fallback silently on error
    }

    return {
      explanation: readiness.explanation,
      recommendations: readiness.recommendations,
      aiEnhanced: false,
    };
  }
}
