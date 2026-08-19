import { TutorProvider, TutorRequest, TutorResponse } from '../types.js';

export class UnconnectedProvider implements TutorProvider {
  name = 'UnconnectedProvider';

  async generateResponse(_request: TutorRequest): Promise<TutorResponse> {
    return {
      answer: 'The AI Tutor provider is not connected yet in this build phase. Once an LLM (OpenAI, Cloud, or Local LM Studio) is attached, responses with grounded citations will appear here.',
      sources: [],
      suggestedNextQuestions: [],
    };
  }
}
