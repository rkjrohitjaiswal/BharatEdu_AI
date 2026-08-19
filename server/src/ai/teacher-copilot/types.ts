export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface IExplainableRecommendation {
  priority: PriorityLevel;
  reason: string;
  evidence: string;
  action: string;
  targetUrl?: string;
}

export interface IWeeklyPlanDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  task: string;
  focusTopic: string;
}

export interface TeacherCopilotStudentSnapshot {
  studentId: string;
  studentName: string;
  className?: string;
  overallMastery: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskTrend: 'improving' | 'stable' | 'worsening';
  riskReasons: string[];
  practiceAccuracy: number;
  studyConsistency: number; // adherence %
  examReadiness?: number;
  careerSkillProgress?: number;
  topLearningGaps: Array<{ topicId: string; topicName: string; severity: string }>;
  repeatedMistakes: Array<{ questionId: string; topicId: string; mistakeCount: number; concept: string }>;
  recentPracticePerformance: { totalSessions: number; questionsAttempted: number; accuracy: number };
  studyPlanProgress: { completedTasks: number; totalTasks: number; adherence: number };
  goalProgress: { activeGoals: number; completedGoals: number };
  strengths: string[];
  areasRequiringAttention: string[];
  evaluatedAt: string;
}

export interface TeacherCopilotAdvice {
  studentId: string;
  studentName: string;
  recommendedIntervention: string;
  recommendedPracticeTopics: string[];
  recommendedRemediationActions: IExplainableRecommendation[];
  weeklyActionPlan: IWeeklyPlanDay[];
  aiGenerated: boolean;
  evaluatedAt: string;
}

export interface TeacherParentMessageDraft {
  studentId: string;
  studentName: string;
  subject: string;
  body: string;
  disclaimer: string;
  aiGenerated: boolean;
  generatedAt: string;
}

export type ParentMessageDraft = TeacherParentMessageDraft;
