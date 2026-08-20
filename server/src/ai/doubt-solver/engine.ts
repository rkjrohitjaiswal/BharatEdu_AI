import { dataRepository } from '../../repositories/data.repository.js';
import { DoubtDifficultyLevel, DoubtSourceContext } from '../../models/student-doubt.model.js';
import { generateAIDoubtExplanation } from './ai-coach.js';
import { generateStepByStepExplanation } from './explanation.js';
import { validateExplanationGrounding } from './grounding.js';
import { detectDoubtIntent } from './intent.js';
import { personalizeDoubtExplanation } from './personalization.js';
import { retrieveEducationalContext } from './retrieval.js';
import { ExplanationLanguage, ExplanationLevel, IDoubtResponseDTO, IStudentDoubtDTO } from './types.js';

export async function solveStudentDoubtEngine(
  studentId: string,
  question: string,
  subjectOverride?: string,
  sourceContext: DoubtSourceContext = 'free_question',
  sourceId?: string,
  level: ExplanationLevel = 'standard',
  language: ExplanationLanguage = 'en'
): Promise<IStudentDoubtDTO> {
  const normQ = (question || '').trim().toLowerCase();
  if (!normQ) throw new Error('Question text cannot be empty');

  // Deduplication Check for identical question by same student
  const existingList = await dataRepository.getStudentDoubts(studentId);
  const duplicate = existingList.find((d: any) => d.normalizedQuestion === normQ);
  if (duplicate) {
    return await getStudentDoubtByIdEngine(studentId, duplicate.doubtId || String(duplicate._id));
  }

  const intentData = detectDoubtIntent(question);
  const subject = subjectOverride || intentData.subject;
  const topicId = intentData.topicId;
  const conceptId = intentData.conceptId;
  const difficulty: DoubtDifficultyLevel = intentData.difficulty;

  const { sources, trustedContextStr } = retrieveEducationalContext(subject, topicId, conceptId);
  const rawFormulation = generateStepByStepExplanation(question, intentData.intent, subject, topicId, conceptId);

  const aiCoachExp = await generateAIDoubtExplanation(question, subject, topicId);
  const fullRawExplanation = `${rawFormulation.explanation}\n\nAI Insight: ${aiCoachExp}`;

  const grounding = validateExplanationGrounding(fullRawExplanation, sources.length);
  const { personalizedExplanation } = personalizeDoubtExplanation(fullRawExplanation, level, language);

  const doubtId = `doubt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const responseId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const doubtRecord = await dataRepository.createStudentDoubt({
    doubtId,
    studentId,
    question: question.trim(),
    normalizedQuestion: normQ,
    subject,
    topicId,
    conceptId,
    sourceContext,
    sourceId,
    difficulty,
    status: 'answered',
    resolvedAt: new Date(),
  });

  const dDbId = String(doubtRecord._id || doubtRecord.id || doubtId);

  const responseDTO: IDoubtResponseDTO = {
    responseId,
    doubtId,
    studentId: String(studentId),
    answer: rawFormulation.answer,
    explanation: personalizedExplanation,
    steps: rawFormulation.steps,
    keyConcepts: rawFormulation.keyConcepts,
    prerequisiteConcepts: rawFormulation.prerequisiteConcepts,
    examples: rawFormulation.examples,
    commonMistakes: rawFormulation.commonMistakes,
    verificationNotes: grounding.verificationNotes,
    confidence: grounding.confidence,
    sourceReferences: sources,
    responseType: 'hybrid',
    intentCategory: intentData.intent,
    explanationLevel: level,
    language,
    generatedAt: new Date().toISOString(),
  };

  await dataRepository.createDoubtResponse({ ...responseDTO, doubtId, studentId });

  return {
    id: dDbId,
    doubtId,
    studentId: String(studentId),
    question: question.trim(),
    normalizedQuestion: normQ,
    subject,
    topicId,
    conceptId,
    sourceContext,
    sourceId,
    difficulty,
    status: 'answered',
    response: responseDTO,
    followups: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: new Date().toISOString(),
  };
}

export async function getStudentDoubtByIdEngine(studentId: string, doubtId: string): Promise<IStudentDoubtDTO> {
  const target = await dataRepository.getStudentDoubtById(doubtId, studentId);
  if (!target) throw new Error('Doubt record not found or access denied');

  const dDbId = String(target._id || target.id || doubtId);
  const responses = await dataRepository.getDoubtResponses(target.doubtId || dDbId);
  const followups = await dataRepository.getDoubtFollowups(target.doubtId || dDbId);

  const resp = responses.length > 0 ? responses[0] : null;

  return {
    id: dDbId,
    doubtId: target.doubtId || dDbId,
    studentId: String(studentId),
    question: target.question,
    normalizedQuestion: target.normalizedQuestion,
    subject: target.subject,
    topicId: target.topicId,
    conceptId: target.conceptId,
    sourceContext: target.sourceContext,
    sourceId: target.sourceId,
    difficulty: target.difficulty,
    status: target.status,
    response: resp
      ? {
          responseId: resp.responseId || String(resp._id),
          doubtId: target.doubtId || dDbId,
          studentId: String(studentId),
          answer: resp.answer,
          explanation: resp.explanation,
          steps: resp.steps || [],
          keyConcepts: resp.keyConcepts || [],
          prerequisiteConcepts: resp.prerequisiteConcepts || [],
          examples: resp.examples || [],
          commonMistakes: resp.commonMistakes || [],
          verificationNotes: resp.verificationNotes || '',
          confidence: resp.confidence || 90,
          sourceReferences: resp.sourceReferences || [],
          responseType: resp.responseType || 'hybrid',
          intentCategory: 'solve_problem',
          explanationLevel: 'standard',
          language: 'en',
          generatedAt: resp.generatedAt ? new Date(resp.generatedAt).toISOString() : new Date().toISOString(),
        }
      : undefined,
    followups: (followups || []).map((f: any) => ({
      doubtId: target.doubtId || dDbId,
      studentId: String(studentId),
      parentResponseId: f.parentResponseId,
      question: f.question,
      responseId: f.responseId || String(f._id),
      answer: f.answer,
      explanation: f.explanation,
      createdAt: f.createdAt ? new Date(f.createdAt).toISOString() : new Date().toISOString(),
    })),
    createdAt: target.createdAt ? new Date(target.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: target.updatedAt ? new Date(target.updatedAt).toISOString() : new Date().toISOString(),
    resolvedAt: target.resolvedAt ? new Date(target.resolvedAt).toISOString() : undefined,
  };
}
