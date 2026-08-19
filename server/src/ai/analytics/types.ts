export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface SubjectMasteryBreakdown {
  subjectId: string;
  subjectName: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface TopicMasteryBreakdown {
  topicId: string;
  topicName: string;
  score: number;
  status: string;
}

export interface ExamProgressionItem {
  examId: string;
  title: string;
  daysLeft: number;
  readinessScore: number;
  readinessLevel: string;
}

export interface CareerProgressionItem {
  goalId: string;
  targetRole: string;
  readiness: number;
  topSkill: string;
  topSkillScore: number;
}

export interface StudentAnalyticsOverview {
  overallMastery: number;
  masteryTrend: 'improving' | 'stable' | 'declining';
  subjectMastery: SubjectMasteryBreakdown[];
  topicMastery: TopicMasteryBreakdown[];
  practiceAccuracy: number;
  totalPracticeSessions: number;
  totalQuestionsAttempted: number;
  studyTimeMinutes: number;
  learningGaps: {
    total: number;
    active: number;
    resolved: number;
    critical: number;
    resolutionRate: number;
  };
  studyPlanAdherence: {
    completedTasks: number;
    totalTasks: number;
    adherencePercentage: number;
  };
  goalsAndAchievements: {
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    unlockedAchievements: number;
  };
  examReadinessProgression: ExamProgressionItem[];
  careerSkillProgression: CareerProgressionItem[];
  riskIndicators: {
    riskLevel: RiskLevel;
    riskFactors: string[];
  };
  weeklySummary: {
    text: string;
    aiEnhanced: boolean;
  };
  generatedAt: string;
}

export interface StudentRiskProfile {
  studentId: string;
  name: string;
  mastery: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
}

export interface TeacherClassAnalytics {
  totalStudents: number;
  averageMastery: number;
  averageAccuracy: number;
  improvingStudents: Array<{ studentId: string; name: string; mastery: number; change: number }>;
  strugglingStudents: StudentRiskProfile[];
  interventionEffectiveness: {
    totalAssigned: number;
    completed: number;
    effectivenessRate: number;
  };
  weeklySummary: {
    text: string;
    aiEnhanced: boolean;
  };
  generatedAt: string;
}

export interface ParentSafeProgressSummary {
  studentId: string;
  studentName: string;
  overallMastery: number;
  studyTimeMinutes: number;
  activeGapsCount: number;
  goalProgressPercentage: number;
  riskLevel: RiskLevel;
  highlights: string[];
  weeklySummary: {
    text: string;
    aiEnhanced: boolean;
  };
  generatedAt: string;
}
