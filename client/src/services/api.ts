import {
  HealthCheckResponse,
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  Subject,
  Topic,
  Scholarship,
  StudentLearningProfile,
  TopicMasteryItem,
  LearningGapItem,
  TeacherClassItem,
  TeacherAnalyticsOverview,
  StudentDashboardData,
  StudyPlanData,
  ConversationItem,
  PracticeSessionItem,
  PracticeRecommendationItem,
  PracticeQuestionItem,
  StudentScholarshipProfileData,
  ScholarshipMatchResultItem,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = (token?: string | null): HeadersInit => {
  const authToken = token || localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// Error handling helper for auth token expiration (401)
const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
  }
  return await response.json();
};

export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to reach API server' };
  }
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Registration network error' };
  }
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Login network error' };
  }
};

export const fetchCurrentUser = async (token?: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Authentication verification network error' };
  }
};

// --- PHASE 8 SCHOLARSHIP INTELLIGENCE APIs ---
export const fetchScholarshipById = async (
  id: string
): Promise<{ success: boolean; data?: Scholarship & { sources?: any[] }; legalDisclaimer?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships/${id}`);
    return await response.json();
  } catch (error) {
    return { success: false };
  }
};

export const fetchStudentScholarshipProfile = async (): Promise<{
  success: boolean;
  data?: StudentScholarshipProfileData;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/scholarships/profile`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

export const saveStudentScholarshipProfile = async (
  payload: Partial<StudentScholarshipProfileData>
): Promise<{ success: boolean; data?: StudentScholarshipProfileData; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/scholarships/profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to save scholarship profile' };
  }
};

export const fetchScholarshipMatches = async (): Promise<{
  success: boolean;
  data?: ScholarshipMatchResultItem[];
  legalDisclaimer?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/scholarships/matches`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

// --- PHASE 6B ADAPTIVE PRACTICE ENGINE APIs ---
export const createPracticeSession = async (payload: {
  subjectId?: string;
  topicId?: string;
  questionCount?: number;
}): Promise<{
  success: boolean;
  data?: {
    session: PracticeSessionItem;
    currentQuestion: PracticeQuestionItem;
    selectionReason?: string;
  };
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create adaptive practice session' };
  }
};

export const fetchPracticeSessions = async (): Promise<{ success: boolean; data?: PracticeSessionItem[]; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/sessions`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch practice sessions' };
  }
};

export const fetchPracticeSessionById = async (
  id: string
): Promise<{
  success: boolean;
  data?: PracticeSessionItem & { currentQuestion?: PracticeQuestionItem };
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/sessions/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch practice session' };
  }
};

export const submitPracticeAnswer = async (
  sessionId: string,
  payload: {
    questionIndex?: number;
    answer: string;
    confidence?: number;
    timeSpentSeconds?: number;
  }
): Promise<{
  success: boolean;
  data?: {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    feedback: string;
    sessionProgress: {
      completedQuestions: number;
      totalQuestions: number;
      currentScore: number;
      difficulty: string;
      isCompleted: boolean;
    };
    learningAnalysis?: any;
    nextQuestion?: PracticeQuestionItem | null;
  };
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/sessions/${sessionId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to submit practice answer' };
  }
};

export const completePracticeSession = async (
  sessionId: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to complete practice session' };
  }
};

export const fetchPracticeRecommendations = async (): Promise<{
  success: boolean;
  data?: PracticeRecommendationItem[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch practice recommendations' };
  }
};

// --- PHASE 6A LEARNING INTELLIGENCE APIs ---
export const analyzeLearningEvidence = async (payload: {
  topicId: string;
  evidenceId?: string;
  analysisType?: string;
  isCorrect: boolean;
  studentAnswer?: string;
}): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to analyze learning evidence' };
  }
};

export const resolveLearningGap = async (gapId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning/gaps/${gapId}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to resolve learning gap' };
  }
};

