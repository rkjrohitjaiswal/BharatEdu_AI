import { ConceptEffectivenessAssociation } from './types.js';

export class ConceptEffectivenessEngine {
  static getConceptAssociations(studentId: string): ConceptEffectivenessAssociation[] {
    return [
      {
        conceptId: 'math_quadratic',
        topic: 'Quadratic Equations',
        actionType: 'doubt',
        observedDelta: 17,
        sampleSize: 4,
        classification: 'strongly_effective',
        summaryText: 'AI Doubt Solver interactions appear associated with +17% mastery improvement in Quadratic Equations.',
      },
      {
        conceptId: 'math_quadratic',
        topic: 'Quadratic Equations',
        actionType: 'practice',
        observedDelta: 10,
        sampleSize: 6,
        classification: 'effective',
        summaryText: 'Targeted practice sets appear associated with +10% mastery improvement in Quadratic Equations.',
      },
      {
        conceptId: 'sci_light_reflection',
        topic: 'Light Reflection',
        actionType: 'revise',
        observedDelta: 8,
        sampleSize: 5,
        classification: 'effective',
        summaryText: 'Spaced smart revision appears associated with +8% recall retention in Light Reflection.',
      },
    ];
  }
}
