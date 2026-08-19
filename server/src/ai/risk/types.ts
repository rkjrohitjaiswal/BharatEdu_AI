export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type RiskTrend = 'improving' | 'stable' | 'worsening';

export interface IRiskRecoveryAction {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl: string;
}

export interface StudentRiskMetricsBreakdown {
  overallMastery: number;
  practiceAccuracy: number;
  activeGapsCount: number;
  criticalGapsCount: number;
  unreviewedMistakesCount: number;
  planAdherencePercentage: number;
  upcomingExamsCount: number;
}

export interface StudentRiskProfileData {
  studentId: string;
  studentName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  riskTrend: RiskTrend;
  contributingFactors: string[];
  recommendedActions: IRiskRecoveryAction[];
  metricsBreakdown: StudentRiskMetricsBreakdown;
  aiExplanation: {
    text: string;
    aiEnhanced: boolean;
  };
  evaluatedAt: string;
}

export interface TeacherAtRiskAnalyticsData {
  totalStudents: number;
  atRiskCount: number;
  criticalCount: number;
  highCount: number;
  atRiskStudents: StudentRiskProfileData[];
  classSummary: {
    text: string;
    aiEnhanced: boolean;
  };
  evaluatedAt: string;
}

export interface ParentSafeRiskSummaryData {
  studentId: string;
  studentName: string;
  riskLevel: RiskLevel;
  riskTrend: RiskTrend;
  summaryText: {
    text: string;
    aiEnhanced: boolean;
  };
  recommendedSupportActions: string[];
  evaluatedAt: string;
}
