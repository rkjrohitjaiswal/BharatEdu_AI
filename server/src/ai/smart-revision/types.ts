import { RevisionOutcome } from '../../models/revision-history.model.js';
import { RevisionPriority, RevisionSourceType, RevisionStatus } from '../../models/revision-item.model.js';

export interface IRevisionItemDTO {
  id: string;
  studentId: string;
  topicId: string;
  topic: string;
  conceptId: string;
  subject: string;
  sourceType: RevisionSourceType;
  sourceId?: string;
  lastReviewedAt?: string;
  nextReviewAt: string;
  reviewCount: number;
  successfulReviews: number;
  failedReviews: number;
  currentIntervalDays: number;
  easeFactor: number;
  difficulty: string;
  masteryScore: number;
  confidenceScore: number;
  priority: RevisionPriority;
  status: RevisionStatus;
  reason: string;
  recommendedAction: string;
  estimatedMinutes: number;
  recommendedResourceUrl?: string;
  recommendedResourceTitle?: string;
}

export interface IDailyRevisionQueueData {
  date: string;
  totalDue: number;
  totalUpcoming: number;
  estimatedMinutes: number;
  prioritySummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  revisionItems: IRevisionItemDTO[];
}

export interface IRevisionScheduleDay {
  date: string;
  dueCount: number;
  estimatedMinutes: number;
  items: IRevisionItemDTO[];
}

export interface ISpacedRepetitionNextState {
  newIntervalDays: number;
  newEaseFactor: number;
  nextReviewAt: Date;
  outcome: RevisionOutcome;
}
