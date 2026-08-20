import { ClassroomMisconception } from './types.js';

export class ClassroomMisconceptionAggregator {
  static aggregateMisconceptions(
    practiceMistakes: any[],
    assessmentEvaluations: any[],
    doubtsSummary: { topic: string; count: number }[]
  ): ClassroomMisconception[] {
    const map = new Map<string, ClassroomMisconception>();

    // 1. Process practice mistakes
    for (const m of practiceMistakes) {
      const tag = m.misconceptionTag || m.conceptId || 'algebraic_misconception';
      const id = `misc_${tag.toLowerCase().replace(/\s+/g, '_')}`;
      const existing = map.get(id) || {
        misconceptionId: id,
        tag,
        description: m.description || `Recurring error pattern in ${tag.replace(/_/g, ' ')}`,
        conceptId: m.conceptId || tag,
        studentCount: 0,
        sources: ['practice'],
        severity: 'medium',
      };
      existing.studentCount += 1;
      if (!existing.sources.includes('practice')) existing.sources.push('practice');
      map.set(id, existing);
    }

    // 2. Process assessment evaluations
    for (const ev of assessmentEvaluations) {
      if (ev.misconceptionTags && Array.isArray(ev.misconceptionTags)) {
        for (const tag of ev.misconceptionTags) {
          const id = `misc_${tag.toLowerCase().replace(/\s+/g, '_')}`;
          const existing = map.get(id) || {
            misconceptionId: id,
            tag,
            description: `Assessment misconception: ${tag.replace(/_/g, ' ')}`,
            conceptId: ev.questionId || tag,
            studentCount: 0,
            sources: ['assessment'],
            severity: 'high',
          };
          existing.studentCount += 1;
          if (!existing.sources.includes('assessment')) existing.sources.push('assessment');
          map.set(id, existing);
        }
      }
    }

    // 3. Process doubts aggregated educational signals (No private content exposed!)
    for (const d of doubtsSummary) {
      const tag = d.topic;
      const id = `misc_${tag.toLowerCase().replace(/\s+/g, '_')}`;
      const existing = map.get(id) || {
        misconceptionId: id,
        tag,
        description: `High doubt frequency around ${tag.replace(/_/g, ' ')}`,
        conceptId: tag,
        studentCount: d.count,
        sources: ['doubt'],
        severity: 'medium',
      };
      if (!existing.sources.includes('doubt')) existing.sources.push('doubt');
      map.set(id, existing);
    }

    const result = Array.from(map.values());
    result.forEach((m) => {
      if (m.studentCount > 5 || m.sources.length >= 2) {
        m.severity = 'high';
      }
    });

    result.sort((a, b) => b.studentCount - a.studentCount);
    return result;
  }
}
