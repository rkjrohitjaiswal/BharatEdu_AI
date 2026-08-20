import { LearningResource, RecommendationSignal, RecommendationScore, StudentResourceProfile } from './types.js';

export const SIGNAL_WEIGHTS = {
  learningGap: 20,
  prerequisiteGap: 20,
  examRelevance: 15,
  masteryNeed: 15,
  goalAlignment: 10,
  careerAlignment: 8,
  riskAlignment: 5,
  revisionNeed: 4,
  resourcePreference: 3,
};

export class RecommendationRulesEngine {
  static evaluateSignals(resource: LearningResource, profile: StudentResourceProfile): RecommendationSignal[] {
    const signals: RecommendationSignal[] = [];

    // 1. Learning Gap Signal
    const matchesGap = profile.weakConcepts.some(
      (gap) => gap.toLowerCase() === resource.topic.toLowerCase() || gap.toLowerCase() === resource.conceptId.toLowerCase() || gap.toLowerCase() === resource.subject.toLowerCase()
    );
    if (matchesGap) {
      signals.push({
        type: 'learningGap',
        weight: SIGNAL_WEIGHTS.learningGap,
        reason: `Addresses active learning gap in ${resource.topic}.`,
        targetConcept: resource.conceptId,
      });
    }

    // 2. Prerequisite Gap Signal (Knowledge Graph Integration)
    const matchesPrereq = profile.prerequisiteGaps.some(
      (p) => resource.prerequisites.includes(p) || p.toLowerCase() === resource.conceptId.toLowerCase() || resource.tags.includes(p)
    );
    if (matchesPrereq) {
      signals.push({
        type: 'prerequisiteGap',
        weight: SIGNAL_WEIGHTS.prerequisiteGap,
        reason: `Builds prerequisite foundational understanding required for dependent topics.`,
        targetConcept: resource.conceptId,
      });
    }

    // 3. Exam Urgency & Relevance
    const matchesExam = profile.examTargets.some(
      (e) => resource.examRelevance?.some((er) => er.toLowerCase().includes(e.toLowerCase())) || resource.tags.includes(e.toLowerCase())
    );
    if (matchesExam || (resource.examRelevance && resource.examRelevance.length > 0)) {
      signals.push({
        type: 'examRelevance',
        weight: SIGNAL_WEIGHTS.examRelevance,
        reason: `High relevance for upcoming target exam preparations.`,
      });
    }

    // 4. Mastery Need
    if (profile.mastery < 60 && resource.difficulty === 'beginner') {
      signals.push({
        type: 'masteryNeed',
        weight: SIGNAL_WEIGHTS.masteryNeed,
        reason: `Matched for foundational mastery reinforcement (Current Mastery: ${profile.mastery}%).`,
      });
    } else if (profile.mastery >= 60 && resource.difficulty !== 'beginner') {
      signals.push({
        type: 'masteryNeed',
        weight: SIGNAL_WEIGHTS.masteryNeed * 0.7,
        reason: `Matched to advance topic proficiency towards higher mastery.`,
      });
    }

    // 5. Goal Alignment
    const matchesGoal = profile.activeGoals.some(
      (g) => resource.tags.includes(g.toLowerCase()) || resource.topic.toLowerCase().includes(g.toLowerCase())
    );
    if (matchesGoal) {
      signals.push({
        type: 'goalAlignment',
        weight: SIGNAL_WEIGHTS.goalAlignment,
        reason: `Directly aligned with active learning goal.`,
      });
    }

    // 6. Career Alignment
    const matchesCareer = profile.careerSkills.some(
      (c) => resource.careerRelevance?.some((cr) => cr.toLowerCase().includes(c.toLowerCase()))
    );
    if (matchesCareer) {
      signals.push({
        type: 'careerAlignment',
        weight: SIGNAL_WEIGHTS.careerAlignment,
        reason: `Develops target career skills in ${profile.careerSkills.join(', ')}.`,
      });
    }

    // 7. Risk Alignment
    if (profile.riskScore >= 60 && resource.estimatedMinutes <= 20) {
      signals.push({
        type: 'riskAlignment',
        weight: SIGNAL_WEIGHTS.riskAlignment,
        reason: `Manageable micro-learning unit tailored for high risk index remediation.`,
      });
    }

    // 8. Revision Need
    const isRevision = profile.revisionDueTopics.some(
      (r) => r.toLowerCase() === resource.topic.toLowerCase() || r.toLowerCase() === resource.conceptId.toLowerCase()
    );
    if (isRevision) {
      signals.push({
        type: 'revisionNeed',
        weight: SIGNAL_WEIGHTS.revisionNeed,
        reason: `Topic is due for spaced repetition revision.`,
      });
    }

    // 9. Language Preference
    if (resource.language === profile.language) {
      signals.push({
        type: 'resourcePreference',
        weight: SIGNAL_WEIGHTS.resourcePreference,
        reason: `Matches preferred learning language (${profile.language.toUpperCase()}).`,
      });
    }

    return signals;
  }

  static calculateScore(signals: RecommendationSignal[]): RecommendationScore {
    const rawTotal = signals.reduce((sum, s) => sum + s.weight, 0);
    const maxPossible = Object.values(SIGNAL_WEIGHTS).reduce((a, b) => a + b, 0);
    
    // Normalize to 0 - 100 range deterministically
    const totalScore = Math.min(100, Math.max(0, Math.round((rawTotal / maxPossible) * 100)));

    let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (totalScore >= 75) {
      priority = 'critical';
    } else if (totalScore >= 50) {
      priority = 'high';
    } else if (totalScore >= 30) {
      priority = 'medium';
    }

    const breakdown: Record<string, number> = {};
    signals.forEach((s) => {
      breakdown[s.type] = s.weight;
    });

    return {
      totalScore,
      priority,
      breakdown,
    };
  }
}
