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

// --- STUDENT GOALS & ACHIEVEMENTS ---
export const fetchStudentGoals = async (): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/goals`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student goals' };
  }
};

export const createStudentGoal = async (
  goalInput: any
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(goalInput),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create student goal' };
  }
};

export const updateStudentGoal = async (
  id: string,
  updates: any
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/goals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update student goal' };
  }
};

export const pauseStudentGoal = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/goals/${id}/pause`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to pause student goal' };
  }
};

export const resumeStudentGoal = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/goals/${id}/resume`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to resume student goal' };
  }
};

export const deleteStudentGoal = async (
  id: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/goals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to delete student goal' };
  }
};

export const fetchStudentAchievements = async (): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/achievements`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student achievements' };
  }
};

export const fetchAchievementSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/achievements/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch achievement summary' };
  }
};

// --- FEATURE 9: EXAM PREPARATION & READINESS ---
export const createExam = async (
  input: any
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create exam preparation' };
  }
};

export const fetchStudentExams = async (): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam preparations' };
  }
};

export const fetchExam = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam preparation' };
  }
};

export const updateExam = async (
  id: string,
  updates: any
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update exam preparation' };
  }
};

export const deleteExam = async (
  id: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to delete exam preparation' };
  }
};

export const fetchExamReadiness = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}/readiness`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam readiness' };
  }
};

export const generateExamPlan = async (
  id: string,
  availableDailyMinutes: number = 60
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}/generate-plan`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ availableDailyMinutes }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate exam plan' };
  }
};

export const fetchExamPlan = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}/plan`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam plan' };
  }
};

export const updateExamPlanTask = async (
  id: string,
  taskId: string,
  completed: boolean
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}/plan/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update exam task' };
  }
};

export const createMockExam = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exams/${id}/mock`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create mock exam' };
  }
};

// --- FEATURE 11: SMART NOTIFICATIONS API HELPERS ---
export const fetchNotifications = async (
  filters?: { isRead?: boolean; priority?: string; sourceType?: string; limit?: number }
): Promise<{ success: boolean; data?: { notifications: any[]; unreadCount: number }; message?: string }> => {
  try {
    const params = new URLSearchParams();
    if (typeof filters?.isRead === 'boolean') params.append('isRead', String(filters.isRead));
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.sourceType) params.append('sourceType', filters.sourceType);
    if (filters?.limit) params.append('limit', String(filters.limit));

    const url = `${API_BASE_URL}/notifications${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch notifications' };
  }
};

export const fetchUnreadNotificationCount = async (): Promise<{
  success: boolean;
  data?: { unreadCount: number };
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch unread count' };
  }
};

export const markNotificationRead = async (
  id: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to mark notification as read' };
  }
};

export const markAllNotificationsRead = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to mark all notifications as read' };
  }
};

export const syncNotifications = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to sync notifications' };
  }
};

export const deleteNotification = async (
  id: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to delete notification' };
  }
};

// --- FEATURE 12: LEARNING ANALYTICS API HELPERS ---
export const fetchStudentAnalytics = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/student`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student analytics' };
  }
};

export const fetchTeacherAnalytics = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/teacher`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher analytics' };
  }
};

export const fetchParentStudentAnalytics = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/parent/${studentId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent student analytics' };
  }
};

// --- FEATURE 13: RISK PREDICTION API HELPERS ---
export const fetchStudentRiskProfile = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/risk/student`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student risk profile' };
  }
};

export const fetchTeacherRiskAnalytics = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/risk/teacher`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher class risk analytics' };
  }
};

export const fetchParentStudentRiskSummary = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/risk/parent/${studentId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent student risk summary' };
  }
};

// --- FEATURE 14: TEACHER COPILOT API HELPERS ---
export const fetchTeacherCopilotStudents = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/copilot/students`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher copilot students' };
  }
};

export const fetchTeacherCopilotStudentSnapshot = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/copilot/student/${studentId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student copilot snapshot' };
  }
};

export const fetchTeacherCopilotAdvice = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/copilot/student/${studentId}/advice`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate teacher copilot advice' };
  }
};

export const fetchTeacherCopilotParentMessage = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/copilot/student/${studentId}/parent-message`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate parent message draft' };
  }
};

