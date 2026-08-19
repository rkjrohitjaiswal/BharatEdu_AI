export type MatchStatus = 'potential_match' | 'needs_information' | 'likely_not_match' | 'expired';

export interface StudentScholarshipProfilePayload {
  studentId: string;
  educationLevel?: string;
  classLevel?: number;
  board?: string;
  state?: string;
  district?: string;
  annualFamilyIncome?: number;
  category?: string;
  academicPercentage?: number;
  institutionType?: string;
  gender?: string;
  disabilityStatus?: boolean;
}

export interface EvaluatedCriterion {
  criterionType: 'class_level' | 'income_ceiling' | 'location' | 'category' | 'academic_percentage';
  description: string;
  status: 'matched' | 'unmet' | 'unknown';
  reason: string;
}

export interface ScholarshipMatchResult {
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  matchScore: number;
  confidence: number;
  status: MatchStatus;
  matchedCriteria: string[];
  unmetCriteria: string[];
  unknownCriteria: string[];
  explanation: string;
  deadline?: string;
  officialSourceUrl?: string;
  applicationUrl?: string;
  requiredDocuments: string[];
}
