import OpenAI from 'openai';
import { dataRepository } from '../../repositories/data.repository.js';
import { VectorRetriever } from '../../rag/retriever.js';
import { QuestionValidator } from './validator.js';
import { GeneratedQuestionPayload } from './types.js';
import { QuestionDifficulty } from '../../models/practice-session.model.js';

export class GroundedQuestionGenerator {
  public static async generateOrRetrieveQuestion(options: {
    subjectId: string;
    topicId: string;
    difficulty: QuestionDifficulty;
    language?: 'english' | 'hindi' | 'gujarati';
    excludeQuestionTexts?: string[];
  }): Promise<GeneratedQuestionPayload> {
    const { subjectId, topicId, difficulty, language = 'english', excludeQuestionTexts = [] } = options;

    // 1. Priority 1: Retrieve Existing Validated Question from Database
    const existingQuestions = await dataRepository.getQuestionsByTopic(topicId, difficulty);
    const candidate = existingQuestions.find(
      (q) => q.status === 'validated' && !excludeQuestionTexts.includes(q.questionText)
    );

    if (candidate) {
      return {
        questionText: candidate.questionText,
        questionType: candidate.questionType as any,
        options: candidate.options,
        correctAnswer: candidate.correctAnswer,
        explanation: candidate.explanation,
        difficulty: (candidate.difficulty as any) || difficulty,
        learningObjective: candidate.learningObjective || '',
        language: candidate.language || language,
        sources: [],
      };
    }

    // 2. Priority 2: Grounded RAG + OpenAI AI Question Generation
    const allTopics = await dataRepository.getTopics();
    const targetTopic = allTopics.find((t) => String(t._id || t.id) === String(topicId));
    const topicName = targetTopic?.name || 'Mathematics';

    // RAG Retrieval for factual grounding
    const retrievedSources = await VectorRetriever.retrieveRelevantSources(
      `Grade 8 ${topicName} textbook questions and exercises`,
      { subject: targetTopic?.subjectId?.name, language }
    );

    const apiKey = process.env.AI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      const openai = new OpenAI({ apiKey, timeout: 12000 });
      const maxRetries = Number(process.env.MAX_QUESTION_GENERATION_ATTEMPTS) || 2;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const groundingBlock = retrievedSources.length > 0
            ? `GROUNDED SOURCE CONTEXT:\n${retrievedSources.map((s) => `[Source] "${s.title}" - ${s.contentSnippet}`).join('\n\n')}`
            : '';

          const prompt = `You are a curriculum editor creating an adaptive practice question for school students.

TOPIC: ${topicName}
DIFFICULTY: ${difficulty}
LANGUAGE: ${language}
${groundingBlock}

Create 1 multiple choice question (MCQ) matching this EXACT JSON schema:
{
  "questionText": "...",
  "questionType": "mcq",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Exact matching option text",
  "explanation": "Step by step solution explanation",
  "difficulty": "${difficulty}",
  "learningObjective": "Core pedagogical objective"
}

RULES:
- "correctAnswer" MUST EXACTLY match one of the 4 strings in "options".
- "explanation" MUST be clear and encouraging.
- Return ONLY valid JSON. No markdown tics or text outside the JSON object.`;

          const completion = await openai.chat.completions.create({
            model: process.env.AI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            response_format: { type: 'json_object' },
          });

          const raw = completion.choices[0]?.message?.content?.trim();
          if (raw) {
            const parsed = JSON.parse(raw);
            const valResult = QuestionValidator.validateQuestion(parsed);
            if (valResult.isValid) {
              const finalSources = retrievedSources.map((s) => ({
                title: s.title,
                publisher: s.publisher,
                sourceUrl: s.sourceUrl,
                page: s.page,
                section: s.section,
              }));

              return {
                questionText: parsed.questionText.trim(),
                questionType: 'mcq',
                options: parsed.options,
                correctAnswer: parsed.correctAnswer.trim(),
                explanation: parsed.explanation.trim(),
                difficulty,
                learningObjective: parsed.learningObjective || `Mastery of ${topicName}`,
                language,
                sources: finalSources,
              };
            }
          }
        } catch (err: any) {
          console.warn(`⚠️ [GroundedQuestionGenerator] Generation attempt ${attempt + 1} failed: ${err.message}`);
        }
      }
    }

    // 3. Fallback Validated Question Generator
    return this.createFallbackQuestion(topicName, difficulty, language);
  }

  private static createFallbackQuestion(
    topicName: string,
    difficulty: QuestionDifficulty,
    language: string
  ): GeneratedQuestionPayload {
    if (topicName.toLowerCase().includes('linear') || topicName.toLowerCase().includes('algebra')) {
      return {
        questionText: 'Solve for x: 3x - 5 = 10',
        questionType: 'mcq',
        options: ['x = 5', 'x = 3', 'x = 15', 'x = 2'],
        correctAnswer: 'x = 5',
        explanation: 'Add 5 to both sides: 3x = 15. Then divide by 3: x = 5.',
        difficulty,
        learningObjective: 'Solve linear equations using transposition',
        language: language as any,
        sources: [],
      };
    }

    return {
      questionText: `What is the fundamental SI unit used to measure force in physics?`,
      questionType: 'mcq',
      options: ['Newton (N)', 'Joule (J)', 'Pascal (Pa)', 'Watt (W)'],
      correctAnswer: 'Newton (N)',
      explanation: 'The SI unit of force is the Newton (N), named after Sir Isaac Newton.',
      difficulty,
      learningObjective: 'Understand standard SI physical units',
      language: language as any,
      sources: [],
    };
  }
}
