import { ClassroomLearningGap, StudentClassProfile } from './types.js';

export class ClassroomGapsEngine {
  static identifyClassroomGaps(
    studentProfiles: StudentClassProfile[],
    conceptPerformanceMap: Map<string, { conceptId: string; conceptName: string; subject: string; score: number; isPrerequisite: boolean; prereqs: string[] }>
  ): ClassroomLearningGap[] {
    const gapsMap = new Map<string, ClassroomLearningGap>();

    for (const profile of studentProfiles) {
      for (const gapName of profile.topLearningGaps) {
        const gapId = `gap_${gapName.toLowerCase().replace(/\s+/g, '_')}`;
        const existing = gapsMap.get(gapId) || {
          gapId,
          conceptId: gapId,
          conceptName: gapName,
          subject: 'General',
          studentCount: 0,
          affectedStudents: [],
          severity: 'medium',
          type: 'common',
          prerequisiteConcepts: [],
          examRelevanceScore: 75,
        };

        existing.studentCount += 1;
        existing.affectedStudents.push({
          studentId: profile.studentId,
          studentName: profile.studentName,
          score: profile.masteryScore,
        });

        // Determine severity & type
        if (existing.studentCount > Math.ceil(studentProfiles.length * 0.4)) {
          existing.severity = 'critical';
          existing.type = 'common';
        } else if (existing.studentCount > Math.ceil(studentProfiles.length * 0.25)) {
          existing.severity = 'high';
          existing.type = 'severe';
        }

        const conceptMeta = conceptPerformanceMap.get(gapName.toLowerCase());
        if (conceptMeta) {
          existing.subject = conceptMeta.subject;
          if (conceptMeta.isPrerequisite) {
            existing.type = 'prerequisite';
            existing.prerequisiteConcepts = conceptMeta.prereqs;
          }
        }

        gapsMap.set(gapId, existing);
      }
    }

    const result = Array.from(gapsMap.values());

    // Rank gaps by impact (studentCount * severity multiplier * examRelevance)
    result.sort((a, b) => {
      const multA = a.severity === 'critical' ? 4 : a.severity === 'high' ? 3 : 2;
      const multB = b.severity === 'critical' ? 4 : b.severity === 'high' ? 3 : 2;
      return b.studentCount * multB * b.examRelevanceScore - a.studentCount * multA * a.examRelevanceScore;
    });

    return result;
  }
}
