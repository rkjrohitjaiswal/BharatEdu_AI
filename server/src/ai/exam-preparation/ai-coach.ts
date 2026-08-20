import { ExamReadinessSnapshot, ExamPriority } from './types.js';

export class AIExamCoach {
  static generateGuidance(params: {
    examName: string;
    readiness: ExamReadinessSnapshot;
    topPriority?: ExamPriority;
    daysRemaining: number;
  }): {
    headline: string;
    guidance: string;
    whyItMatters: string;
    timeAllocationAdvice: string;
  } {
    const { examName, readiness, topPriority, daysRemaining } = params;

    let headline = `Keep up your steady progress for ${examName}!`;
    let guidance = `Your current readiness is ${readiness.readinessScore}%. Focus on strengthening core high-weightage topics.`;
    let whyItMatters = 'Consistent practice prevents last-minute cramming and improves speed under exam pressure.';
    let timeAllocationAdvice = `Divide your remaining ${daysRemaining} days between concept repair (50%), practice (30%), and mock testing (20%).`;

    if (readiness.status === 'critical') {
      headline = `Urgent focus needed for ${examName}!`;
      guidance = topPriority
        ? `Prioritize repairing prerequisite gap in ${topPriority.topic} (${topPriority.reason}).`
        : 'Prioritize foundational NCERT concepts and core formula applications.';
      whyItMatters = 'Fixing foundational prerequisite gaps immediately unlocks progress in multiple dependent topics.';
    } else if (readiness.status === 'exam_ready') {
      headline = `Excellent readiness for ${examName}!`;
      guidance = 'Maintain mastery with full-length timed mock simulations and error logs.';
      whyItMatters = 'Simulating full-length exam conditions builds stamina and eliminates unforced errors.';
    }

    return {
      headline,
      guidance,
      whyItMatters,
      timeAllocationAdvice,
    };
  }
}