// --- FEATURE 15: PARENT COPILOT API HELPERS ---
export const fetchParentCopilotStudents = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/copilot/students`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent copilot students' };
  }
};

export const fetchParentCopilotStudentSnapshot = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/copilot/student/${studentId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent student snapshot' };
  }
};

export const fetchParentCopilotAdvice = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/copilot/student/${studentId}/advice`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate parent copilot advice' };
  }
};

export const fetchParentCopilotWeeklyPlan = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/copilot/student/${studentId}/weekly-plan`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch weekly parent support plan' };
  }
};

// --- FEATURE 16: STUDENT MENTOR API HELPERS ---
export const fetchStudentMentorToday = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/mentor/today`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch today\'s student mentor snapshot' };
  }
};

export const fetchStudentMentorPlan = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/mentor/plan`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student mentor plan' };
  }
};

export const fetchStudentMentorAdvice = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/mentor/advice`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student mentor advice' };
  }
};

export const fetchStudentMentorSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/mentor/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student mentor summary' };
  }
};

// --- FEATURE 17: STUDENT LEARNING ANALYTICS API HELPERS ---
export const fetchStudentAnalyticsOverview = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/overview`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student analytics overview' };
  }
};

export const fetchStudentAnalyticsSubjects = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/subjects`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch subject analytics' };
  }
};

export const fetchStudentAnalyticsTopics = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/topics`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch topic analytics' };
  }
};

export const fetchStudentAnalyticsPractice = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/practice`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch practice analytics' };
  }
};

export const fetchStudentAnalyticsWeekly = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/weekly`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch weekly analytics' };
  }
};

export const fetchStudentAnalyticsAdvice = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/advice`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate analytics advice' };
  }
};

export const fetchStudentAnalyticsSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch analytics summary' };
  }
};

// --- FEATURE 18: STUDY PLANNER API HELPERS ---
export const fetchTodayStudyPlanner = async (
  availableMinutes?: number
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const url = availableMinutes
      ? `${API_BASE_URL}/student/study-planner/today?availableMinutes=${availableMinutes}`
      : `${API_BASE_URL}/student/study-planner/today`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch today\'s study plan' };
  }
};

export const fetchWeekStudyPlanner = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-planner/week`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch weekly study plan' };
  }
};

export const generateStudyPlanner = async (
  availableMinutes?: number
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-planner/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ availableMinutes }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate study plan' };
  }
};

export const refreshStudyPlanner = async (
  availableMinutes?: number
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-planner/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ availableMinutes }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to refresh study plan' };
  }
};

export const completeStudyPlannerTask = async (
  taskId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student/study-planner/tasks/${taskId}/complete`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      }
    );
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to complete study task' };
  }
};

export const fetchStudyPlannerSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-planner/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch study planner summary' };
  }
};

// --- FEATURE 19: RESOURCE RECOMMENDATION API HELPERS ---
export const fetchAllResources = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch catalog resources' };
  }
};

export const fetchResourceById = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch resource details' };
  }
};

export const generateResourceRecommendations = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate recommendations' };
  }
};

export const updateRecommendationStatus = async (
  id: string,
  status: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/recommendations/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update recommendation status' };
  }
};

export const fetchResourceRecommendationSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch resource recommendation summary' };
  }
};

// --- FEATURE 20: SMART REVISION API HELPERS ---
export const fetchTodayRevisionPlan = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/today`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch today revision plan' };
  }
};

export const fetchWeeklyRevisionPlan = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/week`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch weekly revision plan' };
  }
};

export const fetchRevisionSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch revision summary' };
  }
};

export const fetchDueRevisionItems = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/due`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch due revision items' };
  }
};

export const fetchOverdueRevisionItems = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/overdue`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch overdue revision items' };
  }
};

export const fetchRevisionItemById = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch revision item details' };
  }
};

export const generateRevisionPlan = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate revision items' };
  }
};

export const refreshRevisionPlan = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to refresh revision plan' };
  }
};

export const startRevisionSession = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/${id}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to start revision session' };
  }
};

export const completeRevisionSession = async (
  id: string,
  questionsAttempted: number,
  questionsCorrect: number
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ questionsAttempted, questionsCorrect }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to complete revision session' };
  }
};

