import { OrchestratorFeedbackData } from './types.js';
import { EvidenceRecommenderEngine } from './recommender.js';

export class OrchestratorFeedbackEngine {
  static getFeedbackForOrchestrator(studentId: string): OrchestratorFeedbackData {
    return EvidenceRecommenderEngine.getRecommendations(studentId);
  }
}
