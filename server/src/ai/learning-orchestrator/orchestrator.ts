import { IntelligenceSnapshotEngine } from './snapshot.js';
import { SignalNormalizationEngine } from './signals.js';
import { PriorityEngine } from './prioritizer.js';
import { ConflictResolutionEngine } from './conflicts.js';
import { ActionDeduplicationEngine } from './dedupe.js';
import { NextActionEngine } from './next-action.js';
import { DailyOrchestrationEngine } from './daily.js';
import { WeeklyOrchestrationEngine } from './weekly.js';
import { AIOrchestratorCoach } from './ai-coach.js';
import { OrchestrationPlan } from './types.js';

export class LearningOrchestratorEngine {
  static async generatePlan(studentId: string, availableMinutes: number = 60): Promise<OrchestrationPlan> {
    const snapshot = await IntelligenceSnapshotEngine.collectSnapshot(studentId);
    snapshot.availableDailyMinutes = availableMinutes;

    const rawSignals = SignalNormalizationEngine.extractSignals(snapshot);
    const rankedActions = PriorityEngine.scoreAndRankSignals(rawSignals, studentId);
    const dedupedActions = ActionDeduplicationEngine.deduplicate(rankedActions);
    const { executableActions, blockedActions } = ConflictResolutionEngine.resolveConflicts(dedupedActions);

    const nextBestAction = NextActionEngine.selectNextBestAction(executableActions);
    const dailyPlan = DailyOrchestrationEngine.createDailyPlan(executableActions, availableMinutes);
    const weeklyPlan = WeeklyOrchestrationEngine.createWeeklyPlan(executableActions, availableMinutes);

    let overallStatus: 'on_track' | 'needs_attention' | 'high_priority' | 'critical' = 'on_track';
    if (snapshot.riskLevel === 'critical' || snapshot.rootGaps.length > 1) overallStatus = 'critical';
    else if (snapshot.riskLevel === 'high') overallStatus = 'high_priority';
    else if (snapshot.rootGaps.length === 1) overallStatus = 'needs_attention';

    const insight = AIOrchestratorCoach.generateInsight(nextBestAction, overallStatus);

    return {
      planId: `orch_plan_${studentId}_${Date.now()}`,
      studentId,
      generatedAt: new Date(),
      date: new Date(),
      overallStatus,
      topPriority: nextBestAction.topic,
      dailyMinutesAvailable: availableMinutes,
      nextBestAction,
      actions: executableActions,
      blockedActions,
      completedActions: [],
      dailyPlan,
      weeklyPlan,
      insight,
    };
  }
}
