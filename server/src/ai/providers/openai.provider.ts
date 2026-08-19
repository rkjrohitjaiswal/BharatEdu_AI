import OpenAI from 'openai';
import { TutorProvider, TutorRequest, TutorResponse } from '../types.js';
import { buildSystemPrompt } from '../prompts/system.prompts.js';

export class OpenAIProvider implements TutorProvider {
  name = 'OpenAIProvider';

  private getApiKey(): string | undefined {
    return process.env.AI_API_KEY;
  }

  private getModelName(): string {
    return process.env.AI_MODEL || 'gpt-4o-mini';
  }

  private getTimeoutMs(): number {
    return Number(process.env.AI_REQUEST_TIMEOUT_MS) || 15000;
  }

  private getMaxContextMessages(): number {
    return Number(process.env.MAX_CONTEXT_MESSAGES) || 10;
  }

  async generateResponse(request: TutorRequest): Promise<TutorResponse> {
    const apiKey = this.getApiKey();

    if (!apiKey || apiKey.trim().length === 0) {
      console.warn('⚠️ [OpenAIProvider] AI_API_KEY is not configured in environment variables.');
      return {
        answer: 'AI service configuration is incomplete. AI_API_KEY is not configured in environment variables.',
        sources: [],
        metadata: {
          error: 'CONFIG_ERROR',
          message: 'AI_API_KEY missing',
        },
      };
    }

    const modelName = this.getModelName();
    const timeoutMs = this.getTimeoutMs();
    const maxContext = this.getMaxContextMessages();

    const openai = new OpenAI({
      apiKey,
      timeout: timeoutMs,
    });

    const systemPrompt = buildSystemPrompt(request.context);

    // Format recent conversation context history
    const contextMessages = (request.context.recentMessages || [])
      .slice(-maxContext)
      .map((msg) => ({
        role: msg.role === 'student' ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      }));

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...contextMessages,
      { role: 'user', content: request.studentMessage },
    ];

    const startTime = Date.now();

    try {
      console.log(`📡 [OpenAIProvider] Sending completion request to ${modelName} (Timeout: ${timeoutMs}ms)...`);

      const completion = await openai.chat.completions.create({
        model: modelName,
        messages,
        temperature: 0.4,
        max_tokens: 1000,
      });

      const latencyMs = Date.now() - startTime;
      const answer = completion.choices[0]?.message?.content?.trim() || 'No response content produced by AI model.';

      console.log(`✅ [OpenAIProvider] Response received cleanly in ${latencyMs}ms`);

      return {
        answer,
        sources: [], // RAG sources array remains empty for Phase 5B
        metadata: {
          model: modelName,
          provider: 'openai',
          latencyMs,
          usage: completion.usage || {},
        },
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      console.error(`❌ [OpenAIProvider] Error generating LLM response (${latencyMs}ms):`, error.message || error);

      // Safe user-facing error responses without leaking keys or stack traces
      let userErrorMessage = 'AI Tutor is temporarily unavailable. Please try again.';

      if (error.status === 401) {
        userErrorMessage = 'AI service authentication failed. Invalid API key configured.';
      } else if (error.status === 429) {
        userErrorMessage = 'AI service rate limit reached. Please wait a moment before sending another question.';
      } else if (error.name === 'APIConnectionTimeoutError' || error.message?.includes('timeout')) {
        userErrorMessage = 'AI service request timed out. Please check network connectivity and retry.';
      }

      return {
        answer: userErrorMessage,
        sources: [],
        metadata: {
          error: 'PROVIDER_ERROR',
          model: modelName,
          latencyMs,
        },
      };
    }
  }
}
