import React, { useEffect, useState } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchDailyRevisionQueue,
  fetchRevisionSchedule,
  refreshStudentRevisionQueue,
  startRevisionSessionTracking,
  submitRevisionOutcome,
} from '../services/api';
import { RevisionAIInsight } from '../components/revision/RevisionAIInsight';
import { RevisionCard } from '../components/revision/RevisionCard';
import { RevisionEmptyState } from '../components/revision/RevisionEmptyState';
import { RevisionSchedule } from '../components/revision/RevisionSchedule';
import { RevisionTodaySummary } from '../components/revision/RevisionTodaySummary';

export const SmartRevisionPage: React.FC = () => {
  const { user } = useAuth();
  const [queueData, setQueueData] = useState<any | null>(null);
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const [qRes, sRes] = await Promise.all([
        fetchDailyRevisionQueue(),
        fetchRevisionSchedule(7),
      ]);

      if (qRes.success && qRes.data) {
        setQueueData(qRes.data);
      }
      if (sRes.success && Array.isArray(sRes.data)) {
        setScheduleData(sRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading revision workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRevision = async (item: any) => {
    await startRevisionSessionTracking(item.id);
  };

  const handleReviewOutcome = async (id: string, outcome: 'again' | 'hard' | 'good' | 'easy') => {
    await submitRevisionOutcome(id, outcome);
    loadData();
  };

  const handleRefresh = async () => {
    setLoading(true);
    await refreshStudentRevisionQueue();
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const items = queueData?.revisionItems || [];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Revision Workspace</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Intelligent spaced repetition schedule powered by Knowledge Graph & Learning Gaps
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {error && <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs font-semibold">{error}</div>}

      {/* AI Coach Advice */}
      {queueData?.aiExplanation && <RevisionAIInsight advice={queueData.aiExplanation} />}

      {/* Today's Queue Summary Stats */}
      {queueData && (
        <RevisionTodaySummary
          totalDue={queueData.totalDue || 0}
          criticalCount={queueData.prioritySummary?.critical || 0}
          highCount={queueData.prioritySummary?.high || 0}
          estimatedMinutes={queueData.estimatedMinutes || 0}
        />
      )}

      {/* 7-Day Repetition Forecast */}
      <RevisionSchedule schedule={scheduleData} />

      {/* Revision Queue List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">Today's Due Revision Items</h3>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item: any) => (
              <RevisionCard
                key={item.id}
                item={item}
                onStart={handleStartRevision}
                onReview={handleReviewOutcome}
              />
            ))}
          </div>
        ) : (
          <RevisionEmptyState />
        )}
      </div>
    </div>
  );
};

export default SmartRevisionPage;
