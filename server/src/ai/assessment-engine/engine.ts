import { dataRepository } from '../../repositories/data.repository.js';
import {
  AssessmentBlueprint,
  AssessmentResult,
  QuestionCandidate,
  StudentAssessmentProfile,
  ValidatedQuestion,
} from './types.js';
import { QuestionGenerator, VERIFIED_ASSESSMENT_QUESTION_BANK } from './question-generator.js';
import { QuestionValidator } from './question-validator.js';
import { AssessmentScoringEngine } from './scoring.js';
import { AssessmentAnalyticsEngine } from './analytics.js';
import { AssessmentRecommendationEngine } from './recommendations.js';
import { AIAssessmentCoach } from './ai-coach.js';

export class AssessmentEngine {
  static async buildStudentProfile(studentId: string): Promise<StudentAssessmentProfile> {
    const [profile, gaps, revisions, doubts] = await Promise.all([
      dataRepository.getStudentProfile ? dataRepository.getStudentProfile(studentId) : null,
      dataRepository.getStudentGaps ? dataRepository.getStudentGaps(studentId) : [],
      dataRepository.getStudentRevisionItems ? dataRepository.getStudentRevisionItems(studentId) : [],
      dataRepository.getStudentDoubts ? dataRepository.getStudentDoubts(studentId) : [],
    ]);

    const activeGaps = (gaps || []).map((g: any) => g.conceptId || g.topic || 'math_polynomials');
    const revisionDueConcepts = (revisions || []).map((r: any) => r.conceptId || 'math_polynomials');

    return {
      studentId,
      masteryMap: profile?.conceptMastery || { math_polynomials: 65, sci_light_reflection: 50 },
      activeGaps,
      prerequisiteGaps: activeGaps.slice(0, 2),
      riskLevel: profile?.riskLevel || 'low',
      revisionDueConcepts,
    };
  }

  static async generateAssessmentQuestionsFromBlueprint(
    blueprint: AssessmentBlueprint
  ): Promise<ValidatedQuestion[]> {
    const questions: ValidatedQuestion[] = [];
    const count = blueprint.totalQuestions || 5;

    for (let i = 0; i < count; i++) {
      const qType = i % 2 === 0 ? 'mcq' : 'short_answer';
      const difficulty = i === 0 ? 'easy' : i === count - 1 ? 'hard' : 'medium';

      const draft = await QuestionGenerator.generateQuestionDraft({
        subject: blueprint.subject,
        topic: blueprint.subject === 'Science' ? 'Light - Reflection and Refraction' : 'Polynomials',
        conceptId: blueprint.subject === 'Science' ? 'sci_light_reflection' : 'math_polynomials',
        classLevel: blueprint.classLevel || 10,
        board: blueprint.board || 'CBSE',
        difficulty,
        questionType: qType as any,
      });

      const validated = QuestionValidator.validate(draft, questions.map((q) => q.questionText));
      questions.push(validated);
    }

    return questions;
  }

  static async evaluateAttempt(
    attemptId: string,
    assessmentId: string,
    studentId: string,
    responses: Array<{ questionId: string; answer: any; timeSpentSeconds?: number }>
  ): Promise<AssessmentResult> {
    const questions = await dataRepository.getEngineAssessmentQuestions(assessmentId);
    const qList: QuestionCandidate[] = questions.length > 0 ? questions : VERIFIED_ASSESSMENT_QUESTION_BANK;

    const result = AssessmentScoringEngine.evaluateAttempt(attemptId, assessmentId, studentId, qList, responses);
    await dataRepository.submitEngineAssessmentAttempt(attemptId, result.attempt);

    return result;
  }
}
