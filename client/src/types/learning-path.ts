export type TaskType =
  | 'learn'
  | 'practice'
  | 'revise'
  | 'assessment'
  | 'resource'
  | 'remediation'
  | 'exam_prep';

export type TaskStatus = 'pending' | 'active' | 'completed' | 'skipped';
export type StageStatus = 'locked' | 'available' | 'active' | 'completed' | 'skipped';
export type StagePriority = 'critical' | 'high' | 'medium' | 'low';
export type StudentLearningLevel = 'foundation' | 'developing' | 'intermediate' | 'advanced' | 'mastery';

export interface ILearningPathTaskDTO {
  id: string;
  stageId: string;
  learningPathId: string;
  studentId: string;
  taskType: TaskType;
  title: string;
  description: string;
  conceptId: string;
  topicId: string;
  resourceId?: string;
  estimatedMinutes: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  scheduledDate?: string;
  status: TaskStatus;
  completedAt?: string;
  actionUrl: string;
  reason: string;
}

export interface ILearningPathStageDTO {
  id: string;
  learningPathId: string;
  studentId: string;
  stageIndex: number;
  title: string;
  description: string;
  subject: string;
  conceptIds: string[];
  topicIds: string[];
  prerequisiteConceptIds: string[];
  estimatedMinutes: number;
  priority: StagePriority;
  status: StageStatus;
  masteryRequired: number;
  currentMastery: number;
  tasks: ILearningPathTaskDTO[];
}

export interface ILearningPathDTO {
  id: string;
  studentId: string;
  title: string;
  description: string;
  board: string;
  classLevel: string;
  targetType: string;
  targetId?: string;
  targetName?: string;
  startDate: string;
  targetDate?: string;
  status: string;
  progressPercent: number;
  currentStage: number;
  totalStages: number;
  completedStages: number;
  estimatedTotalMinutes: number;
  dailyMinutes: number;
  weeklyMinutes: number;
  learningLevel: StudentLearningLevel;
  learningLevelScore: number;
  nextBestConcept?: {
    conceptId: string;
    conceptName: string;
    subject: string;
    reason: string;
    actionUrl: string;
  };
  stages: ILearningPathStageDTO[];
}
