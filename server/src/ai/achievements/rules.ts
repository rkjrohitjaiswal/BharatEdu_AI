import { AchievementDefinition, StudentStatsContext } from './types.js';

export const SYSTEM_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    achievementType: 'first_practice',
    title: 'First Step to Mastery',
    description: 'Completed your very first practice session on BharatEdu AI!',
    icon: 'zap',
    category: 'practice',
  },
  {
    achievementType: 'questions_10',
    title: 'Question Explorer',
    description: 'Solved 10 practice questions successfully.',
    icon: 'help-circle',
    category: 'practice',
  },
  {
    achievementType: 'questions_50',
    title: 'Knowledge Builder',
    description: 'Solved 50 practice questions across your subjects.',
    icon: 'book-open',
    category: 'practice',
  },
  {
    achievementType: 'questions_100',
    title: 'Century Scholar',
    description: 'Solved 100 practice questions on BharatEdu AI!',
    icon: 'award',
    category: 'practice',
  },
  {
    achievementType: 'streak_7',
    title: 'Week-long Warrior',
    description: 'Maintained a 7-day consecutive practice streak!',
    icon: 'flame',
    category: 'streak',
  },
  {
    achievementType: 'streak_14',
    title: 'Fortnight Focus',
    description: 'Maintained a 14-day consecutive practice streak!',
    icon: 'shield-check',
    category: 'streak',
  },
  {
    achievementType: 'streak_30',
    title: 'Monthly Champion',
    description: 'Achieved a legendary 30-day practice streak!',
    icon: 'crown',
    category: 'streak',
  },
  {
    achievementType: 'first_topic_mastered',
    title: 'Topic Conqueror',
    description: 'Achieved 80%+ mastery on your first curriculum topic!',
    icon: 'check-circle-2',
    category: 'mastery',
  },
  {
    achievementType: 'topics_5_mastered',
    title: 'Curriculum Leader',
    description: 'Mastered 5 topics in your grade curriculum.',
    icon: 'star',
    category: 'mastery',
  },
  {
    achievementType: 'subject_mastery_80',
    title: 'Subject Specialist',
    description: 'Reached 80% overall subject mastery level!',
    icon: 'trending-up',
    category: 'mastery',
  },
  {
    achievementType: 'accuracy_90',
    title: 'Sharpshooter',
    description: 'Achieved 90%+ overall practice accuracy.',
    icon: 'target',
    category: 'accuracy',
  },
  {
    achievementType: 'goal_completed',
    title: 'Goal Setter & Getter',
    description: 'Successfully completed your first personalized learning goal!',
    icon: 'flag',
    category: 'goals',
  },
];

export class AchievementRulesEngine {
  public static evaluateEligibleAchievements(ctx: StudentStatsContext): AchievementDefinition[] {
    const eligible: AchievementDefinition[] = [];

    if (ctx.practiceSessionsCount >= 1 || ctx.totalQuestionsSolved >= 1) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'first_practice')!);
    }
    if (ctx.totalQuestionsSolved >= 10) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'questions_10')!);
    }
    if (ctx.totalQuestionsSolved >= 50) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'questions_50')!);
    }
    if (ctx.totalQuestionsSolved >= 100) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'questions_100')!);
    }
    if (ctx.practiceStreakDays >= 7) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'streak_7')!);
    }
    if (ctx.practiceStreakDays >= 14) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'streak_14')!);
    }
    if (ctx.practiceStreakDays >= 30) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'streak_30')!);
    }
    if (ctx.topicsMasteredCount >= 1) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'first_topic_mastered')!);
    }
    if (ctx.topicsMasteredCount >= 5) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'topics_5_mastered')!);
    }
    if (ctx.overallMasteryPercent >= 80) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'subject_mastery_80')!);
    }
    if (ctx.practiceAccuracyPercent >= 90) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'accuracy_90')!);
    }
    if (ctx.completedGoalsCount >= 1) {
      eligible.push(SYSTEM_ACHIEVEMENTS.find((a) => a.achievementType === 'goal_completed')!);
    }

    return eligible.filter(Boolean);
  }
}
