import { OrchestrationActionItem, WeeklyActionPlan, DailyActionPlan } from './types.js';
import { DailyOrchestrationEngine } from './daily.js';

export class WeeklyOrchestrationEngine {
  static createWeeklyPlan(
    actions: OrchestrationActionItem[],
    availableMinutes: number,
    startDate: Date = new Date()
  ): WeeklyActionPlan {
    const endDate = new Date(startDate.getTime() + 6 * 86400000);
    const dailyPlans: Record<string, DailyActionPlan> = {};

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach((day, idx) => {
      const dayDate = new Date(startDate.getTime() + idx * 86400000);
      dailyPlans[day.toLowerCase()] = DailyOrchestrationEngine.createDailyPlan(actions, availableMinutes, dayDate);
    });

    return {
      startDate,
      endDate,
      dailyPlans,
      weeklyFocus: 'Prerequisite Gap Repair & Board Exam Practice Readiness',
    };
  }
}
