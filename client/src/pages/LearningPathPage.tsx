import React, { useEffect, useState } from 'react';
import { ILearningPathDTO, ILearningPathStageDTO, ILearningPathTaskDTO } from '../types/learning-path';
import { LearningLevelCard } from '../components/learning-path/LearningLevelCard';
import { LearningPathAIInsight } from '../components/learning-path/LearningPathAIInsight';
import { LearningPathHeader } from '../components/learning-path/LearningPathHeader';
import { LearningPathNextConcept } from '../components/learning-path/LearningPathNextConcept';
import { LearningPathProgress } from '../components/learning-path/LearningPathProgress';
import { LearningPathStageCard } from '../components/learning-path/LearningPathStage';
import {
  completeLearningStage,
  completeLearningTask,
  fetchLearningPathDetails,
  refreshLearningPath,
  startLearningTask,
} from '../services/api';

export const LearningPathPage: React.FC = () => {
  const [path, setPath] = useState<ILearningPathDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchLearningPathDetails();
      if (res.success && res.data) {
        setPath(res.data);
      } else {
        setError(res.message || 'Failed to load learning path');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading learning path');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await refreshLearningPath();
      if (res.success && res.data) {
        setPath(res.data);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleTaskStart = async (taskId: string) => {
    if (!path) return;
    await startLearningTask(path.id, taskId);
    await loadData();
  };

  const handleTaskComplete = async (taskId: string) => {
    if (!path) return;
    await completeLearningTask(path.id, taskId);
    await loadData();
  };

  const handleStageComplete = async (stageId: string) => {
    if (!path) return;
    await completeLearningStage(path.id, stageId);
    await loadData();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-40 bg-slate-200 rounded-3xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-md mx-auto">
          {error || 'Unable to load your curriculum learning path.'}
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <LearningPathHeader
        title={path.title}
        description={path.description}
        board={path.board}
        classLevel={path.classLevel}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* AI Advice Banner */}
      <LearningPathAIInsight description={path.description} />

      {/* Level & Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LearningLevelCard level={path.learningLevel} score={path.learningLevelScore} />
        <LearningPathProgress
          progressPercent={path.progressPercent}
          completedStages={path.completedStages}
          totalStages={path.totalStages}
          estimatedTotalMinutes={path.estimatedTotalMinutes}
          dailyMinutes={path.dailyMinutes}
        />
      </div>

      {/* Next Best Concept Card */}
      {path.nextBestConcept && (
        <LearningPathNextConcept
          nextConcept={path.nextBestConcept}
          onStart={() => {
            const activeStage = path.stages.find((s: ILearningPathStageDTO) => s.stageIndex === path.currentStage);
            const pendingTask = activeStage?.tasks.find((t: ILearningPathTaskDTO) => t.status === 'pending' || t.status === 'active');
            if (pendingTask) handleTaskStart(pendingTask.id);
          }}
        />
      )}

      {/* Curriculum Stages List */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Personalized Curriculum Stages ({path.stages.length})</h2>
        <div className="space-y-4">
          {path.stages.map((stage: ILearningPathStageDTO) => (
            <LearningPathStageCard
              key={stage.id}
              stage={stage}
              isCurrent={stage.stageIndex === path.currentStage}
              onTaskStart={handleTaskStart}
              onTaskComplete={handleTaskComplete}
              onStageComplete={handleStageComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
