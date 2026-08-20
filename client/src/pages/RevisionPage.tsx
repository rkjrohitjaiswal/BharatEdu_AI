import React, { useEffect, useState } from 'react';
import { CheckCircle2, Play, X } from 'lucide-react';
import {
  completeRevisionSession,
  fetchOverdueRevisionItems,
  fetchRevisionSummary,
  fetchTodayRevisionPlan,
  fetchWeeklyRevisionPlan,
  refreshRevisionPlan,
  startRevisionSession,
} from '../services/api';
import { RevisionAIInsight } from '../components/revision/RevisionAIInsight';
import { RevisionDueCard } from '../components/revision/RevisionDueCard';
import { RevisionEmptyState } from '../components/revision/RevisionEmptyState';
import { RevisionHeader } from '../components/revision/RevisionHeader';
import { RevisionOverdueCard } from '../components/revision/RevisionOverdueCard';
import { RevisionProgress } from '../components/revision/RevisionProgress';
import { RevisionSummary } from '../components/revision/RevisionSummary';
import { RevisionWeeklyPlan } from '../components/revision/RevisionWeeklyPlan';

export const RevisionPage: React.FC = () => {
  const [todayPlan, setTodayPlan] = useState<any>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [overdueItems, setOverdueItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Active Review Modal State
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(5);
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(4);
  const [reviewResult, setReviewResult] = useState<any | null>(null);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [todayRes, weekRes, sumRes, overdueRes] = await Promise.all([
        fetchTodayRevisionPlan(),
        fetchWeeklyRevisionPlan(),
        fetchRevisionSummary(),
        fetchOverdueRevisionItems(),
      ]);

      if (todayRes.success) setTodayPlan(todayRes.data);
      else setError(todayRes.message || 'Failed to load today revision plan');

      if (weekRes.success) setWeeklyPlan(weekRes.data);
      if (sumRes.success) setSummary(sumRes.data);
      if (overdueRes.success && Array.isArray(overdueRes.data)) setOverdueItems(overdueRes.data);
    } catch (err: any) {
      setError(err?.message || 'Error loading revision data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await refreshRevisionPlan();
      if (res.success) {
        setTodayPlan(res.data);
        const [weekRes, sumRes, overdueRes] = await Promise.all([
          fetchWeeklyRevisionPlan(),
          fetchRevisionSummary(),
          fetchOverdueRevisionItems(),
        ]);
        if (weekRes.success) setWeeklyPlan(weekRes.data);
        if (sumRes.success) setSummary(sumRes.data);
        if (overdueRes.success && Array.isArray(overdueRes.data)) setOverdueItems(overdueRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh plan');
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartReview = async (task: any) => {
    setActiveTask(task);
    setReviewResult(null);
    setQuestionsAttempted(5);
    setQuestionsCorrect(4);
    setIsReviewing(true);
    try {
      await startRevisionSession(task.id || task.topic);
    } catch (err) {
      console.error('Start session error', err);
    }
  };

  const handleCompleteReview = async () => {
    if (!activeTask) return;
    setSubmittingReview(true);
    try {
      const res = await completeRevisionSession(
        activeTask.id || activeTask.topic,
        questionsAttempted,
        questionsCorrect
      );
      if (res.success && res.data) {
        setReviewResult(res.data);
        await loadData();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to complete review session');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dueTasks = todayPlan?.tasks || [];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <RevisionHeader onRefresh={handleRefresh} refreshing={refreshing} />

      {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">{error}</div>}

      <RevisionSummary summary={summary} />

      {todayPlan && <RevisionProgress completed={0} total={todayPlan.totalDue || dueTasks.length} />}

      <RevisionAIInsight summary={summary} />

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Calculating memory retention & spaced repetition schedules...</div>
      ) : dueTasks.length > 0 || overdueItems.length > 0 ? (
        <div className="space-y-6">
          <RevisionOverdueCard overdueTasks={overdueItems} onStartReview={handleStartReview} />
          <RevisionDueCard dueTasks={dueTasks} onStartReview={handleStartReview} />
          <RevisionWeeklyPlan weeklyData={weeklyPlan} />
        </div>
      ) : (
        <RevisionEmptyState onRefresh={handleRefresh} />
      )}

      {/* Review Modal */}
      {isReviewing && activeTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeTask.subject}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">{activeTask.topic}</h3>
              </div>

              <button
                onClick={() => setIsReviewing(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!reviewResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800">Review Concept Summary</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Quickly review key formulas and concepts for {activeTask.topic}. Complete the 5 self-check practice questions below to update your retention score.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>Questions Attempted:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={questionsAttempted}
                      onChange={(e) => setQuestionsAttempted(Number(e.target.value))}
                      className="w-16 p-1.5 rounded-xl border border-slate-200 text-center font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>Questions Correct:</span>
                    <input
                      type="number"
                      min={0}
                      max={questionsAttempted}
                      value={questionsCorrect}
                      onChange={(e) => setQuestionsCorrect(Number(e.target.value))}
                      className="w-16 p-1.5 rounded-xl border border-slate-200 text-center font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCompleteReview}
                  disabled={submittingReview}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Submit & Update Retention</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Review Session Completed!</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Result: <span className="font-bold uppercase text-indigo-700">{reviewResult.session?.result}</span> ({reviewResult.session?.accuracy}% accuracy)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div>New Retention Score: <span className="font-bold text-emerald-700">{reviewResult.updatedItem?.retentionScore}%</span></div>
                  <div>Next Scheduled Review: <span className="font-bold text-slate-800">{new Date(reviewResult.updatedItem?.nextReviewAt).toLocaleDateString()}</span></div>
                </div>

                <button
                  onClick={() => setIsReviewing(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionPage;
