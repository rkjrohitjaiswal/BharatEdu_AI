export interface ClassroomSnapshot {
  teacherId: string;
  classId: string;
  date: string;
  mastery: number;
  practiceAccuracy: number;
  assessmentScore: number;
  examReadiness: number;
  riskScore: number;
  consistency: number;
  completionRate: number;
  engagement: number;
  learningVelocity: number;
}

export interface StudentClassProfile {
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
}

export interface ClassPerformance {
  averageMastery: number;
  averagePracticeAccuracy: number;
  averageAssessmentScore: number;
  averageExamReadiness: number;
  averageConsistency: number;
  averageCompletion: number;
  averageRisk: number;
  engagementScore: number;
  learningVelocity: number;
}

export interface SubjectPerformance {
  subject: string;
  averageMastery: number;
  averagePracticeAccuracy: number;
  averageAssessmentScore: number;
  riskScore: number;
  completionRate: number;
  learningVelocity: number;
  status: 'strongest' | 'stable' | 'needs_attention' | 'critical';
}

export interface TopicPerformance {
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
}

export interface ConceptPerformance {
  conceptId: string;
  conceptName: string;
  topicId: string;
  mastery: number;
  accuracy: number;
  studentCountStruggling: number;
  isPrerequisiteIssue: boolean;
  prerequisiteConcepts: string[];
}

export interface RiskDistribution {
  low: { count: number; percentage: number };
  moderate: { count: number; percentage: number };
  high: { count: number; percentage: number };
  critical: { count: number; percentage: number };
}

export interface MasteryDistribution {
  range0_25: { count: number; percentage: number };
  range26_50: { count: number; percentage: number };
  range51_75: { count: number; percentage: number };
  range76_100: { count: number; percentage: number };
}

export interface AssessmentDistribution {
  range0_40: { count: number; percentage: number };
  range41_60: { count: number; percentage: number };
  range61_80: { count: number; percentage: number };
  range81_100: { count: number; percentage: number };
}

export interface EngagementSummary {
  studyActivity: number;
  practiceActivity: number;
  assignmentCompletion: number;
  revisionActivity: number;
  sessionConsistency: number;
  recentActivity: number;
}

export interface LearningVelocity {
  currentRate: number;
  trend: 'accelerating' | 'steady' | 'slowing' | 'stalled';
  historicalValues: { date: string; velocity: number }[];
}

export interface ClassroomLearningGap {
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
}

export interface ClassroomMisconception {
  misconceptionId: string;
  tag: string;
  description: string;
  conceptId: string;
  studentCount: number;
  sources: ('practice' | 'assessment' | 'doubt' | 'mistake')[];
  severity: 'high' | 'medium' | 'low';
}

export interface InterventionRecommendation {
  interventionId: string;
  classId: string;
  teacherId: string;
  studentId?: string;
  studentName?: string;
  interventionType: 'prerequisite_revision' | 'small_group_practice' | 'targeted_assignment' | 'doubt_solving_session' | 'revision_activity' | 'concept_explanation' | 'additional_resource' | 'exam_preparation' | 'personalized_learning_path' | 'study_planner_task';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  evidence: string[];
  recommendedActions: string[];
  targetConcepts: string[];
  status: 'suggested' | 'planned' | 'active' | 'completed' | 'dismissed';
  createdAt: string;
  completedAt?: string;
  teacherNotes?: string;
  beforeMetrics?: { mastery: number; accuracy: number; assessmentScore: number; riskScore: number };
  afterMetrics?: { mastery: number; accuracy: number; assessmentScore: number; riskScore: number };
}

export interface ClassroomInsight {
  headline: string;
  summary: string;
  keyObservations: string[];
  recommendedFocus: string[];
  generatedByAI: boolean;
}

export interface TeacherActionPlan {
  todayPriorities: string[];
  thisWeekPriorities: string[];
  studentsNeedingAttention: { studentId: string; studentName?: string; reason: string; priority: string }[];
  topicsNeedingIntervention: { topicId: string; topicName: string; reason: string }[];
  recommendedClassActivity: string;
  recommendedSmallGroupActivity: string;
  recommendedAssessment: string;
}
