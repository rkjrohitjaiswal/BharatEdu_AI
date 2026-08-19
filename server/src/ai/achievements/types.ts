export interface AchievementDefinition {
  achievementType: string;
  title: string;
  description: string;
  icon: string;
  category: 'practice' | 'streak' | 'mastery' | 'goals' | 'accuracy';
}

export interface StudentStatsContext {
  studentId: string;
  totalQuestionsSolved: number;
  practiceSessionsCount: number;
  practiceStreakDays: number;
  topicsMasteredCount: number;
  overallMasteryPercent: number;
  practiceAccuracyPercent: number;
  completedGoalsCount: number;
  studyPlanCompletedTasks: number;
}
