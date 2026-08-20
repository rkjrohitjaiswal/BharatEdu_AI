import { ResourceCandidate, ResourceContext, StudentLearningProfile, ResourceRecommendation } from './types.js';
import { CurriculumAlignmentEngine } from './curriculum.js';

export class ResourceRankingEngine {
  static rankCandidates(
    candidates: ResourceCandidate[],
    context: ResourceContext,
    profile: StudentLearningProfile
  ): ResourceRecommendation[] {
    const list: ResourceRecommendation[] = candidates.map((cand) => {
      let score = 50;
      let isPrereq = profile.prerequisiteGaps.includes(cand.conceptId);
      let isWeak = profile.weakConcepts.includes(cand.conceptId);
      let isRevision = profile.revisionDueConcepts.includes(cand.conceptId);

      // 1. Curriculum Alignment
      const curr = CurriculumAlignmentEngine.align(cand, context);
      score += (curr.score - 50) * 0.4;

      // 2. Learning Gap & Prerequisite Impact
      if (isPrereq) {
        score += 35;
      } else if (isWeak) {
        score += 25;
      }

      // 3. Revision Due
      if (isRevision) {
        score += 20;
      }

      // 4. Exam Proximity
      if (context.examApproaching && (cand.resourceType === 'worksheet' || cand.resourceType === 'textbook')) {
        score += 15;
      }

      // 5. Duration Fit
      if (context.availableMinutes && cand.durationMinutes <= context.availableMinutes) {
        score += 10;
      }

      // 6. Language Fit
      if (context.preferredLanguage && cand.language === context.preferredLanguage) {
        score += 10;
      }

      const finalScore = Math.min(100, Math.max(10, Math.round(score)));

      let priority: 'critical' | 'high' | 'medium' | 'low' = 'medium';
      if (finalScore >= 85 || isPrereq) priority = 'critical';
      else if (finalScore >= 70 || isWeak) priority = 'high';
      else if (finalScore < 45) priority = 'low';

      let actionType: 'watch' | 'read' | 'practice' | 'revise' | 'solve_doubt' | 'explore' = 'read';
      if (cand.resourceType === 'video') actionType = 'watch';
      else if (cand.resourceType === 'worksheet' || cand.resourceType === 'practice') actionType = 'practice';
      else if (isRevision) actionType = 'revise';
      else if (isPrereq) actionType = 'read';

      let primaryReason = 'Recommended based on curriculum alignment.';
      if (isPrereq) primaryReason = 'Critical prerequisite gap repair required.';
      else if (isWeak) primaryReason = 'Targeted concept mastery reinforcement.';
      else if (isRevision) primaryReason = 'Scheduled spaced memory revision due.';
      else if (context.examApproaching) primaryReason = 'Official board exam practice material.';

      return {
        resource: cand,
        recommendationScore: finalScore,
        rank: 0,
        priority,
        actionType,
        reason: {
          primaryReason,
          details: curr.reason,
          prerequisitePath: isPrereq ? [cand.conceptId] : undefined,
          examRelevance: context.examApproaching ? 'High board exam weightage concept' : undefined,
        },
      };
    });

    // Sort descending by recommendationScore
    list.sort((a, b) => b.recommendationScore - a.recommendationScore);
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    return list;
  }
}
