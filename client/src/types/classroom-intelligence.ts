export interface IClassroomIntelligenceClient {
  classIntelligence: {
    teacherId: string;
    classId: string;
    className: string;
    subject: string;
    classLevel: string;
    board: string;
    studentCount: number;
    activeStudentCount: number;
    averageMastery: number;
    averagePracticeAccuracy: number;
    averageAssessmentScore: number;
    averageExamReadiness: number;
    averageRiskScore: number;
    averageConsistency: number;
    completionRate: number;
    engagementScore: number;
    learningVelocity: number;
    interventionCount: number;
  };
  performance: {
    averageMastery: number;
    averagePracticeAccuracy: number;
    averageAssessmentScore: number;
    averageExamReadiness: number;
    averageConsistency: number;
    averageCompletion: number;
    averageRisk: number;
    engagementScore: number;
    learningVelocity: number;
  };
  studentProfiles: {
    classId: string;
    teacherId: string;
    studentId: string;
    studentName?: string;
    masteryScore: number;
    practiceAccuracy: number;
    assessmentAverage: number;
    examReadiness: number;
    riskScore: number;
    consistencyScore: number;
    completionRate: number;
    engagementScore: number;
    learningVelocity: number;
    strongestSubjects: string[];
    weakestSubjects: string[];
    topLearningGaps: string[];
    misconceptionCount: number;
    interventionPriority: 'critical' | 'high' | 'medium' | 'low';
    lastActiveAt: string;
  }[];
  riskDistribution: {
    low: { count: number; percentage: number };
    moderate: { count: number; percentage: number };
    high: { count: number; percentage: number };
    critical: { count: number; percentage: number };
  };
  masteryDistribution: {
    range0_25: { count: number; percentage: number };
    range26_50: { count: number; percentage: number };
    range51_75: { count: number; percentage: number };
    range76_100: { count: number; percentage: number };
  };
  assessmentDistribution: {
    range0_40: { count: number; percentage: number };
    range41_60: { count: number; percentage: number };
    range61_80: { count: number; percentage: number };
    range81_100: { count: number; percentage: number };
  };
  subjects: {
    subject: string;
    averageMastery: number;
    averagePracticeAccuracy: number;
    averageAssessmentScore: number;
    riskScore: number;
    completionRate: number;
    learningVelocity: number;
    status: 'strongest' | 'stable' | 'needs_attention' | 'critical';
  }[];
  topics: {
    topicId: string;
    topicName: string;
    subject: string;
    studentCoverage: number;
    averageMastery: number;
    practiceAccuracy: number;
    assessmentPerformance: number;
    mistakeFrequency: number;
    misconceptionFrequency: number;
    riskContribution: number;
    category: 'weak' | 'strong' | 'polarized' | 'improving' | 'declining';
  }[];
  gaps: {
    gapId: string;
    conceptId: string;
    conceptName: string;
    subject: string;
    studentCount: number;
    affectedStudents: { studentId: string; studentName?: string; score: number }[];
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: 'common' | 'severe' | 'prerequisite' | 'persistent' | 'newly_emerging' | 'recovering';
    prerequisiteConcepts?: string[];
    examRelevanceScore: number;
  }[];
  misconceptions: {
    misconceptionId: string;
    tag: string;
    description: string;
    conceptId: string;
    studentCount: number;
    sources: ('practice' | 'assessment' | 'doubt' | 'mistake')[];
    severity: 'high' | 'medium' | 'low';
  }[];
  suggestedInterventions: {
    interventionId: string;
    classId: string;
    teacherId: string;
    studentId?: string;
    studentName?: string;
    interventionType: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    reason: string;
    evidence: string[];
    recommendedActions: string[];
    targetConcepts: string[];
    status: 'suggested' | 'planned' | 'active' | 'completed' | 'dismissed';
    createdAt: string;
  }[];
  actionPlan: {
    todayPriorities: string[];
    thisWeekPriorities: string[];
    studentsNeedingAttention: { studentId: string; studentName?: string; reason: string; priority: string }[];
    topicsNeedingIntervention: { topicId: string; topicName: string; reason: string }[];
    recommendedClassActivity: string;
    recommendedSmallGroupActivity: string;
    recommendedAssessment: string;
  };
  aiInsight: {
    headline: string;
    summary: string;
    keyObservations: string[];
    recommendedFocus: string[];
    generatedByAI: boolean;
  };
}
