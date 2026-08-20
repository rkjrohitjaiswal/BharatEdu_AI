import { AssessmentEngine } from '../assessment-engine/engine.js';
import { MockExamPlan } from './types.js';

export class AdaptiveMockExamEngine {
  static createMockPlan(params: {
    mockType: 'diagnostic' | 'sectional' | 'full_length' | 'weak_topic' | 'final_simulation';
    readinessScore: number;
    daysRemaining: number;
    weakTopics: string[];
  }): MockExamPlan {
    const isClose = params.daysRemaining <= 7;
    const isWeak = params.readinessScore < 60;

    let difficultyComposition = { easy: 40, medium: 40, hard: 20 };
    if (isWeak) {
      difficultyComposition = { easy: 60, medium: 30, hard: 10 };
    } else if (params.readinessScore > 85) {
      difficultyComposition = { easy: 20, medium: 50, hard: 30 };
    }

    let durationMinutes = 60;
    let totalQuestions = 15;

    if (params.mockType === 'full_length' || params.mockType === 'final_simulation') {
      durationMinutes = 180;
      totalQuestions = 30;
    } else if (params.mockType === 'sectional') {
      durationMinutes = 45;
      totalQuestions = 10;
    }

    const recDate = new Date();
    recDate.setDate(recDate.getDate() + (isClose ? 1 : 3));

    return {
      mockType: params.mockType,
      recommendedDate: recDate,
      targetTopics: params.weakTopics.length > 0 ? params.weakTopics : ['Polynomials', 'Quadratic Equations', 'Light - Reflection'],
      difficultyComposition,
      durationMinutes,
      totalQuestions,
      reason: `Targeted ${params.mockType.replace(/_/g, ' ')} to validate exam readiness and time management.`,
    };
  }

  static async generateMockAssessment(blueprint: any): Promise<any> {
    // Delegates question generation to Feature 40 Assessment Engine
    const questions = await AssessmentEngine.generateAssessmentQuestionsFromBlueprint(blueprint);
    return {
      blueprint,
      questions,
      assessmentId: `ass_mock_${Date.now()}`,
    };
  }
}
