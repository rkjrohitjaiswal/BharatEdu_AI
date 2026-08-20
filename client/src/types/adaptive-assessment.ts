export type AssessmentType =
  | 'diagnostic'
  | 'topic_check'
  | 'mastery_check'
  | 'exam_simulation'
  | 'revision_test'
  | 'learning_path_check'
  | 'doubt_followup'
  | 'custom';

export type AssessmentDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced';
export type QuestionType = 'mcq' | 'multiple_select' | 'true_false' | 'numerical' | 'short_answer' | 'coding';

export interface IAssessmentQuestionClient {
  id: string;
  questionId: string;
  assessmentId: string;
  sequence: number;
  subject: string;
  topicId: string;
  conceptId: string;
  difficulty: AssessmentDifficulty;
  questionType: QuestionType;
  question: string;
  options?: string[];
  marks: number;
  timeLimitSeconds: number;
  status: string;
}

export interface IAssessmentQuestionReview extends IAssessmentQuestionClient {
  correctAnswer: string;
  submittedAnswer?: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  feedback?: string;
}

export interface IAdaptiveAssessment {
  id: string;
  assessmentId: string;
  studentId: string;
  title: string;
  subject: string;
  classLevel: string;
  board: string;
  assessmentType: AssessmentType;
  targetConceptId?: string;
  difficulty: AssessmentDifficulty;
  questionCount: number;
  timeLimitMinutes: number;
  status: string;
  currentQuestionIndex: number;
  score: number;
  accuracy: number;
  masteryImpact: number;
  currentQuestion?: IAssessmentQuestionClient;
  createdAt: string;
  updatedAt: string;
}

export interface IAssessmentResults {
  assessmentId: string;
  studentId: string;
  title: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  completionRate: number;
  masteryImpact: number;
  topicPerformance: { topicId: string; topicName: string; accuracy: number }[];
  conceptPerformance: { conceptId: string; conceptName: string; accuracy: number }[];
  difficultyPerformance: { difficulty: string; accuracy: number }[];
  stoppingReason?: string;
  aiExplanation?: string;
  evaluatedAt: string;
}
