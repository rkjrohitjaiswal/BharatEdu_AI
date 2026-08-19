import { ScholarshipCriteriaEngine } from './criteria.engine.js';
import { MatchStatus, ScholarshipMatchResult, StudentScholarshipProfilePayload } from './types.js';

export class ScholarshipMatcher {
  public static matchStudentScholarship(
    profile: StudentScholarshipProfilePayload,
    scholarship: any
  ): ScholarshipMatchResult {
    const evaluatedCriteria = ScholarshipCriteriaEngine.evaluateCriteria(profile, scholarship);

    const matchedList = evaluatedCriteria.filter((c) => c.status === 'matched').map((c) => c.description);
    const unmetList = evaluatedCriteria.filter((c) => c.status === 'unmet').map((c) => c.description);
    const unknownList = evaluatedCriteria.filter((c) => c.status === 'unknown').map((c) => c.description);

    const totalCriteria = evaluatedCriteria.length;
    const matchedCount = matchedList.length;
    const unmetCount = unmetList.length;
    const unknownCount = unknownList.length;

    // Check Expired Status
    const isExpired = scholarship.deadline ? new Date(scholarship.deadline).getTime() < Date.now() : false;

    let status: MatchStatus = 'potential_match';
    let matchScore = 50;

    if (isExpired) {
      status = 'expired';
      matchScore = 0;
    } else if (unmetCount > 0) {
      status = 'likely_not_match';
      matchScore = Math.max(10, Math.round(50 - unmetCount * 20));
    } else if (unknownCount > 0) {
      status = 'needs_information';
      matchScore = Math.min(85, Math.round(60 + matchedCount * 10));
    } else {
      status = 'potential_match';
      matchScore = Math.min(100, Math.round(75 + matchedCount * 5));
    }

    // Confidence Score Calculation (portion of non-unknown criteria)
    const confidence = Math.round(((matchedCount + unmetCount) / totalCriteria) * 100) / 100;

    const explanation = isExpired
      ? `This scholarship application deadline (${new Date(scholarship.deadline).toLocaleDateString('en-IN')}) has passed.`
      : unmetCount > 0
      ? `Profile does not meet ${unmetCount} required published criterion.`
      : unknownCount > 0
      ? `Profile satisfies ${matchedCount} criteria, but ${unknownCount} criteria require student verification.`
      : `Profile satisfies all ${matchedCount} evaluated published criteria.`;

    return {
      scholarshipId: String(scholarship._id || scholarship.id),
      scholarshipName: scholarship.name,
      provider: scholarship.provider,
      matchScore,
      confidence,
      status,
      matchedCriteria: matchedList,
      unmetCriteria: unmetList,
      unknownCriteria: unknownList,
      explanation,
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString() : undefined,
      officialSourceUrl: scholarship.sourceUrl || scholarship.applicationUrl,
      applicationUrl: scholarship.applicationUrl,
      requiredDocuments: scholarship.requiredDocuments || ['Marksheet', 'Income Certificate', 'Aadhaar Card'],
    };
  }
}
