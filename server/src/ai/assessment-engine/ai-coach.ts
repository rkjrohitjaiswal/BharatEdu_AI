import { AssessmentInsight, AssessmentResult } from './types.js';

export class AIAssessmentCoach {
  static generateInsight(result: AssessmentResult): AssessmentInsight {
    const studentId = result.attempt.studentId;
    const pct = result.attempt.percentage;

    let overallPerf = 'Needs Improvement';
    if (pct >= 85) overallPerf = 'Outstanding Mastery';
    else if (pct >= 70) overallPerf = 'Solid Understanding';
    else if (pct >= 50) overallPerf = 'Developing Proficiency';

    const keyStrengths = result.strongConcepts && result.strongConcepts.length > 0
      ? result.strongConcepts
      : ['Attempted all mandatory questions with steady pacing'];

    const keyGaps = result.weakConcepts && result.weakConcepts.length > 0
      ? result.weakConcepts
      : ['None identified in this assessment'];

    let advice = 'Keep up the consistent practice schedule!';
    if (pct < 50) {
      advice = 'Focus on foundational prerequisite topics and use short 10-minute practice modules to rebuild confidence.';
    } else if (pct < 75) {
      advice = 'Review incorrect answers in the question breakdown and solve 2 diagnostic revision sets.';
    } else {
      advice = 'Great accuracy! Challenge yourself with hard-difficulty practice problems and timed mock tests.';
    }

    return {
      studentId,
      overallPerformance: overallPerf,
      keyStrengths,
      keyGaps,
      aiCoachAdvice: advice,
    };
  }

  static explainQuestionSelection(conceptId: string, difficulty: string, reason?: string): string {
    return (
      reason ||
      `This question was selected at ${difficulty} difficulty to evaluate your mastery of concept '${conceptId}' aligned with your current learning target.`
    );
  }
}
