export type UserRole = 'student' | 'teacher' | 'parent';
export type PreferredLanguage = 'english' | 'hindi' | 'gujarati';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage: PreferredLanguage;
  profileImage?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  preferredLanguage: PreferredLanguage;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
}

export interface Subject {
  _id: string;
  id?: string;
  name: string;
  code: string;
  description: string;
  classLevels: number[];
  language: PreferredLanguage;
}

export interface Topic {
  _id: string;
  id?: string;
  subjectId: string | Subject;
  name: string;
  description: string;
  classLevel: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  parentTopicId?: string;
  prerequisiteTopicIds?: string[];
  learningObjectives: string[];
  estimatedLearningMinutes: number;
}

export interface Scholarship {
  _id: string;
  id?: string;
  name: string;
  provider: string;
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationUrl: string;
  deadline?: string;
  educationLevels: string[];
  locations: string[];
  incomeCriteria: string;
  categoryCriteria: string[];
  status: 'active' | 'closed' | 'upcoming' | 'expired';
  source: 'official' | 'ai_aggregated';
  legalDisclaimer?: string;
}

export interface StudentProfileData {
  classLevel: number;
  educationBoard: string;
  schoolName: string;
  preferredLanguage: PreferredLanguage;
  currentStreak: number;
  totalLearningMinutes: number;
}

export interface StudentLearningProfile {
  overallMastery: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  learningGoals: string[];
  recommendedTopics: Topic[];
  currentLearningPath: Topic[];
  lastAssessmentDate?: string;
}

export interface TopicMasteryItem {
  _id: string;
  topicId: Topic | string;
  masteryScore: number;
  confidenceScore: number;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  status: 'not_started' | 'learning' | 'needs_review' | 'mastered';
}

export interface LearningGapItem {
  _id: string;
  topicId: Topic | string;
  gapType: 'knowledge_gap' | 'prerequisite_gap' | 'misconception' | 'practice_gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  evidence: string;
  status: 'active' | 'improving' | 'resolved';
  detectedAt: string;
}

export interface EngagementEventItem {
  _id: string;
  eventType: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface StudyPlanTask {
  _id: string;
  id?: string;
  topicId: Topic | string;
  title: string;
  taskType: string;
  estimatedMinutes: number;
  scheduledDate?: string;
  completed: boolean;
  completedAt?: string;
}

export interface StudyPlanData {
  _id: string;
  title: string;
  description: string;
  targetDate?: string;
  goals: string[];
  tasks: StudyPlanTask[];
  status: 'active' | 'completed' | 'archived';
}

export interface SubjectPerformanceItem {
  subjectId: string;
  name: string;
  code: string;
  masteryScore: number;
  topicsAttempted: number;
}

export interface ScholarshipMatchItem {
  _id: string;
  scholarshipId: Scholarship | string;
  matchScore: number;
  matchedCriteria: string[];
  unmetCriteria: string[];
  unknownCriteria?: string[];
  confidence: number;
  status: string;
}

export interface StudentDashboardData {
  studentProfile: StudentProfileData;
  learningProfile: StudentLearningProfile;
  stats: {
    masteredTopicsCount: number;
    needsReviewTopicsCount: number;
    activeGapsCount: number;
    currentStreak?: number;
  };
  mastery: TopicMasteryItem[];
  learningGaps: LearningGapItem[];
  recentActivity: EngagementEventItem[];
  goals?: any[];
  achievementSummary?: any;
  exams?: any[];
  studyPlan: StudyPlanData | null;
  scholarshipMatches: ScholarshipMatchItem[];
  subjectPerformance: SubjectPerformanceItem[];
}

export interface SourceCitationItem {
  title: string;
  sourceUrl?: string;
  documentId?: string;
  page?: number;
  section?: string;
  publisher?: string;
}

export interface TutorMessageItem {
  _id?: string;
  id?: string;
  role: 'student' | 'tutor';
  content: string;
  timestamp: string;
  sources?: SourceCitationItem[];
  metadata?: Record<string, any>;
}

export interface ConversationItem {
  _id: string;
  id?: string;
  studentId: string;
  title: string;
  subjectId?: Subject | string;
  topicId?: Topic | string;
  language: PreferredLanguage;
  messages: TutorMessageItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherClassItem {
  _id: string;
  name: string;
  classLevel: number;
  section: string;
  academicYear: string;
  studentIds: any[];
  subjectIds: any[];
}

export interface TeacherAnalyticsOverview {
  totalClasses: number;
  totalActiveGaps: number;
  recentActivityCount: number;
}

export interface PracticeQuestionItem {
  _id?: string;
  questionId?: string;
  questionText: string;
  questionType: 'mcq' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  learningObjective?: string;
  presentedAt?: string;
  answeredAt?: string;
  studentAnswer?: string;
  isCorrect?: boolean;
  score?: number;
  timeSpentSeconds?: number;
  confidence?: number;
  feedback?: string;
  sources?: SourceCitationItem[];
}

export interface PracticeSessionItem {
  _id: string;
  studentId: string;
  subjectId: Subject | string;
  topicId: Topic | string;
  learningGapId?: string;
  questions: PracticeQuestionItem[];
  currentQuestionIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  score: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeRecommendationItem {
  topicId: string;
  topicName: string;
  subjectName: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
  estimatedQuestions: number;
  learningGapId?: string;
}

// --- PHASE 8 SCHOLARSHIP INTELLIGENCE TYPES ---
export interface StudentScholarshipProfileData {
  _id?: string;
  studentId: string;
  educationLevel: string;
  classLevel: number;
  board: string;
  state: string;
  district?: string;
  annualFamilyIncome?: number;
  category?: string;
  academicPercentage?: number;
  institutionType?: string;
  gender?: string;
  disabilityStatus?: boolean;
  lastUpdatedAt?: string;
}

export interface ScholarshipMatchResultItem {
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  matchScore: number;
  confidence: number;
  status: 'potential_match' | 'needs_information' | 'likely_not_match' | 'expired';
  matchedCriteria: string[];
  unmetCriteria: string[];
  unknownCriteria: string[];
  explanation: string;
  deadline?: string;
  officialSourceUrl?: string;
  applicationUrl?: string;
  requiredDocuments: string[];
}
