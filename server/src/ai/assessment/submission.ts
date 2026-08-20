import { IAssessment } from '../../models/assessment.model.js';
import { IAssessmentSubmission } from '../../models/assessment-submission.model.js';

export class AssessmentSubmissionManager {
  static validateAndCalculateLatePenalty(
    assessment: IAssessment,
    now: Date = new Date()
  ): { isLate: boolean; lateByMinutes: number; penaltyPercent: number } {
    const dueAt = (assessment as any).dueAt;
    if (!dueAt) {
      return { isLate: false, lateByMinutes: 0, penaltyPercent: 0 };
    }

    const dueTime = new Date(dueAt).getTime();
    const currentTime = now.getTime();

    if (currentTime <= dueTime) {
      return { isLate: false, lateByMinutes: 0, penaltyPercent: 0 };
    }

    const lateByMinutes = Math.ceil((currentTime - dueTime) / (1000 * 60));

    if (!(assessment as any).lateSubmissionAllowed) {
      return { isLate: true, lateByMinutes, penaltyPercent: 100 };
    }

    return {
      isLate: true,
      lateByMinutes,
      penaltyPercent: (assessment as any).latePenaltyPercent || 10,
    };
  }

  static applyLatePenaltyToScore(score: number, penaltyPercent: number): number {
    if (penaltyPercent <= 0) return score;
    const penalizedScore = score * (1 - penaltyPercent / 100);
    return Math.max(0, Math.round(penalizedScore * 100) / 100);
  }
}