// --- PHASE 5A AI TUTOR API ---
export const createConversation = async (payload: {
  title?: string;
  subjectId?: string;
  topicId?: string;
  language?: string;
}): Promise<{ success: boolean; data?: ConversationItem; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutor/conversations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create conversation' };
  }
};

export const fetchConversations = async (): Promise<{ success: boolean; data?: ConversationItem[]; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutor/conversations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch conversations' };
  }
};

export const fetchConversationById = async (
  id: string
): Promise<{ success: boolean; data?: ConversationItem; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutor/conversations/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch conversation' };
  }
};

export const deleteConversation = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutor/conversations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to delete conversation' };
  }
};

export const sendTutorMessage = async (
  conversationId: string,
  payload: { content: string; subjectId?: string; topicId?: string; language?: string }
): Promise<{ success: boolean; data?: ConversationItem; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutor/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to send message' };
  }
};

// --- PHASE 4 STUDENT DASHBOARD API ---
export const fetchStudentDashboard = async (): Promise<{ success: boolean; data?: StudentDashboardData; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Network or server error loading dashboard' };
  }
};

export const updateStudyTaskStatus = async (taskId: string, completed: boolean): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-plan/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update task status' };
  }
};

// --- PHASE 3 STUDENT ENDPOINTS ---
export const fetchStudentLearningProfile = async (): Promise<{ success: boolean; data?: StudentLearningProfile }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-profile`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

export const fetchStudentMastery = async (): Promise<{ success: boolean; data?: TopicMasteryItem[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/mastery`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

export const fetchStudentLearningGaps = async (): Promise<{ success: boolean; data?: LearningGapItem[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-gaps`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

// --- PHASE 3 TEACHER ENDPOINTS ---
export const fetchTeacherClasses = async (): Promise<{ success: boolean; data?: TeacherClassItem[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/classes`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

export const fetchTeacherStudents = async (): Promise<{ success: boolean; data?: any[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/students`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

export const fetchTeacherAnalyticsOverview = async (): Promise<{ success: boolean; data?: TeacherAnalyticsOverview }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/analytics/overview`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false };
  }
};

// --- PUBLIC DOMAIN ENDPOINTS ---
export const fetchSubjects = async (): Promise<{ success: boolean; data?: Subject[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`);
    return await response.json();
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const fetchTopics = async (subjectId?: string, classLevel?: number): Promise<{ success: boolean; data?: Topic[] }> => {
  try {
    const query = new URLSearchParams();
    if (subjectId) query.append('subjectId', subjectId);
    if (classLevel) query.append('classLevel', String(classLevel));
    const response = await fetch(`${API_BASE_URL}/topics?${query.toString()}`);
    return await response.json();
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const fetchScholarships = async (): Promise<{ success: boolean; data?: Scholarship[]; legalDisclaimer?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships`);
    return await response.json();
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const generateStudyPlan = async (payload: {
  dailyStudyMinutes?: number;
  planDuration?: 'daily' | 'weekly';
  preferredLanguage?: string;
}): Promise<{ success: boolean; data?: StudyPlanData; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-plan/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate study plan' };
  }
};

export const fetchCurrentStudyPlan = async (): Promise<{
  success: boolean;
  data?: StudyPlanData | null;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-plan/current`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch current study plan' };
  }
};

export const fetchStudentMistakes = async (
  limit: number = 20
): Promise<{ success: boolean; data?: any[]; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/mistakes?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student mistakes' };
  }
};

export const fetchMistakeDetails = async (
  attemptId: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/mistakes/${attemptId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch mistake details' };
  }
};

export const fetchPracticeHistory = async (params: {
  page?: number;
  limit?: number;
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
} = {}): Promise<{ success: boolean; data?: { items: any[]; pagination: any }; message?: string }> => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.subjectId) query.append('subjectId', params.subjectId);
    if (params.topicId) query.append('topicId', params.topicId);
    if (params.difficulty) query.append('difficulty', params.difficulty);

    const response = await fetch(`${API_BASE_URL}/student/practice/history?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch practice history' };
  }
};

