import { LearningResource, StudentResourceProfile } from './types.js';

export function matchResourceToContext(resource: LearningResource, profile: StudentResourceProfile): boolean {
  if (!resource.isActive || !resource.isVerified) return false;
  return true;
}
