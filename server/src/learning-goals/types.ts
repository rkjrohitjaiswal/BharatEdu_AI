export interface CreateGoalInput {
  title: string;
  description?: string;
  goalType: 'mastery' | 'practice_questions' | 'practice_accuracy' | 'study_minutes' | 'study_streak' | 'topic_completion' | 'custom';
  targetValue: number;
  unit?: string;
  targetDate: Date | string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  targetValue?: number;
  unit?: string;
  targetDate?: Date | string;
}
