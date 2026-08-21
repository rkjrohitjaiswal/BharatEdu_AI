import { OrchestrationActionItem } from './types.js';

export class ActionDeduplicationEngine {
  static deduplicate(actions: OrchestrationActionItem[]): OrchestrationActionItem[] {
    const seen = new Map<string, OrchestrationActionItem>();

    actions.forEach((act) => {
      const key = `${act.conceptId}_${act.actionType}`;
      if (!seen.has(key)) {
        seen.set(key, act);
      } else {
        const existing = seen.get(key)!;
        if (act.priorityScore > existing.priorityScore) {
          seen.set(key, act);
        }
      }
    });

    return Array.from(seen.values());
  }
}
