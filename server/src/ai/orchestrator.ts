import { TutorProvider, TutorRequest, TutorResponse } from './types.js';
import { UnconnectedProvider } from './providers/base.provider.js';
import { OpenAIProvider } from './providers/openai.provider.js';

export class AIOrchestrator {
  private provider: TutorProvider;

  constructor() {
    // Select provider based on environment configuration
    const providerName = (process.env.AI_PROVIDER || 'openai').toLowerCase();

    if (providerName === 'openai' || process.env.AI_API_KEY) {
      this.provider = new OpenAIProvider();
    } else {
      this.provider = new UnconnectedProvider();
    }
  }

  public setProvider(provider: TutorProvider): void {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async processTutorRequest(request: TutorRequest): Promise<TutorResponse> {
    // Re-evaluate provider dynamically if environment changed
    if (process.env.AI_API_KEY && this.provider.name === 'UnconnectedProvider') {
      this.provider = new OpenAIProvider();
    }
    return await this.provider.generateResponse(request);
  }
}

export const aiOrchestrator = new AIOrchestrator();
