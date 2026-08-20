import React, { useEffect, useState } from 'react';
import {
  completeStudyPlannerTask,
  fetchStudyPlannerSummary,
  fetchTodayStudyPlanner,
  fetchWeekStudyPlanner,
  refreshStudyPlanner,
} from '../services/api';
import { PlannerHeader } from '../components/study-planner/PlannerHeader';
import { TodaySchedule } from '../components/study-planner/TodaySchedule';
import { StudyTimeBudget } from '../components/study-planner/StudyTimeBudget';
import { WeeklyPlanner } from '../components/study-planner/WeeklyPlanner';
import { PlannerProgress } from '../components/study-planner/PlannerProgress';
import { PlannerPriorityCard } from '../components/study-planner/PlannerPriorityCard';
import { PlannerEmptyState } from '../components/study-planner/PlannerEmptyState';
import { PlannerAIInsight } from '../components/study-planner/PlannerAIInsight';
import { AdaptivePlanNotice } from '../components/study-planner/AdaptivePlanNotice';

export const StudyPlannerPage: React.FC = () => {
  const [todayData, setTodayData] = useState<any>(null);
  const [weekData, setWeekData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const loadPlanner = async (availableMinutes?: number) => {
    setLoading(true);
    setError('');
    try {
      const [todayRes, weekRes, sumRes] = await Promise.all([
        fetchTodayStudyPlanner(availableMinutes),
        fetchWeekStudyPlanner(),
        fetchStudyPlannerSummary(),
      ]);

      if (todayRes.success) setTodayData(todayRes.data);
      else setError(todayRes.message || 'Failed to load today\'s study plan');

      if (weekRes.success) setWeekData(weekRes.data);
      if (sumRes.success) setSummaryData(sumRes.data);
    } catch (err: any) {
      setError(err?.message || 'Error loading study planner');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await refreshStudyPlanner(todayData?.availableMinutes);
      if (res.success) {
        setTodayData(res.data);
        const [wRes, sRes] = await Promise.all([fetchWeekStudyPlanner(), fetchStudyPlannerSummary()]);
        if (wRes.success) setWeekData(wRes.data);
        if (sRes.success) setSummaryData(sRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh schedule');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTaskId(taskId);
    try {
      const res = await completeStudyPlannerTask(taskId);
      if (res.success && res.data) {
        setTodayData(res.data);
        const sRes = await fetchStudyPlannerSummary();
        if (sRes.success) setSummaryData(sRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to complete task');
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handleTimeBudgetChange = (minutes: number) => {
    loadPlanner(minutes);
  };

  useEffect(() => {
    loadPlanner();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <PlannerHeader
        date={todayData?.date || new Date().toISOString().split('T')[0]}
        onRefresh={handleRefresh}
        loading={refreshing || loading}
      />

      <AdaptivePlanNotice />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Building personalized adaptive study schedule...</div>
      ) : !todayData || !todayData.tasks || todayData.tasks.length === 0 ? (
        <PlannerEmptyState onGenerate={handleRefresh} />
      ) : (
        <div className="space-y-6">
          <PlannerPriorityCard topPriority={todayData.topPriority} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StudyTimeBudget
              availableMinutes={todayData.availableMinutes}
              plannedMinutes={todayData.plannedMinutes}
              completedMinutes={todayData.completedMinutes}
              onUpdateAvailable={handleTimeBudgetChange}
            />

            <PlannerProgress
              completionPercent={todayData.completionPercent}
              plannedMinutes={todayData.plannedMinutes}
              completedMinutes={todayData.completedMinutes}
            />
          </div>

          <TodaySchedule
            tasks={todayData.tasks}
            onCompleteTask={handleCompleteTask}
            completingTaskId={completingTaskId}
          />

          <WeeklyPlanner weeklyData={weekData} />

          <PlannerAIInsight summary={summaryData} />
        </div>
      )}
    </div>
  );
};

export default StudyPlannerPage;
