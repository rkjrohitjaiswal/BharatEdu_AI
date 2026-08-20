import { ResourceCandidate } from './types.js';

export class ResourceValidator {
  static validateResource(resource: Partial<ResourceCandidate>): { isValid: boolean; reason?: string } {
    if (!resource.title || resource.title.trim().length < 3) {
      return { isValid: false, reason: 'Invalid or missing resource title' };
    }

    if (!resource.url || (!resource.url.startsWith('http://') && !resource.url.startsWith('https://'))) {
      return { isValid: false, reason: 'Invalid or malformed resource URL' };
    }

    if (!resource.provider || resource.provider.trim().length === 0) {
      return { isValid: false, reason: 'Missing resource provider' };
    }

    if (!resource.subject || resource.subject.trim().length === 0) {
      return { isValid: false, reason: 'Missing subject classification' };
    }

    if (!resource.conceptId || resource.conceptId.trim().length === 0) {
      return { isValid: false, reason: 'Missing conceptId mapping' };
    }

    const validTypes = ['video', 'article', 'textbook', 'notes', 'worksheet', 'quiz', 'practice', 'simulation', 'coding', 'course'];
    if (!resource.resourceType || !validTypes.includes(resource.resourceType)) {
      return { isValid: false, reason: 'Invalid resource type' };
    }

    if (resource.verified === false) {
      return { isValid: false, reason: 'Resource is not verified by curriculum authority' };
    }

    if (resource.status && resource.status !== 'active') {
      return { isValid: false, reason: 'Resource status is inactive' };
    }

    return { isValid: true };
  }
}