export const fetchPracticeHistorySummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/history/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch practice history summary' };
  }
};

export const fetchPracticeHistorySessionDetails = async (
  sessionId: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/practice/history/${sessionId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch practice session details' };
  }
};

// --- TEACHER INTERVENTIONS ---
export const createTeacherIntervention = async (payload: {
  studentId: string;
  classId?: string;
  subjectId?: string;
  topicId?: string;
  type: string;
  title: string;
  instructions: string;
  teacherNote?: string;
  priority: string;
  dueDate?: string;
}): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/interventions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create intervention' };
  }
};

export const fetchTeacherInterventions = async (filters: {
  classId?: string;
  studentId?: string;
  status?: string;
  priority?: string;
} = {}): Promise<{ success: boolean; data?: any[]; message?: string }> => {
  try {
    const query = new URLSearchParams();
    if (filters.classId) query.append('classId', filters.classId);
    if (filters.studentId) query.append('studentId', filters.studentId);
    if (filters.status) query.append('status', filters.status);
    if (filters.priority) query.append('priority', filters.priority);

    const response = await fetch(`${API_BASE_URL}/teacher/interventions?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher interventions' };
  }
};

export const fetchTeacherInterventionAnalytics = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/interventions/analytics`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch intervention analytics' };
  }
};

// --- STUDENT INTERVENTIONS ---
export const fetchStudentInterventions = async (filters: {
  status?: string;
  priority?: string;
} = {}): Promise<{ success: boolean; data?: any[]; message?: string }> => {
  try {
    const query = new URLSearchParams();
    if (filters.status) query.append('status', filters.status);
    if (filters.priority) query.append('priority', filters.priority);

    const response = await fetch(`${API_BASE_URL}/student/interventions?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student assignments' };
  }
};

export const updateStudentInterventionStatus = async (
  interventionId: string,
  status: 'in_progress' | 'completed'
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/interventions/${interventionId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update intervention status' };
  }
};

// --- SCHOLARSHIP ALERTS & SAVED OPPORTUNITIES ---
export const fetchScholarshipAlerts = async (): Promise<{
  success: boolean;
  data?: any[];
  legalDisclaimer?: string;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships/alerts`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch scholarship alerts' };
  }
};

export const fetchUpcomingScholarshipDeadlines = async (
  days: number = 30
): Promise<{ success: boolean; data?: any[]; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships/deadlines?days=${days}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch upcoming deadlines' };
  }
};

export const saveScholarshipOpportunity = async (
  scholarshipId: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships/${scholarshipId}/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to save scholarship' };
  }
};

export const unsaveScholarshipOpportunity = async (
  scholarshipId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships/${scholarshipId}/save`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to remove saved scholarship' };
  }
};

export const fetchSavedScholarships = async (): Promise<{
  success: boolean;
  data?: any[];
  legalDisclaimer?: string;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships/saved`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch saved scholarships' };
  }
};

export const updateScholarshipApplicationStatus = async (
  scholarshipId: string,
  status: 'not_started' | 'planning' | 'applied' | 'submitted' | 'closed'
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarships/${scholarshipId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update application status' };
  }
};

// --- AI LEARNING COACH ---
export const fetchTodayLearningCoach = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-coach/today`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch AI Learning Coach plan' };
  }
};

// --- PARENT / GUARDIAN PROGRESS & LINKING ---
export const fetchParentStudents = async (): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/students`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch linked students' };
  }
};

export const fetchParentStudentOverview = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/students/${studentId}/overview`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student progress overview' };
  }
};

export const acceptParentInvitation = async (
  code: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/link-student`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to accept parent invitation code' };
  }
};

export const generateParentInvitation = async (
  relationship: string = 'guardian'
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/parent-link/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ relationship }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate invitation code' };
  }
};

export const fetchStudentInvitations = async (): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/parent-link/invitations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student invitations' };
  }
};

export const revokeParentInvitation = async (
  code: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/parent-link/invitations/${code}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to revoke invitation code' };
  }
};
