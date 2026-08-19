import { ScholarshipMatcher } from './matcher.js';
import { ScholarshipMatchResult, StudentScholarshipProfilePayload } from './types.js';

export class ScholarshipRecommendationEngine {
  public static matchAllScholarships(
    profile: StudentScholarshipProfilePayload,
    scholarshipsList: any[]
  ): ScholarshipMatchResult[] {
    return scholarshipsList
      .map((s) => ScholarshipMatcher.matchStudentScholarship(profile, s))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  public static generateDocumentChecklist(requiredDocs: string[]): { documentName: string; status: 'required' | 'optional' }[] {
    return requiredDocs.map((doc) => ({
      documentName: doc,
      status: 'required',
    }));
  }
}
