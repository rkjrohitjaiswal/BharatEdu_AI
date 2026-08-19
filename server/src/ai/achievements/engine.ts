import { AchievementRulesEngine } from './rules.js';
import { StudentStatsContext } from './types.js';
import { dataRepository } from '../../repositories/data.repository.js';

export class DeterministicAchievementEngine {
  public static async evaluateAndGrantAchievements(studentId: string): Promise<any[]> {
    // 1. Gather authoritative student activity context
    const [practiceSessions, masteryList, goals, learningProfile] = await Promise.all([
      dataRepository.getPracticeSessions(studentId),
      dataRepository.getTopicMastery(studentId),
      dataRepository.getStudentGoals(studentId),
      dataRepository.getLearningProfile(studentId),
    ]);

    let totalQuestionsSolved = 0;
    let totalCorrectAnswers = 0;
    if (practiceSessions && practiceSessions.length > 0) {
      totalQuestionsSolved = practiceSessions.reduce((sum: number, s: any) => sum + (s.completedQuestions || 0), 0);
      totalCorrectAnswers = practiceSessions.reduce((sum: number, s: any) => sum + (s.correctAnswers || 0), 0);
    }

    const practiceAccuracyPercent =
      totalQuestionsSolved > 0 ? Math.round((totalCorrectAnswers / totalQuestionsSolved) * 100) : 0;

    const topicsMasteredCount = (masteryList || []).filter((m: any) => (m.masteryScore || 0) >= 80).length;
    const completedGoalsCount = (goals || []).filter((g: any) => g.status === 'completed').length;
    const practiceStreakDays = Math.min(30, practiceSessions?.length || 0);
    const overallMasteryPercent = learningProfile?.overallMastery ?? 50;

    const ctx: StudentStatsContext = {
      studentId,
      totalQuestionsSolved,
      practiceSessionsCount: practiceSessions?.length || 0,
      practiceStreakDays,
      topicsMasteredCount,
      overallMasteryPercent,
      practiceAccuracyPercent,
      completedGoalsCount,
      studyPlanCompletedTasks: 0,
    };

    // 2. Evaluate Eligible Achievements
    const eligibleList = AchievementRulesEngine.evaluateEligibleAchievements(ctx);
    const grantedList: any[] = [];

    // 3. Idempotently Grant Achievements
    for (const achDef of eligibleList) {
      const granted = await dataRepository.grantAchievementIdempotent({
        studentId,
        achievementType: achDef.achievementType,
        title: achDef.title,
        description: achDef.description,
        icon: achDef.icon,
        evidenceType: 'learning_activity',
        evidenceId: `${studentId}_${achDef.achievementType}`,
      });
      if (granted) {
        grantedList.push(granted);
      }
    }

    return grantedList;
  }
}
