export type ParentPriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface IParentRecommendation {
  priority: ParentPriorityLevel;
  reason: string;
  evidence: string;
  parentAction: string;
  targetUrl?: string;
}

export interface IParentWeeklyPlanDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  activity: string;
  focusTopic: string;
}

export interface ParentCopilotStudentSnapshot {
  studentId: string;
  studentName: string;
  overallMastery: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskTrend: 'improving' | 'stable' | 'worsening';
  riskReasons: string[];
  practiceAccuracy: number;
  studyConsistency: number; // study plan completion adherence %
  examReadiness?: number;
  examCountdownDays?: number;
  topLearningGaps: Array<{ topicId: string; topicName: string; severity: string }>;
  repeatedMistakes: Array<{ questionId: string; topicId: string; mistakeCount: number; concept: string }>;
  recentPracticePerformance: { totalSessions: number; questionsAttempted: number; accuracy: number };
  studyPlanProgress: { completedTasks: number; totalTasks: number; adherence: number };
  goalProgress: { activeGoals: number; completedGoals: number };
  achievements: Array<{ title: string; category: string }>;
  teacherInterventions: Array<{ topic: string; priority: string; dueDate?: string; isCompleted: boolean }>;
  scholarships: Array<{ title: string; status: string; url?: string }>;
  strengths: string[];
  areasRequiringAttention: string[];
  evaluatedAt: string;
}

export interface ParentCopilotAdvice {
  studentId: string;
  studentName: string;
  parentFriendlyExplanation: string;
  recommendedHomeSupportActions: IParentRecommendation[];
  weeklySupportPlan: IParentWeeklyPlanDay[];
  aiGenerated: boolean;
  evaluatedAt: string;
}
