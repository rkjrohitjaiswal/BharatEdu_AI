import { ResourceCandidate } from './types.js';

export function isUrlSafeAndVerified(url?: string | null): { safe: boolean; verified: boolean } {
  if (!url) {
    return { safe: true, verified: false };
  }

  const trimmed = url.trim().toLowerCase();

  // Reject unsafe schemes
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('file:') ||
    trimmed.startsWith('ftp:') ||
    trimmed.startsWith('http:')
  ) {
    return { safe: false, verified: false };
  }

  if (trimmed.startsWith('https://')) {
    return { safe: true, verified: true };
  }

  return { safe: false, verified: false };
}

export function validateResourceQuality(resource: ResourceCandidate): { isValid: boolean; qualityScore: number; reason?: string } {
  if (!resource.title || resource.title.trim().length < 3) {
    return { isValid: false, qualityScore: 0, reason: 'Invalid or missing title' };
  }

  if (!resource.description || resource.description.trim().length < 5) {
    return { isValid: false, qualityScore: 0, reason: 'Invalid or missing description' };
  }

  if (!resource.subject || !resource.topicId || !resource.conceptId) {
    return { isValid: false, qualityScore: 0, reason: 'Missing educational taxonomy (subject/topic/concept)' };
  }

  if (resource.url) {
    const urlCheck = isUrlSafeAndVerified(resource.url);
    if (!urlCheck.safe) {
      return { isValid: false, qualityScore: 0, reason: 'Unsafe or unencrypted URL scheme' };
    }
  }

  let calculatedScore = resource.qualityScore || 75;

  if (resource.official) calculatedScore += 5;
  if (resource.verified) calculatedScore += 5;
  if (resource.provider && resource.provider.length > 2) calculatedScore += 5;

  calculatedScore = Math.min(100, Math.max(0, calculatedScore));

  return {
    isValid: true,
    qualityScore: calculatedScore,
  };
}
