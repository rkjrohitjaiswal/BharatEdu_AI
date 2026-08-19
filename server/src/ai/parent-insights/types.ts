export type ParentProgressTrend = 'improving' | 'stable' | 'needs_attention';

export interface SubjectProgressSummary {
  subjectId: string;
  subjectName: string;
  masteryScore: number;
  totalTopics: number;
  masteredTopics: number;
}

export interface ParentOverviewPayload {
  student: {
    id: string;
    name: string;
    classLevel: number;
    preferredLanguage: string;
  };
  overallMastery: number;
  progressTrend: {
    trend: ParentProgressTrend;
    score: number; // 0-100
    explanation: string;
  };
  practiceStreak: number;
  totalPracticeTimeMinutes: number;
  subjectPerformance: SubjectProgressSummary[];
  recentActivity: {
    title: string;
    timestamp: string;
    status: 'completed' | 'in_progress';
  }[];
  activeGapsSummary: {
    subjectName: string;
    gapCount: number;
    description: string;
  }[];
  studyPlanProgress: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  };
  scholarshipOpportunitiesCount: number;
  aiLearningSummary: {
    summary: string;
    encouragement: string;
    suggestions: string[];
    aiEnhanced: boolean;
  };
}
