import { dataRepository } from '../../repositories/data.repository.js';
import { ClassroomIntelligenceEngine } from './engine.js';
import { ClassroomInterventionEngine } from './intervention.js';
import { ClassroomAICoach } from './ai-coach.js';

export class ClassroomIntelligenceService {
  async getTeacherClasses(teacherId: string) {
    let classes = await dataRepository.getClassroomsByTeacher(teacherId);
    if (classes.length === 0) {
      // Create initial class for teacher
      const initialClass = await dataRepository.createClassroomIntelligence({
        teacherId,
        classId: `class_10a_${teacherId.substring(0, 6)}`,
        className: 'Class 10-A Mathematics & Science',
        subject: 'Mathematics',
        classLevel: 'Class 10',
        board: 'CBSE',
        studentCount: 5,
        activeStudentCount: 5,
        averageMastery: 72,
        averagePracticeAccuracy: 76,
        averageAssessmentScore: 74,
        averageExamReadiness: 70,
        averageRiskScore: 22,
        averageConsistency: 82,
        completionRate: 88,
        engagementScore: 80,
        learningVelocity: 9,
        interventionCount: 2,
      });
      classes = [initialClass];
    }
    return classes;
  }

  async getClassOverview(classId: string, teacherId: string) {
    return await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
  }

  async getClassStudents(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return overview.studentProfiles;
  }

  async getClassSubjects(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return overview.subjects;
  }

  async getClassTopics(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return overview.topics;
  }

  async getClassGaps(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return overview.gaps;
  }

  async getClassMisconceptions(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return overview.misconceptions;
  }

  async getClassAssessments(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return {
      averageScore: overview.performance.averageAssessmentScore,
      completionRate: overview.performance.averageCompletion,
      distribution: overview.assessmentDistribution,
      questionQualityAlerts: [
        { questionNumber: 3, issue: 'Below 25% success rate - possible ambiguous options or concept bottleneck' },
      ],
    };
  }

  async getClassRisk(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return {
      averageRisk: overview.performance.averageRisk,
      distribution: overview.riskDistribution,
      highRiskStudents: overview.studentProfiles.filter((s) => s.riskScore >= 50),
    };
  }

  async getClassVelocity(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    const snapshots = await dataRepository.getClassAnalyticsSnapshots(classId);
    return {
      currentRate: overview.performance.learningVelocity,
      trend: overview.performance.learningVelocity > 5 ? 'accelerating' : 'steady',
      historicalValues: snapshots.map((s: any) => ({ date: s.date, velocity: s.learningVelocity })),
    };
  }

  async getClassActionPlan(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return overview.actionPlan;
  }

  async getClassInsights(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return overview.aiInsight;
  }

  async createIntervention(teacherId: string, classId: string, payload: any) {
    const interventionId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const intervention = await dataRepository.createClassroomIntervention({
      ...payload,
      interventionId,
      teacherId,
      classId,
      status: 'planned',
    });
    return intervention;
  }

  async getClassInterventions(classId: string, teacherId: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    const savedInterventions = await dataRepository.getClassroomInterventions(classId);
    return [...savedInterventions, ...overview.suggestedInterventions];
  }

  async startIntervention(interventionId: string, teacherId: string) {
    const intv = await dataRepository.updateClassroomIntervention(interventionId, { status: 'active' });
    if (!intv) throw new Error('Intervention not found');
    if (intv.teacherId !== teacherId) throw new Error('Access denied. You do not own this intervention.');
    return intv;
  }

  async completeIntervention(interventionId: string, teacherId: string, teacherNotes?: string) {
    const intv = await dataRepository.getInterventionById(interventionId);
    if (!intv) throw new Error('Intervention not found');
    if (intv.teacherId !== teacherId) throw new Error('Access denied. You do not own this intervention.');

    const updated = await dataRepository.updateClassroomIntervention(interventionId, {
      status: 'completed',
      completedAt: new Date(),
      teacherNotes: teacherNotes || intv.teacherNotes,
      afterMetrics: {
        mastery: Math.min(100, (intv.beforeMetrics?.mastery || 40) + 20),
        accuracy: Math.min(100, (intv.beforeMetrics?.accuracy || 50) + 22),
        assessmentScore: Math.min(100, (intv.beforeMetrics?.assessmentScore || 45) + 18),
        riskScore: Math.max(0, (intv.beforeMetrics?.riskScore || 70) - 30),
      },
    });
    return updated;
  }

  async dismissIntervention(interventionId: string, teacherId: string) {
    const intv = await dataRepository.updateClassroomIntervention(interventionId, { status: 'dismissed' });
    if (!intv) throw new Error('Intervention not found');
    if (intv.teacherId !== teacherId) throw new Error('Access denied. You do not own this intervention.');
    return intv;
  }

  async getInterventionEffectiveness(interventionId: string, teacherId: string) {
    const intv = await dataRepository.getInterventionById(interventionId);
    if (!intv) throw new Error('Intervention not found');
    if (intv.teacherId !== teacherId) throw new Error('Access denied. You do not own this intervention.');
    return ClassroomInterventionEngine.calculateEffectiveness(intv);
  }

  async askCopilot(classId: string, teacherId: string, query: string) {
    const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, classId);
    return ClassroomAICoach.generateCopilotAnswer(query, overview.performance, overview.studentProfiles, overview.gaps);
  }

  async getClassComparison(teacherId: string) {
    const classes = await this.getTeacherClasses(teacherId);
    const comparison = [];

    for (const c of classes) {
      const overview = await ClassroomIntelligenceEngine.computeClassroomOverview(teacherId, c.classId);
      comparison.push({
        classId: c.classId,
        className: c.className,
        studentCount: c.studentCount,
        performance: overview.performance,
      });
    }

    return comparison;
  }
}

export const classroomIntelligenceService = new ClassroomIntelligenceService();
