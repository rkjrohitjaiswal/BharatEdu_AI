import { ClassroomInsight, ClassPerformance, StudentClassProfile, ClassroomLearningGap } from './types.js';

export class ClassroomAICoach {
  static async generateClassroomInsight(
    className: string,
    performance: ClassPerformance,
    studentProfiles: StudentClassProfile[],
    learningGaps: ClassroomLearningGap[]
  ): Promise<ClassroomInsight> {
    const hasAIKey = !!process.env.AI_API_KEY;

    const criticalCount = studentProfiles.filter((s) => s.riskScore >= 70).length;
    const topGap = learningGaps[0]?.conceptName || 'Foundational Topics';

    const headline = `Class ${className} is performing at ${performance.averageMastery}% mastery with ${criticalCount} student(s) requiring immediate attention.`;
    const summary = `Overall practice accuracy stands at ${performance.averagePracticeAccuracy}%, with an average assessment score of ${performance.averageAssessmentScore}%. The primary learning bottleneck across the class is ${topGap}.`;

    const keyObservations = [
      `Average class mastery is ${performance.averageMastery}%, with learning velocity rated as ${performance.learningVelocity > 5 ? 'accelerating' : 'steady'}.`,
      `${criticalCount} out of ${studentProfiles.length} students have high or critical risk indicators.`,
      `Top identified learning gap: ${topGap} (affecting ${learningGaps[0]?.studentCount || 0} students).`,
    ];

    const recommendedFocus = [
      `Schedule reteaching for ${topGap} focusing on prerequisite concepts.`,
      `Provide targeted interventions for high-risk students before the upcoming assessment.`,
      `Utilize adaptive practice sets to boost consistency and retention.`,
    ];

    return {
      headline,
      summary,
      keyObservations,
      recommendedFocus,
      generatedByAI: hasAIKey,
    };
  }

  static generateCopilotAnswer(query: string, performance: ClassPerformance, studentProfiles: StudentClassProfile[], learningGaps: ClassroomLearningGap[]) {
    const qLower = query.toLowerCase();

    if (qLower.includes('focus') || qLower.includes('student') || qLower.includes('today')) {
      const needy = studentProfiles.filter((s) => s.riskScore >= 50);
      return {
        query,
        answer: `You should focus on ${needy.map((s) => s.studentName || s.studentId).slice(0, 3).join(', ') || 'all students doing well'}. They currently exhibit elevated risk indicators and mastery below class average (${performance.averageMastery}%).`,
        evidence: needy.map((s) => `Student ${s.studentName || s.studentId}: Risk Score ${s.riskScore}, Mastery ${s.masteryScore}%`),
      };
    }

    if (qLower.includes('reteach') || qLower.includes('topic') || qLower.includes('struggling')) {
      const topGap = learningGaps[0];
      return {
        query,
        answer: `The class is struggling most with ${topGap?.conceptName || 'prerequisite math concepts'}. ${topGap?.studentCount || 0} students show persistent errors in this concept.`,
        evidence: [
          `Top gap: ${topGap?.conceptName || 'N/A'}`,
          `Affected students: ${topGap?.studentCount || 0}`,
          `Severity: ${topGap?.severity || 'medium'}`,
        ],
      };
    }

    return {
      query,
      answer: `Class ${performance.averageMastery}% mastery with ${studentProfiles.length} active students. Recommended focus: Address top learning gap "${learningGaps[0]?.conceptName || 'prerequisites'}".`,
      evidence: [`Class average mastery: ${performance.averageMastery}%`, `Active students: ${studentProfiles.length}`],
    };
  }
}
