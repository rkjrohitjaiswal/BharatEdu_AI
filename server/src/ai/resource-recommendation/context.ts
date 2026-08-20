import { StudentResourceProfile } from './types.js';
import { ResourceRecommendationEngine } from './engine.js';

export async function buildStudentResourceContext(studentId: string): Promise<StudentResourceProfile> {
  return await ResourceRecommendationEngine.buildStudentProfile(studentId);
}
