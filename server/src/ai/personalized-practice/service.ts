import { dataRepository } from '../../repositories/data.repository.js';
import { selectBestPracticeConcept } from './concept-selector.js';
import { buildStudentPracticeContext } from './context.js';
import {
  createPersonalizedPracticeSession,
  getCurrentSessionQuestion,
  getSessionSummaryResult,
  requestSessionHint,
  submitSessionAnswer,
} from './engine.js';
import { PracticeMode, PracticeRecommendation } from './types.js';

export class PersonalizedPracticeService {
  static async getPracticeRecommendations(studentId: string): Promise<PracticeRecommendation[]> {
    const context = await buildStudentPracticeContext(studentId);
    const selectedConcept = selectBestPracticeConcept(context, 'mixed');

    const recs: PracticeRecommendation[] = [
      {
        recommendationId: `rec_p_${Date.now()}_1`,
        mode: context.prerequisiteGaps.length > 0 ? 'prerequisite' : 'weak_topic',
        title: 'Adaptive Mastery Practice',
        description: `Targeted questions to strengthen ${selectedConcept.conceptId}`,
        subject: selectedConcept.subject,
        topicId: selectedConcept.topicId,
        conceptId: selectedConcept.conceptId,
        difficulty: 'medium',
        questionCount: 5,
        estimatedMinutes: 10,
        priority: context.isHighRisk ? 'CRITICAL' : 'HIGH',
        reason: selectedConcept.selectionReason,
      },
      {
        recommendationId: `rec_p_${Date.now()}_2`,
        mode: 'revision',
        title: 'Smart Revision Quiz',
        description: 'Spaced repetition practice on previously mastered topics',
        subject: 'Mathematics',
        topicId: 'math_algebra',
        conceptId: context.dueRevisionConceptIds[0] || 'math_linear_eq',
        difficulty: 'medium',
        questionCount: 5,
        estimatedMinutes: 8,
        priority: 'MEDIUM',
        reason: 'Recommended based on your daily memory retention curve',
      },
      {
        recommendationId: `rec_p_${Date.now()}_3`,
        mode: 'career_skill',
        title: 'Career Skill Builder: Python & Logic',
        description: 'Data structures & problem solving for Software Engineering',
        subject: 'Computer Science',
        topicId: 'cs_python',
        conceptId: 'python_data_structures',
        difficulty: 'easy',
        questionCount: 5,
        estimatedMinutes: 12,
        priority: 'LOW',
        reason: 'Builds core skills for your Software Engineer career goal',
      },
    ];

    return recs;
  }

  static async createSession(
    studentId: string,
    mode: PracticeMode = 'mixed',
    questionCount: number = 5,
    requestedConceptId?: string
  ) {
    return await createPersonalizedPracticeSession(studentId, mode, questionCount, requestedConceptId);
  }

  static async getQuestion(sessionId: string, studentId: string) {
    return await getCurrentSessionQuestion(sessionId, studentId);
  }

  static async submitAnswer(sessionId: string, studentId: string, selectedAnswer: any, responseTimeSeconds?: number) {
    return await submitSessionAnswer(sessionId, studentId, selectedAnswer, responseTimeSeconds);
  }

  static async getHint(sessionId: string, studentId: string, hintLevel: number) {
    return await requestSessionHint(sessionId, studentId, hintLevel);
  }

  static async getResult(sessionId: string, studentId: string) {
    return await getSessionSummaryResult(sessionId, studentId);
  }

  static async getHistory(studentId: string) {
    return (await dataRepository.getStudentPersonalizedAttempts(studentId)) || [];
  }

  static async getTeacherPracticeSummary(studentId: string) {
    const attempts = (await dataRepository.getStudentPersonalizedAttempts(studentId)) || [];
    const correct = attempts.filter((a: any) => a.isCorrect).length;
    return {
      studentId,
      totalAttempts: attempts.length,
      correctCount: correct,
      accuracyPercentage: attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0,
      weakConceptsIdentified: ['math_quadratic_eq'],
    };
  }

  static async getParentPracticeSummary(studentId: string) {
    return await this.getTeacherPracticeSummary(studentId);
  }
}