// --- FEATURE 21: KNOWLEDGE GRAPH API HELPERS ---
export const fetchKnowledgeConcepts = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/concepts`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch knowledge concepts' };
  }
};

export const fetchKnowledgeConcept = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/concepts/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch concept details' };
  }
};

export const fetchConceptPrerequisites = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/concepts/${id}/prerequisites`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch concept prerequisites' };
  }
};

export const fetchConceptDependents = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/concepts/${id}/dependents`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch concept dependents' };
  }
};

export const fetchConceptPath = async (
  fromId: string,
  toId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/concepts/${fromId}/path?toId=${toId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch concept path' };
  }
};

export const fetchStudentConceptReadiness = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/student/${studentId}/readiness`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch concept readiness' };
  }
};

export const fetchStudentRootGaps = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/student/${studentId}/root-gaps`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch root learning gaps' };
  }
};

export const fetchStudentConceptRecommendations = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/student/${studentId}/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch concept recommendations' };
  }
};

export const fetchTeacherConceptOverview = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/teacher/students/${studentId}/overview`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher concept overview' };
  }
};

export const fetchParentConceptOverview = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge-graph/parent/students/${studentId}/overview`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent concept overview' };
  }
};

// --- FEATURE 22: KNOWLEDGE GRAPH ADAPTIVE INTEGRATION ---

// --- FEATURE 23: SMART RESOURCE HUB API HELPERS ---
export const fetchResourceCatalog = async (
  query?: string,
  subject?: string,
  topic?: string,
  type?: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (subject) params.append('subject', subject);
    if (topic) params.append('topic', topic);
    if (type) params.append('type', type);

    const response = await fetch(`${API_BASE_URL}/student/resources?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to search resource catalog' };
  }
};

export const fetchResourceDetails = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch resource details' };
  }
};

export const startResourceTracking = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${id}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to start resource tracking' };
  }
};

export const updateResourceProgressTracking = async (
  id: string,
  progressPercent: number
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${id}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ progressPercent }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to update resource progress' };
  }
};

export const completeResourceTracking = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to complete resource tracking' };
  }
};

export const fetchTeacherResourceSummary = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/teacher/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher resource summary' };
  }
};

export const fetchParentResourceSummary = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/parent/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent resource summary' };
  }
};

// --- FEATURE 24: SMART REVISION API HELPERS ---
export const fetchDailyRevisionQueue = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/today`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch daily revision queue' };
  }
};

export const fetchRevisionSchedule = async (
  days: number = 7,
  subject?: string,
  priority?: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const params = new URLSearchParams();
    params.append('days', String(days));
    if (subject) params.append('subject', subject);
    if (priority) params.append('priority', priority);

    const response = await fetch(`${API_BASE_URL}/student/revision/schedule?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch revision schedule' };
  }
};

export const startRevisionSessionTracking = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/${id}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to start revision session' };
  }
};

export const submitRevisionOutcome = async (
  id: string,
  outcome: 'again' | 'hard' | 'good' | 'easy'
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ outcome }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to submit revision outcome' };
  }
};

export const refreshStudentRevisionQueue = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to refresh revision queue' };
  }
};

export const fetchTeacherRevisionSummary = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/teacher/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher revision summary' };
  }
};

export const fetchParentRevisionSummary = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/revision/parent/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent revision summary' };
  }
};

// ===================================================
// FEATURE 25: AI LEARNING PATH & PERSONALIZED CURRICULUM ENGINE
// ===================================================

export const fetchStudentLearningPaths = async (): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch student learning paths' };
  }
};

export const fetchLearningPathDetails = async (
  pathId?: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const url = pathId ? `${API_BASE_URL}/student/learning-path/${pathId}` : `${API_BASE_URL}/student/learning-path/default`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch learning path details' };
  }
};

export const fetchNextLearningTask = async (
  pathId: string = 'default'
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/next`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch next learning task' };
  }
};

export const refreshLearningPath = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to refresh learning path' };
  }
};

export const startLearningTask = async (
  pathId: string,
  taskId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/tasks/${taskId}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to start learning task' };
  }
};

export const completeLearningTask = async (
  pathId: string,
  taskId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to complete learning task' };
  }
};

export const completeLearningStage = async (
  pathId: string,
  stageId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/stages/${stageId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to complete learning stage' };
  }
};

export const pauseLearningPath = async (
  pathId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/pause`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to pause learning path' };
  }
};

