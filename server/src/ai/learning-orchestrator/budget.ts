import { OrchestrationActionItem } from './types.js';

export class DailyBudgetEngine {
  static fitToBudget(
    actions: OrchestrationActionItem[],
    availableMinutes: number
  ): {
    budgetedActions: OrchestrationActionItem[];
    optionalOverflow: OrchestrationActionItem[];
    totalScheduledMinutes: number;
  } {
    const budgetedActions: OrchestrationActionItem[] = [];
    const optionalOverflow: OrchestrationActionItem[] = [];
    let totalScheduledMinutes = 0;

    for (const act of actions) {
      if (totalScheduledMinutes + act.estimatedMinutes <= availableMinutes) {
        budgetedActions.push(act);
        totalScheduledMinutes += act.estimatedMinutes;
      } else {
        optionalOverflow.push(act);
      }
    }

    return {
      budgetedActions,
      optionalOverflow,
      totalScheduledMinutes,
    };
  }
}
