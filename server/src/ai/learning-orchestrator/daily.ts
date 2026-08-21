import { OrchestrationActionItem, DailyActionPlan } from './types.js';
import { DailyBudgetEngine } from './budget.js';

export class DailyOrchestrationEngine {
  static createDailyPlan(
    actions: OrchestrationActionItem[],
    availableMinutes: number,
    date: Date = new Date()
  ): DailyActionPlan {
    const { budgetedActions, optionalOverflow, totalScheduledMinutes } = DailyBudgetEngine.fitToBudget(
      actions,
      availableMinutes
    );

    const morning: OrchestrationActionItem[] = [];
    const afternoon: OrchestrationActionItem[] = [];
    const evening: OrchestrationActionItem[] = [];

    budgetedActions.forEach((act, idx) => {
      if (idx % 3 === 0) morning.push(act);
      else if (idx % 3 === 1) afternoon.push(act);
      else evening.push(act);
    });

    return {
      date,
      totalAvailableMinutes: availableMinutes,
      totalScheduledMinutes,
      morning,
      afternoon,
      evening,
      optionalOverflow,
    };
  }
}