export const resumeLearningPath = async (
  pathId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/resume`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to resume learning path' };
  }
};

export const fetchLearningPathSummary = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch learning path summary' };
  }
};

export const fetchTeacherLearningPathSummary = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/teacher/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher learning path summary' };
  }
};

export const fetchParentLearningPathSummary = async (
  studentId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/parent/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent learning path summary' };
  }
};

export const fetchCurrentLearningPath = fetchLearningPathDetails;
export const fetchLearningPath = fetchLearningPathDetails;
export const generateLearningPath = async (options?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {}),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate learning path' };
  }
};

export const fetchLearningPathItems = async (pathId: string = 'default') => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/items`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch learning path items' };
  }
};

export const startLearningPathItem = startLearningTask;
export const completeLearningPathItem = completeLearningTask;

export const skipLearningPathItem = async (pathId: string, itemId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/items/${itemId}/skip`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to skip learning path item' };
  }
};

export const fetchLearningPathNext = fetchNextLearningTask;

export const fetchLearningPathAdvice = async (pathId: string = 'default') => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/learning-path/${pathId}/advice`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch learning path advice' };
  }
};

// ===================================================
// FEATURE 26: AI RESOURCE RECOMMENDATION ENGINE
// ===================================================

export const fetchRecommendedResources = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/recommended`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch recommended resources' };
  }
};

export const fetchTodayResources = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/today`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch today resources' };
  }
};

export const fetchNextResource = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/next`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch next resource' };
  }
};

export const startResourceRecommendation = async (recId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${recId}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to start resource recommendation' };
  }
};

export const completeResourceRecommendation = async (recId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${recId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to complete resource recommendation' };
  }
};

export const fetchResourceSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch resource summary' };
  }
};

// ===================================================
// FEATURE 27: AI STUDY MATERIAL & PERSONALIZED NOTES GENERATOR
// ===================================================

export const generateStudyMaterial = async (options?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {}),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate study material' };
  }
};

export const fetchRecommendedStudyMaterials = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/recommended`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch recommended study materials' };
  }
};

export const fetchTodayStudyMaterials = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/today`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch today study materials' };
  }
};

export const fetchStudyMaterial = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch study material details' };
  }
};

export const regenerateStudyMaterial = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/${id}/regenerate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to regenerate study material' };
  }
};

export const archiveStudyMaterial = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/${id}/archive`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to archive study material' };
  }
};

export const fetchStudyMaterialFlashcards = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/${id}/flashcards`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch study material flashcards' };
  }
};

export const generateStudyMaterialFlashcards = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/${id}/flashcards/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate flashcards' };
  }
};

export const reviewStudyFlashcard = async (flashcardId: string, outcome: 'again' | 'hard' | 'good' | 'easy') => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/flashcards/${flashcardId}/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ outcome }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to review flashcard' };
  }
};

export const fetchStudyMaterialHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/history`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch study material history' };
  }
};

export const fetchStudyMaterialSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/study-material/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch study material summary' };
  }
};

// ===================================================
// FEATURE 28: AI DOUBT SOLVER & CONTEXTUAL LEARNING TUTOR
// ===================================================

export const createDoubtSession = async (options?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {}),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create doubt session' };
  }
};

export const fetchDoubtSessions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt sessions' };
  }
};

export const fetchDoubtSession = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt session details' };
  }
};

export const deleteDoubtSession = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to delete doubt session' };
  }
};

export const sendDoubtMessage = async (sessionId: string, content: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to send doubt message' };
  }
};

export const fetchDoubtMessages = async (sessionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions/${sessionId}/messages`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt messages' };
  }
};

export const solveDoubtSession = async (sessionId: string, question: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions/${sessionId}/solve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to solve doubt' };
  }
};

export const startSocraticMode = async (sessionId: string, hintLevel: number, question: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/sessions/${sessionId}/socratic`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ hintLevel, question }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch Socratic hint' };
  }
};

export const submitDoubtMessageFeedback = async (messageId: string, isHelpful: boolean) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/messages/${messageId}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isHelpful }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to submit doubt feedback' };
  }
};

