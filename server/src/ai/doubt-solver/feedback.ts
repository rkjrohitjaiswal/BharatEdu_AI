import { dataRepository } from '../../repositories/data.repository.js';
import { DoubtFeedbackType } from '../../models/doubt-feedback.model.js';

export async function recordDoubtFeedback(
  studentId: string,
  doubtId: string,
  responseId: string,
  helpful: boolean,
  feedbackType: DoubtFeedbackType = 'helpful',
  comment?: string
) {
  return await dataRepository.createDoubtFeedback({
    doubtId,
    studentId,
    responseId,
    helpful,
    feedbackType,
    comment,
  });
}
