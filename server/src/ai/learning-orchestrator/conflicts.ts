import { OrchestrationActionItem, BlockedAction } from './types.js';

export class ConflictResolutionEngine {
  static resolveConflicts(actions: OrchestrationActionItem[]): {
    executableActions: OrchestrationActionItem[];
    blockedActions: BlockedAction[];
  } {
    const executableActions: OrchestrationActionItem[] = [];
    const blockedActions: BlockedAction[] = [];

    // Concept prerequisite map
    const prereqMap: Record<string, string> = {
      math_polynomials: 'math_quadratic',
      sci_lens_formula: 'sci_light_reflection',
    };

    const completedOrActiveConcepts = new Set<string>();

    actions.forEach((act) => {
      const neededPrereq = prereqMap[act.conceptId];
      if (neededPrereq && !completedOrActiveConcepts.has(neededPrereq) && act.conceptId !== neededPrereq) {
        act.status = 'blocked';
        act.prerequisiteActionId = `act_prereq_${neededPrereq}`;
        blockedActions.push({
          action: act,
          blockedByConceptId: neededPrereq,
          dependencyReason: `Prerequisite concept (${neededPrereq}) must be mastered before advancing to ${act.topic}.`,
        });
      } else {
        executableActions.push(act);
        completedOrActiveConcepts.add(act.conceptId);
      }
    });

    return {
      executableActions,
      blockedActions,
    };
  }
}
