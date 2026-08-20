import { LearningResource } from './types.js';

export interface QualityValidationResult {
  isValid: boolean;
  isVerified: boolean;
  flags: string[];
}

export class ResourceQualityValidator {
  static validateResource(resource: LearningResource): QualityValidationResult {
    const flags: string[] = [];

    if (!resource.isActive) {
      flags.push('inactive_resource');
    }

    if (!resource.isVerified) {
      flags.push('unverified_source');
    }

    if (!resource.title || resource.title.trim().length < 5) {
      flags.push('missing_or_short_title');
    }

    if (!resource.description || resource.description.trim().length < 10) {
      flags.push('missing_or_short_description');
    }

    if (resource.sourceUrl) {
      try {
        const url = new URL(resource.sourceUrl);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          flags.push('invalid_url_protocol');
        }
      } catch (e) {
        flags.push('malformed_source_url');
      }
    }

    if (!resource.provider || !resource.officialSource) {
      flags.push('missing_provider_metadata');
    }

    const isValid = !flags.includes('inactive_resource') && !flags.includes('unverified_source') && !flags.includes('malformed_source_url');

    return {
      isValid,
      isVerified: !!(resource.verified || resource.isVerified) && !flags.includes('unverified_source'),
      flags,
    };
  }
}
