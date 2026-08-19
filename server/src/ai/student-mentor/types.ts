export type MentorPriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface IMentorTask {
  id: string;
  title: string;
  description: string;
  category: 'practice' | 'mistakes' | 'coach' | 'goals' | 'achievements' | 'exam' | 'career' | 'scholarships' | 'revision';
  priority: MentorPriorityLevel;
  estimatedMinutes: number;
  reason: string;
  actionUrl: '/practice' | '/mistakes' | '/learning-coach' | '/goals' | '/achievements' | '/exam-prep' | '/career' | '/scholarships';
  completed?: boolean;
}

export interface IMentorDailyPlan {
  morning: IMentorTask[];
  afternoon: IMentorTask[];
  evening: IMentorTask[];
  totalEstimatedMinutes: number;
  availableDailyMinutes: number;
}

export interface IMentorSuccessScoreBreakdown {
  plannedTasksScore: number; // max 30
  practiceActivityScore: number; // max 25
  studyMinutesScore: number; // max 20
  goalProgressScore: number; // max 15
  mistakeReviewScore: number; // max 10
  totalScore: number; // 0-100
  explanation: string;
}

export interface StudentMentorSnapshot {
  studentId: string;
  studentName: string;
  preferredLanguage: string;
  overallMastery: number;
  subjectMastery: Array<{ subject: string; score: number }>;
  topLearningGaps: Array<{ topicId: string; topicName: string; severity: string }>;
  recentMistakes: Array<{ questionId: string; concept: string; mistakeCount: number }>;
  practiceHistory: { totalSessions: number; questionsAttempted: number; accuracy: number; streakDays: number };
  studyPlanProgress: { totalTasks: number; completedTasks: number; adherence: number };
  todayStudyPlanTasks: Array<{ taskId: string; title: string; completed: boolean; durationMinutes: number }>;
  coachRecommendations: Array<{ category: string; text: string; timeMinutes: number }>;
  activeGoals: Array<{ goalId: string; title: string; progress: number; targetDate: string }>;
  achievementsCount: number;
  examStatus?: { title: string; readinessScore: number; daysRemaining: number; priorityTopics: string[] };
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: string[];
  recoveryActions: string[];
  careerRoadmap?: { targetRole: string; progressPercent: number };
  scholarshipCount: number;
  unreadNotificationCount: number;
  availableDailyMinutes: number;
  evaluatedAt: string;
}

export interface StudentMentorAdvice {
  greeting: string;
  topPriorityMessage: string;
  encouragingMessage: string;
  studyStrategy: string;
  motivationalGuidance: string;
  aiGenerated: boolean;
  evaluatedAt: string;
}

export interface StudentMentorSummary {
  studentName: string;
  successScore: number;
  topPriority: string;
  nextRecommendedAction: IMentorTask | null;
  recommendedStudyMinutes: number;
  encouragingMessage: string;
  evaluatedAt: string;
}
