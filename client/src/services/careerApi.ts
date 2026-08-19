const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const headers = (): HeadersInit => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export const fetchCareerCatalog = () => request('/student/career/catalog');
export const fetchCareerGoals = () => request('/student/career/goals');
export const createCareerGoal = (targetRole: string, targetDate?: string, notes?: string) => request('/student/career/goals', { method: 'POST', body: JSON.stringify({ targetRole, targetDate, notes }) });
export const fetchCareerRoadmap = (goalId: string) => request(`/student/career/goals/${goalId}/roadmap`);
export const fetchCareerAdvice = (goalId: string) => request(`/student/career/goals/${goalId}/advice`);
export const deleteCareerGoal = (goalId: string) => request(`/student/career/goals/${goalId}`, { method: 'DELETE' });
