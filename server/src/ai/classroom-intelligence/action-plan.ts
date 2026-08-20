import { TeacherActionPlan, StudentClassProfile, ClassroomLearningGap, TopicPerformance } from './types.js';

export class TeacherActionPlanGenerator {
  static generateActionPlan(
    studentProfiles: StudentClassProfile[],
    learningGaps: ClassroomLearningGap[],
    topicPerformances: TopicPerformance[]
  ): TeacherActionPlan {
    const atRiskStudents = studentProfiles
      .filter((s) => s.riskScore >= 50)
      .map((s) => ({
        studentId: s.studentId,
        studentName: s.studentName,
        reason: `Risk score: ${s.riskScore}, Mastery: ${s.masteryScore}%`,
        priority: s.riskScore >= 70 ? 'critical' : 'high',
      }));

    const weakTopics = topicPerformances
      .filter((t) => t.category === 'weak' || t.averageMastery < 50)
      .map((t) => ({
        topicId: t.topicId,
        topicName: t.topicName,
        reason: `Average mastery is ${t.averageMastery}% with ${t.mistakeFrequency} mistake logs.`,
      }));

    const topGap = learningGaps[0]?.conceptName || 'Fractions & Ratios';
    const topTopic = weakTopics[0]?.topicName || 'Algebraic Equations';

    return {
      todayPriorities: [
        `Review 1-on-1 intervention queue for ${atRiskStudents.length} high-priority students`,
        `Conduct 15-minute quick diagnostic on ${topGap}`,
        `Publish practice problem set targeting ${topTopic}`,
      ],
      thisWeekPriorities: [
        `Address prerequisite learning gaps in ${learningGaps.map((g) => g.conceptName).slice(0, 3).join(', ') || 'Foundation Mathematics'}`,
        `Run small-group problem solving sessions for struggling students`,
        `Conduct formative assessment on ${topTopic}`,
      ],
      studentsNeedingAttention: atRiskStudents.slice(0, 5),
      topicsNeedingIntervention: weakTopics.slice(0, 5),
      recommendedClassActivity: `Interactive board practice on ${topGap} with step-by-step misconception breakdown.`,
      recommendedSmallGroupActivity: `Peer-guided problem solving on ${topTopic} using structured hint worksheets.`,
      recommendedAssessment: `10-question formative assessment targeting ${topGap} and ${topTopic}.`,
    };
  }
}