export const fetchLegacyDoubtContext = async (sessionId?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/context${sessionId ? `?sessionId=${sessionId}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt context' };
  }
};

export const fetchLegacyDoubtRecommendations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt recommendations' };
  }
};

// --- FEATURE 29: ADAPTIVE ASSESSMENT ---
export const createAdaptiveAssessment = async (options?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {}),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create adaptive assessment' };
  }
};

export const fetchAdaptiveAssessments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch adaptive assessments' };
  }
};

export const fetchAdaptiveAssessment = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch adaptive assessment details' };
  }
};

export const startAdaptiveAssessment = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to start assessment' };
  }
};

export const fetchCurrentAssessmentQuestion = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/current-question`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch current question' };
  }
};

export const submitAssessmentAnswer = async (id: string, questionId: string, submittedAnswer: string, responseTimeSeconds = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/questions/${questionId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ submittedAnswer, responseTimeSeconds }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to submit answer' };
  }
};

export const skipAssessmentQuestion = async (id: string, questionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/questions/${questionId}/skip`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to skip question' };
  }
};

export const finishAdaptiveAssessment = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/finish`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to finish assessment' };
  }
};

export const fetchAssessmentResults = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/results`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch assessment results' };
  }
};

export const fetchAssessmentReview = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/review`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch assessment review' };
  }
};

export const fetchAssessmentRecommendations = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/${id}/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch assessment recommendations' };
  }
};

export const createAssessmentFromDoubt = async (doubtId?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/from-doubt`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ doubtId }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create assessment from doubt' };
  }
};

export const createDiagnosticAssessment = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/diagnostic`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create diagnostic assessment' };
  }
};

export const createExamSimulation = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/exam-simulation`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create exam simulation' };
  }
};

export const createMasteryCheck = async (conceptId?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/mastery-check`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ conceptId }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create mastery check' };
  }
};

export const createRevisionTest = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/assessments/revision-test`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create revision test' };
  }
};

export const fetchTeacherAssessmentSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/assessments/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher assessment summary' };
  }
};

export const fetchParentAssessmentSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/assessments/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent assessment summary' };
  }
};

// --- FEATURE 30: AI EXAM PAPER GENERATOR & MOCK EXAM ENGINE ---
export const createExamPaper = async (options?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {}),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to create exam paper' };
  }
};

export const fetchExamPapers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam papers' };
  }
};

export const fetchExamPaper = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam paper details' };
  }
};

export const startExamPaper = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to start exam paper' };
  }
};

export const fetchCurrentExamQuestion = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/current`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch current question' };
  }
};

export const submitExamAnswer = async (id: string, questionId: string, submittedAnswer: string, responseTimeSeconds = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/questions/${questionId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ submittedAnswer, responseTimeSeconds }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to submit exam answer' };
  }
};

export const skipExamQuestion = async (id: string, questionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/questions/${questionId}/skip`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to skip exam question' };
  }
};

export const markExamQuestionForReview = async (id: string, questionId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/questions/${questionId}/mark-review`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to mark question for review' };
  }
};

export const finishExamPaper = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/finish`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to finish exam paper' };
  }
};

export const fetchExamPaperResults = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/results`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam paper results' };
  }
};

export const fetchExamPaperReview = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/review`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam paper review' };
  }
};

export const fetchExamPaperRecommendations = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/${id}/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam paper recommendations' };
  }
};

export const generateMockExam = async (subject?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/generate-mock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subject }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate mock exam' };
  }
};

export const generatePracticePaper = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/generate-practice-paper`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate practice paper' };
  }
};

export const generateWeakAreaPaper = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/generate-weak-area-paper`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate weak area paper' };
  }
};

export const generateExamReadinessPaper = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-papers/generate-exam-readiness-paper`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate exam readiness paper' };
  }
};

export const fetchTeacherExamSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/exam-papers/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher exam summary' };
  }
};

export const fetchParentExamSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/exam-papers/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent exam summary' };
  }
};

// --- FEATURE 31: AI EXAM EVALUATION, ANSWER ANALYSIS & PERSONALIZED FEEDBACK ENGINE ---
export const fetchExamEvaluations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch exam evaluations' };
  }
};

export const fetchExamEvaluation = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch evaluation details' };
  }
};

