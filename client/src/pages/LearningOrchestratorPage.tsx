import React, { useEffect, useState } from 'react';
import {
  fetchStudentOrchestrator,
  refreshStudentOrchestratorPlan,
  completeOrchestrationAction,
  skipOrchestrationAction,
} from '../services/api';
import { OrchestratorHeader } from '../components/orchestrator/OrchestratorHeader';
import { OrchestratorStatus } from '../components/orchestrator/OrchestratorStatus';
import { NextBestAction } from '../components/orchestrator/NextBestAction';
import { DailyActionPlan } from '../components/orchestrator/DailyActionPlan';
import { OrchestratorInsight } from '../components/orchestrator/OrchestratorInsight';
import { PriorityActionCard } from '../components/orchestrator/PriorityActionCard';
import { BlockedActionCard } from '../components/orchestrator/BlockedActionCard';

export const LearningOrchestratorPage: React.FC = () => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    const res = await fetchStudentOrchestrator();
    if (res.success && res.data) {
      setPlan(res.data);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const res = await refreshStudentOrchestratorPlan();
    if (res.success && res.data) {
      setPlan(res.data);
    }
    setRefreshing(false);
  };

  const handleComplete = async (actionId: string) => {
    const res = await completeOrchestrationAction(actionId);
    if (res.success) {
      handleRefresh();
    }
  };

  const handleSkip = async (actionId: string) => {
    const res = await skipOrchestrationAction(actionId);
    if (res.success) {
      handleRefresh();
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading AI Learning Orchestrator...</span>
      </div>
    );
  }

  if (!plan) {
    return <div className="p-8 text-center text-gray-500">Failed to load orchestrator plan.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <OrchestratorHeader onRefresh={handleRefresh} isRefreshing={refreshing} />

      <OrchestratorStatus
        status={plan.overallStatus}
        topPriority={plan.topPriority}
        minutesAvailable={plan.dailyMinutesAvailable}
      />

      {plan.nextBestAction && (
        <NextBestAction action={plan.nextBestAction} onComplete={handleComplete} />
      )}

      {plan.insight && <OrchestratorInsight insight={plan.insight} />}

      {plan.dailyPlan && (
        <DailyActionPlan dailyPlan={plan.dailyPlan} onComplete={handleComplete} onSkip={handleSkip} />
      )}

      {/* Executable Priority Queue */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          All Prioritized Actions ({plan.actions?.length || 0})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plan.actions?.map((act: any, idx: number) => (
            <PriorityActionCard key={idx} action={act} onComplete={handleComplete} onSkip={handleSkip} />
          ))}
        </div>
      </div>

      {/* Blocked Actions */}
      {plan.blockedActions && plan.blockedActions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
            Blocked Actions ({plan.blockedActions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.blockedActions.map((blocked: any, idx: number) => (
              <BlockedActionCard key={idx} blocked={blocked} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
