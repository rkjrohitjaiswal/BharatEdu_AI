import OpenAI from 'openai';
import { PrioritizedTopicItem } from './types.js';

export class StudyPlanAIEnricher {
  private static getApiKey(): string | undefined {
    return process.env.AI_API_KEY;
  }

  private static getModelName(): string {
    return process.env.AI_MODEL || 'gpt-4o-mini';
  }

  /**
   * Enriches task reasons with personalized pedagogical encouragement using OpenAI.
   * If AI_API_KEY is unconfigured or call fails, returns original deterministic template reasons.
   */
  public static async enrichTaskReasons(
    tasks: PrioritizedTopicItem[],
    studentName: string,
    language: string = 'english'
  ): Promise<{ enrichedTasks: PrioritizedTopicItem[]; aiEnriched: boolean }> {
    const apiKey = this.getApiKey();

    if (!apiKey || apiKey.trim().length === 0) {
      // Deterministic zero-dependency fallback
      return { enrichedTasks: tasks, aiEnriched: false };
    }

    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `You are an encouraging AI Study Assistant for Indian school students.
Student Name: ${studentName}
Language Preference: ${language}

Task List:
${tasks.map((t, idx) => `${idx + 1}. Topic: "${t.topicName}" (Subject: ${t.subjectName}), Priority: ${t.priorityLevel}, Reason: ${t.reason}`).join('\n')}

Generate short, motivating 1-sentence reasons in ${language} for each task to guide the student.
Return a JSON array of strings corresponding to each task in order.
Example JSON output: ["Short encouraging reason 1", "Short encouraging reason 2"]`;

      const response = await openai.chat.completions.create({
        model: this.getModelName(),
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 400,
        temperature: 0.7,
      });

      const responseText = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(responseText);
      const reasonsList: string[] = Array.isArray(parsed) ? parsed : parsed.reasons || parsed.tasks || [];

      if (Array.isArray(reasonsList) && reasonsList.length === tasks.length) {
        const enrichedTasks = tasks.map((t, i) => ({
          ...t,
          reason: reasonsList[i] || t.reason,
        }));
        return { enrichedTasks, aiEnriched: true };
      }

      return { enrichedTasks: tasks, aiEnriched: false };
    } catch (error: any) {
      console.warn(`⚠️ [StudyPlanAIEnricher] OpenAI call skipped: ${error.message}. Using deterministic templates.`);
      return { enrichedTasks: tasks, aiEnriched: false };
    }
  }
}
