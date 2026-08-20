export interface ExamPreparationProfile {
  studentId: string;
  examId: string;
  examName: string;
  board: string;
  classLevel: number;
  subject: string;
  targetExamDate: Date;
  targetScore: number;
  availableDailyMinutes: number;
}

export interface ExamReadinessSnapshot {
  readinessScore: number; // 0 - 100
  status: 'critical' | 'needs_improvement' | 'on_track' | 'exam_ready';
  conceptMasteryPct: number;
  topicCoveragePct: number;
  practiceAccuracyPct: number;
  mockPerformancePct: number;
  revisionCompletionPct: number;
  daysRemaining: number;
}

export interface ExamPriority {
  conceptId: string;
  subject: string;
  topic: string;
  priorityRank: number;
  reason: string;
  weightage: number;
  masteryPct: number;
  isPrerequisiteGap: boolean;
  isHighRisk: boolean;
}

export interface ExamPreparationTask {
  taskId: string;
  conceptId: string;
  topic: string;
  activityType: 'concept_study' | 'prerequisite_repair' | 'practice' | 'revision' | 'mock_test' | 'doubt_solve' | 'resource_study';
  durationMinutes: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  actionUrl: string;
  prerequisiteStatus: 'met' | 'unmet';
}

export interface ExamStudyDay {
  date: string; // YYYY-MM-DD
  dayTitle: string; // e.g. "Today", "Exam Eve"
  totalMinutes: number;
  tasks: ExamPreparationTask[];
}

export interface ExamStudyWeek {
  weekNumber: number;
  title: string;
  days: ExamStudyDay[];
}

export interface MockExamPlan {
  mockType: 'diagnostic' | 'sectional' | 'full_length' | 'weak_topic' | 'final_simulation';
  recommendedDate: Date;
  targetTopics: string[];
  difficultyComposition: { easy: number; medium: number; hard: number };
  durationMinutes: number;
  totalQuestions: number;
  reason: string;
}

export interface ExamStrategy {
  questionOrdering: string[];
  sectionTimeAllocation: Record<string, number>;
  skipStrategy: string;
  reviewStrategy: string;
  confidenceManagement: string;
  finalCheckMinutes: number;
}

export interface ExamRisk {
  riskId: string;
  riskType: 'coverage' | 'weak_concept' | 'low_accuracy' | 'revision_lag' | 'mock_shortage' | 'consistency' | 'proximity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  mitigationAction: string;
}

export interface ExamRecommendation {
  recommendationId: string;
  type: 'concept' | 'prerequisite' | 'practice' | 'revision' | 'mock' | 'doubt' | 'resource';
  title: string;
  description: string;
  impactScore: number; // 0 - 100
  actionUrl: string;
}

export interface ExamPrediction {
  expectedScoreRange: { min: number; max: number };
  readinessPercentage: number;
  disclaimer: string;
  improvementPath: string[];
}

export interface ExamPreparationSummary {
  profile: ExamPreparationProfile;
  readiness: ExamReadinessSnapshot;
  timeRemaining: {
    days: number;
    weeks: number;
    availableMinutes: number;
    requiredMinutes: number;
    coveragePct: number;
  };
  topPriorities: ExamPriority[];
  todayPlan: ExamStudyDay;
  weeklyPlan: ExamStudyWeek;
  gaps: any[];
  risks: ExamRisk[];
  recommendations: ExamRecommendation[];
  prediction: ExamPrediction;
  mockHistory: any[];
}
