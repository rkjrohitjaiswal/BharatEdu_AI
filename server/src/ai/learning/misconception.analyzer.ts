import OpenAI from 'openai';
import { MisconceptionAnalysisResult } from './types.js';

export class MisconceptionAnalyzer {
  public static async analyzeSemanticMisconception(
    topicName: string,
    studentAnswer: string,
    historyAnswers: string[] = []
  ): Promise<MisconceptionAnalysisResult | null> {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey || apiKey.trim().length === 0 || !studentAnswer || studentAnswer.trim().length === 0) {
      return null;
    }

    const openai = new OpenAI({ apiKey, timeout: 10000 });

    const prompt = `You are a pedagogical expert analyzing a school student's answer for potential conceptual misconceptions.

TOPIC: ${topicName}
STUDENT ANSWER: "${studentAnswer}"
${historyAnswers.length > 0 ? `PREVIOUS ANSWERS: ${historyAnswers.map((a) => `"${a}"`).join(', ')}` : ''}

Evaluate whether the student demonstrates a persistent conceptual misconception versus a simple calculation error or casual typo.

Return ONLY a valid JSON object matching this schema EXACTLY:
{
  "isMisconception": boolean,
  "concept": string,
  "misconception": string,
  "confidence": number,
  "evidence": string,
  "recommendedAction": string
}

RULES:
- "confidence" MUST be a number between 0.0 and 1.0.
- "isMisconception" MUST be true ONLY if there is clear conceptual confusion.
- "evidence" MUST be a concise 1-sentence explanation of what the student misunderstood.
- Do NOT output any markdown ticks, preambles, or text outside the JSON object.`;

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const rawJson = completion.choices[0]?.message?.content?.trim();
      if (!rawJson) return null;

      const parsed = JSON.parse(rawJson);

      // Validate JSON Schema
      if (
        typeof parsed.isMisconception === 'boolean' &&
        typeof parsed.concept === 'string' &&
        typeof parsed.misconception === 'string' &&
        typeof parsed.confidence === 'number' &&
        parsed.confidence >= 0 &&
        parsed.confidence <= 1 &&
        typeof parsed.evidence === 'string' &&
        typeof parsed.recommendedAction === 'string'
      ) {
        return {
          isMisconception: parsed.isMisconception,
          concept: parsed.concept,
          misconception: parsed.misconception,
          confidence: Math.round(parsed.confidence * 100) / 100,
          evidence: parsed.evidence.trim(),
          recommendedAction: parsed.recommendedAction.trim(),
        };
      }
      return null;
    } catch (err: any) {
      console.warn(`⚠️ [MisconceptionAnalyzer] Analysis failed or unconfigured: ${err.message}`);
      return null;
    }
  }
}