export const evaluateExamPaper = async (paperId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${paperId}/evaluate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to evaluate exam paper' };
  }
};

export const fetchEvaluationResults = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/results`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch evaluation results' };
  }
};

export const fetchEvaluationQuestions = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/questions`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch question evaluations' };
  }
};

export const fetchEvaluationTopics = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/topics`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch topic evaluations' };
  }
};

export const fetchEvaluationConcepts = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/concepts`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch concept evaluations' };
  }
};

export const fetchEvaluationMisconceptions = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/misconceptions`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch evaluation misconceptions' };
  }
};

export const fetchEvaluationRecommendations = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch evaluation recommendations' };
  }
};

export const fetchEvaluationFeedback = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/feedback`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch evaluation feedback' };
  }
};

export const recalculateEvaluation = async (evaluationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/exam-evaluations/${evaluationId}/recalculate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to recalculate evaluation' };
  }
};

export const fetchTeacherEvaluationSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/exam-evaluations/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher evaluation summary' };
  }
};

export const fetchTeacherMisconceptions = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/exam-evaluations/student/${studentId}/misconceptions`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher misconceptions' };
  }
};

export const fetchTeacherEvaluationRecommendations = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/exam-evaluations/student/${studentId}/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher evaluation recommendations' };
  }
};

export const fetchParentEvaluationSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/exam-evaluations/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent evaluation summary' };
  }
};

// --- FEATURE 32: AI DOUBT SOLVER, STEP-BY-STEP EXPLANATION & PERSONALIZED LEARNING ENGINE ---
export const fetchDoubts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubts' };
  }
};

export const fetchDoubt = async (doubtId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/${doubtId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt details' };
  }
};

export const solveDoubt = async (payload: { question: string; subject?: string; sourceContext?: string; sourceId?: string; level?: string; language?: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to solve doubt' };
  }
};

export const followupDoubt = async (doubtId: string, payload: { question: string; level?: string; language?: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/${doubtId}/followup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to submit follow-up doubt' };
  }
};

export const submitDoubtFeedback = async (doubtId: string, payload: { responseId: string; helpful: boolean; feedbackType?: string; comment?: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/${doubtId}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to submit doubt feedback' };
  }
};

export const fetchDoubtContext = async (doubtId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/${doubtId}/context`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt context' };
  }
};

export const fetchDoubtRecommendations = async (doubtId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/${doubtId}/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch doubt recommendations' };
  }
};

export const addDoubtToRevision = async (doubtId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/${doubtId}/add-to-revision`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to add doubt to revision' };
  }
};

export const practiceDoubtConcept = async (doubtId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/doubts/${doubtId}/practice`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to generate practice for doubt concept' };
  }
};

export const fetchTeacherDoubtSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/doubts/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch teacher doubt summary' };
  }
};

export const fetchParentDoubtSummary = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/parent/doubts/student/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch parent doubt summary' };
  }
};

// ==================================================
// FEATURE 33: AI LEARNING RESOURCE RECOMMENDATION APIs
// ==================================================

export const fetchResourceRecommendations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/recommendations`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch resource recommendations' };
  }
};

export const fetchResourceRecommendationById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/recommendations/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch recommendation details' };
  }
};

export const refreshResourceRecommendations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/recommendations/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to refresh recommendations' };
  }
};

export const dismissResourceRecommendation = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/recommendations/${id}/dismiss`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to dismiss recommendation' };
  }
};

export const fetchAllLearningResources = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch learning resources' };
  }
};

export const fetchLearningResourceDetails = async (resourceId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${resourceId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch learning resource details' };
  }
};

export const recordResourceInteraction = async (
  resourceId: string,
  payload: { interactionType: string; progressPercent?: number; durationSeconds?: number }
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${resourceId}/interaction`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to record resource interaction' };
  }
};

export const fetchResourceBookmarks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/bookmarks`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch bookmarks' };
  }
};

export const bookmarkLearningResource = async (resourceId: string, note?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${resourceId}/bookmark`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note }),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to bookmark resource' };
  }
};

export const removeResourceBookmark = async (resourceId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/${resourceId}/bookmark`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to remove bookmark' };
  }
};

export const fetchResourceHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/resources/history`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: 'Failed to fetch resource history' };
  }
};





