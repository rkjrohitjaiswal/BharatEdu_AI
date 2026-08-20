import { dataRepository } from '../../repositories/data.repository.js';
import { personalizeDoubtExplanation } from './personalization.js';
import { ExplanationLanguage, ExplanationLevel, IDoubtFollowupDTO } from './types.js';

export async function processDoubtFollowup(
  studentId: string,
  doubtId: string,
  followupQuestion: string,
  level: ExplanationLevel = 'standard',
  language: ExplanationLanguage = 'en'
): Promise<IDoubtFollowupDTO> {
  const responses = await dataRepository.getDoubtResponses(doubtId);
  const parentResp = responses.length > 0 ? responses[0] : null;

  const fId = `fup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const q = followupQuestion.trim();

  let ans = `Follow-up answer to "${q}": `;
  if (q.toLowerCase().includes('simply') || q.toLowerCase().includes('easy')) {
    ans += 'In simpler terms, focus on the core substitution step without getting bogged down by intermediate algebra.';
  } else if (q.toLowerCase().includes('why')) {
    ans += 'This is because mathematical equality requires performing identical operations on both sides.';
  } else if (q.toLowerCase().includes('example')) {
    ans += 'Here is an additional practice example: 2x + 4 = 10 -> 2x = 6 -> x = 3.';
  } else {
    ans += `Regarding "${q}", standard curriculum steps apply directly to your follow-up query.`;
  }

  const { personalizedExplanation } = personalizeDoubtExplanation(ans, level, language);

  const followupRecord = await dataRepository.createDoubtFollowup({
    doubtId,
    studentId,
    parentResponseId: parentResp ? (parentResp.responseId || String(parentResp._id)) : 'resp_0',
    question: q,
    responseId: fId,
    answer: ans,
    explanation: personalizedExplanation,
  });

  return {
    doubtId,
    studentId: String(studentId),
    parentResponseId: parentResp ? (parentResp.responseId || String(parentResp._id)) : 'resp_0',
    question: q,
    responseId: fId,
    answer: ans,
    explanation: personalizedExplanation,
    createdAt: new Date().toISOString(),
  };
}
