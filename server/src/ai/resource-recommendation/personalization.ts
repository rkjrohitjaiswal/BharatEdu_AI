import { LearningResource, StudentResourceProfile } from './types.js';

export function personalizeResourceCandidate(resource: LearningResource, profile: StudentResourceProfile): number {
  return resource.language === profile.language ? 10 : 0;
}
