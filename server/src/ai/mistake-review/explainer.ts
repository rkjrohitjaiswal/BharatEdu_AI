import OpenAI from 'openai';
import { VectorRetriever } from '../../rag/retriever.js';
import { MisconceptionAnalyzer } from '../learning/misconception.analyzer.js';
import { MistakeExplanationResult, RAGCitation } from './types.js';

export class MistakeExplainer {
  private static getApiKey(): string | undefined {
    return process.env.AI_API_KEY;
  }

  private static getModelName(): string {
    return process.env.AI_MODEL || 'gpt-4o-mini';
  }

  /**
   * Generates a grounded AI mistake explanation with RAG citations and misconception detection.
   * If AI_API_KEY is missing or call fails, falls back cleanly to deterministic templates.
   */
  public static async explainMistake(payload: {
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    subjectName?: string;
    topicName?: string;
    storedExplanation?: string;
    language?: string;
  }): Promise<MistakeExplanationResult> {
    const {
      questionText,
      studentAnswer,
      correctAnswer,
      subjectName = 'General Subject',
      topicName = 'Curriculum Topic',
      storedExplanation = '',
      language = 'english',
    } = payload;

    // 1. Retrieve Grounded RAG Sources
    const retrievedSources = await VectorRetriever.retrieveRelevantSources(questionText, {
      subject: subjectName,
      language: language as any,
    });

    const sources: RAGCitation[] = (retrievedSources || []).map((src) => ({
      title: src.title,
      publisher: src.publisher,
      sourceUrl: src.sourceUrl,
      page: src.page,
      section: src.section,
    }));

    // 2. Misconception Pattern Analysis
    const detectedMisconception = await MisconceptionAnalyzer.analyzeSemanticMisconception(
      topicName,
      studentAnswer
    );

    const misconceptionText = detectedMisconception && detectedMisconception.isMisconception
      ? detectedMisconception.misconception
      : 'No specific misconception pattern detected.';

    // 3. AI Explanation via OpenAI (or deterministic fallback)
    const apiKey = this.getApiKey();

    if (!apiKey || apiKey.trim().length === 0) {
      // Deterministic Offline Fallback
      return {
        explanation:
          storedExplanation ||
          `The student selected "${studentAnswer}", but the correct solution is "${correctAnswer}". Review the core principles of ${topicName}.`,
        keyConcept: `Fundamental principles of ${topicName}`,
        misconception: misconceptionText,
        recommendedAction: `Practice additional questions on ${topicName} or ask the AI Tutor for clarification.`,
        sources,
        aiEnriched: false,
      };
    }

    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `You are an expert AI Tutor for Indian school students.
Explain a student's mistake concisely in ${language}.

Question: "${questionText}"
Student Answer: "${studentAnswer}"
Correct Answer: "${correctAnswer}"
Subject: ${subjectName}
Topic: ${topicName}

Return a JSON object with:
- "explanation": Short, clear explanation of why "${studentAnswer}" is incorrect and why "${correctAnswer}" is right (max 2-3 sentences).
- "keyConcept": Core concept or formula the student should remember (max 1 sentence).
- "recommendedAction": Practical study advice for this topic (max 1 sentence).

Example JSON:
{
  "explanation": "You selected ... but the correct answer is ... because ...",
  "keyConcept": "Core concept is ...",
  "recommendedAction": "Practice 3 questions on ..."
}`;

      const response = await openai.chat.completions.create({
        model: this.getModelName(),
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 300,
        temperature: 0.5,
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');

      return {
        explanation:
          parsed.explanation ||
          storedExplanation ||
          `The correct answer is "${correctAnswer}". Review ${topicName} principles.`,
        keyConcept: parsed.keyConcept || `Key concepts of ${topicName}`,
        misconception: misconceptionText,
        recommendedAction:
          parsed.recommendedAction || `Practice 3 more questions on ${topicName}.`,
        sources,
        aiEnriched: true,
      };
    } catch (error: any) {
      console.warn(`⚠️ [MistakeExplainer] OpenAI call skipped: ${error.message}. Using deterministic fallback.`);
      return {
        explanation:
          storedExplanation ||
          `The student selected "${studentAnswer}", but the correct solution is "${correctAnswer}". Review ${topicName}.`,
        keyConcept: `Key concepts of ${topicName}`,
        misconception: misconceptionText,
        recommendedAction: `Practice questions on ${topicName}.`,
        sources,
        aiEnriched: false,
      };
    }
  }
}
