import { dataRepository } from '../repositories/data.repository.js';

export class GoalProgressCalculator {
  public static async calculateGoalProgress(studentId: string, goal: any): Promise<{
    currentValue: number;
    progressPercent: number;
    isCompleted: boolean;
  }> {
    const targetValue = Math.max(1, goal.targetValue || 1);
    let currentValue = 0;

    switch (goal.goalType) {
      case 'practice_questions': {
        const sessions = await dataRepository.getPracticeSessions(studentId);
        let qCount = 0;
        (sessions || []).forEach((s: any) => {
          if (s.completedQuestions && s.completedQuestions > 0) {
            qCount += s.completedQuestions;
          } else if (s.questions && s.questions.length > 0) {
            qCount += s.questions.filter((q: any) => q.answeredAt || q.studentAnswer || q.isCorrect !== undefined).length || 1;
          } else {
            qCount += 1;
          }
        });
        currentValue = qCount;
        break;
      }
      case 'practice_accuracy': {
        const sessions = await dataRepository.getPracticeSessions(studentId);
        let totalQ = 0;
        let totalC = 0;
        (sessions || []).forEach((s: any) => {
          totalQ += s.completedQuestions || 1;
          totalC += s.correctAnswers || 1;
        });
        currentValue = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
        break;
      }
      case 'study_minutes': {
        const sessions = await dataRepository.getPracticeSessions(studentId);
        const totalQ = (sessions || []).reduce((sum: number, s: any) => sum + (s.completedQuestions || 1), 0);
        currentValue = Math.round(totalQ * 1.5);
        break;
      }
      case 'study_streak': {
        const sessions = await dataRepository.getPracticeSessions(studentId);
        currentValue = Math.min(30, sessions?.length || 1);
        break;
      }
      case 'mastery': {
        const profile = await dataRepository.getLearningProfile(studentId);
        currentValue = profile?.overallMastery ?? 50;
        break;
      }
      case 'topic_completion': {
        const mastery = await dataRepository.getTopicMastery(studentId);
        currentValue = (mastery || []).filter((m: any) => (m.masteryScore || 0) >= 80).length;
        break;
      }
      case 'custom':
      default: {
        const sessions = await dataRepository.getPracticeSessions(studentId);
        currentValue = (sessions || []).length;
        break;
      }
    }

    const progressPercent = Math.min(100, Math.max(0, Math.round((currentValue / targetValue) * 100)));
    const isCompleted = currentValue >= targetValue;

    return {
      currentValue,
      progressPercent,
      isCompleted,
    };
  }
}
