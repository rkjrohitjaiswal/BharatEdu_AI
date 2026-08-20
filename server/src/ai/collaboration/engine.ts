import { dataRepository } from '../../repositories/data.repository.js';
import { CommunicationContext, CommunicationRecommendation } from './types.js';

export class CollaborationEngine {
  static async buildContext(studentId: string, teacherId: string, subject: string, topic?: string): Promise<CommunicationContext> {
    // 1. Fetch risk metrics from Feature 13 & student profile
    const studentProfile = await dataRepository.getStudentProfile(studentId);
    const riskScore = studentProfile?.riskScore ?? 25;

    // 2. Fetch learning analytics from Feature 17
    const mastery = studentProfile?.overallMastery ?? 70;

    // 3. Fetch active learning gaps from Feature 21/37
    const gaps = studentProfile?.topWeakConcepts || ['Algebraic Fractions'];

    return {
      studentId,
      studentName: `Student ${studentId.substring(0, 4)}`,
      teacherId,
      subject,
      topic: topic || 'Mathematics Fundamentals',
      mastery,
      riskScore,
      learningGaps: gaps,
      evidence: [
        `Overall Mastery: ${mastery}%`,
        `Risk Score: ${riskScore}`,
        `Weak Concepts: ${gaps.join(', ')}`,
      ],
    };
  }

  static recommendCommunication(context: CommunicationContext): CommunicationRecommendation {
    if (context.riskScore >= 70 || context.mastery < 50) {
      return {
        suggestedAudience: ['parent', 'student'],
        suggestedType: 'action_request',
        reason: `Student exhibits high risk index (${context.riskScore}) and mastery below benchmark (${context.mastery}%).`,
        priority: 'critical',
      };
    }

    return {
      suggestedAudience: ['student'],
      suggestedType: 'progress_update',
      reason: `Student is performing steadily (${context.mastery}% mastery). Reinforce positive habits.`,
      priority: 'low',
    };
  }
}
