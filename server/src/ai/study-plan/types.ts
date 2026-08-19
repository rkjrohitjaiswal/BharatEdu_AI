/**
 * TypeScript Interfaces for AI-Powered Study Plan Generator
 */

export type StudyPlanDuration = 'daily' | 'weekly';

export interface StudyPlanGenerateOptions {
  dailyStudyMinutes?: number;
  planDuration?: StudyPlanDuration;
  preferredLanguage?: 'english' | 'hindi' | 'gujarati';
}

export type TaskActivityType = 'learn' | 'practice' | 'review' | 'revision' | 'tutor';

export interface PrioritizedTopicItem {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  priorityScore: number;
  priorityLevel: 'critical' | 'high' | 'medium' | 'low';
  activityType: TaskActivityType;
  suggestedMinutes: number;
  reason: string;
  gapSeverity?: string;
  masteryScore?: number;
}

export interface GeneratedStudyTaskPayload {
  topicId: string;
  title: string;
  taskType: TaskActivityType;
  estimatedMinutes: number;
  scheduledDate?: Date;
  completed: boolean;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface GeneratedStudyPlanPayload {
  title: string;
  description: string;
  targetDate?: Date;
  goals: string[];
  tasks: GeneratedStudyTaskPayload[];
  status: 'active' | 'completed' | 'archived';
  metadata: {
    totalEstimatedMinutes: number;
    dailyMinutesLimit: number;
    duration: StudyPlanDuration;
    generatedAt: Date;
    aiEnriched: boolean;
  };
}
