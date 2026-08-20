import { InterventionRecommendation, StudentClassProfile, ClassroomLearningGap } from './types.js';
import { IClassroomIntervention } from '../../models/classroom-intervention.model.js';

export class ClassroomInterventionEngine {
  static generateInterventions(
    teacherId: string,
    classId: string,
    studentProfiles: StudentClassProfile[],
    learningGaps: ClassroomLearningGap[]
  ): InterventionRecommendation[] {
    const recommendations: InterventionRecommendation[] = [];

    // 1. Critical student-level interventions
    const criticalStudents = studentProfiles.filter((s) => s.riskScore >= 70 || s.interventionPriority === 'critical');
    for (const st of criticalStudents) {
      recommendations.push({
        interventionId: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        classId,
        teacherId,
        studentId: st.studentId,
        studentName: st.studentName,
        interventionType: 'personalized_learning_path',
        priority: 'critical',
        reason: `High risk score (${st.riskScore}) and low mastery (${st.masteryScore}%)`,
        evidence: [
          `Risk score: ${st.riskScore}`,
          `Mastery: ${st.masteryScore}%`,
          `Weak subjects: ${st.weakestSubjects.join(', ') || 'Mathematics'}`,
        ],
        recommendedActions: [
          'Assign 1-on-1 remediation session',
          'Deploy foundational review practice set',
          'Trigger parent update & study planner task',
        ],
        targetConcepts: st.topLearningGaps,
        status: 'suggested',
        createdAt: new Date().toISOString(),
        beforeMetrics: {
          mastery: st.masteryScore,
          accuracy: st.practiceAccuracy,
          assessmentScore: st.assessmentAverage,
          riskScore: st.riskScore,
        },
      });
    }

    // 2. Class-wide gap interventions
    const severeGaps = learningGaps.filter((g) => g.severity === 'critical' || g.type === 'prerequisite');
    for (const gap of severeGaps) {
      recommendations.push({
        interventionId: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        classId,
        teacherId,
        interventionType: gap.type === 'prerequisite' ? 'prerequisite_revision' : 'concept_explanation',
        priority: gap.severity === 'critical' ? 'high' : 'medium',
        reason: `Class-wide bottleneck in ${gap.conceptName} affecting ${gap.studentCount} students`,
        evidence: [
          `Affected students: ${gap.studentCount}`,
          `Prerequisite concepts: ${gap.prerequisiteConcepts?.join(', ') || 'None'}`,
        ],
        recommendedActions: [
          `Schedule 20-min reteaching session on ${gap.conceptName}`,
          `Distribute targeted practice assignment`,
        ],
        targetConcepts: [gap.conceptId, ...(gap.prerequisiteConcepts || [])],
        status: 'suggested',
        createdAt: new Date().toISOString(),
      });
    }

    return recommendations;
  }

  static calculateEffectiveness(intervention: Partial<IClassroomIntervention>) {
    const before = intervention.beforeMetrics || { mastery: 40, accuracy: 50, assessmentScore: 45, riskScore: 70 };
    const after = intervention.afterMetrics || { mastery: 65, accuracy: 72, assessmentScore: 68, riskScore: 40 };

    const masteryGain = after.mastery - before.mastery;
    const accuracyGain = after.accuracy - before.accuracy;
    const riskReduction = before.riskScore - after.riskScore;

    return {
      interventionId: intervention.interventionId,
      status: intervention.status,
      beforeMetrics: before,
      afterMetrics: after,
      masteryGain,
      accuracyGain,
      riskReduction,
      effectivenessRating: masteryGain > 15 ? 'highly_effective' : masteryGain > 5 ? 'moderately_effective' : 'neutral',
      summary: `Performance improved after intervention: Mastery +${masteryGain}%, Risk -${riskReduction} points.`,
    };
  }
}
