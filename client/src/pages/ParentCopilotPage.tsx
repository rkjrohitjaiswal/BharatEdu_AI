import React, { useEffect, useState } from 'react';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import {
  fetchParentCopilotAdvice,
  fetchParentCopilotStudentSnapshot,
  fetchParentCopilotStudents,
} from '../services/api';
import { ParentStudentSelector } from '../components/parent-copilot/ParentStudentSelector';
import { ParentLearningSummary } from '../components/parent-copilot/ParentLearningSummary';
import { ParentRecommendedActions } from '../components/parent-copilot/ParentRecommendedActions';
import { ParentWeeklySupportPlan } from '../components/parent-copilot/ParentWeeklySupportPlan';

export const ParentCopilotPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [snapshot, setSnapshot] = useState<any>(null);
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchParentCopilotStudents();
      if (res.success && Array.isArray(res.data)) {
        setStudents(res.data);
        if (res.data.length > 0) {
          const initialId = String(res.data[0]._id || res.data[0].id);
          setSelectedStudentId(initialId);
        }
      } else {
        setError(res.message || 'Failed to load linked students');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading parent copilot students');
    } finally {
      setLoading(false);
    }
  };

  const loadParentCopilotData = async (studentId: string) => {
    if (!studentId) return;
    setEvaluating(true);
    setError('');
    try {
      const snapRes = await fetchParentCopilotStudentSnapshot(studentId);
      if (snapRes.success) {
        setSnapshot(snapRes.data);
      } else {
        setError(snapRes.message || 'Failed to load parent student snapshot');
      }

      const adviceRes = await fetchParentCopilotAdvice(studentId);
      if (adviceRes.success) {
        setAdvice(adviceRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Error evaluating parent copilot guidance');
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadParentCopilotData(selectedStudentId);
    }
  }, [selectedStudentId]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Parent Copilot</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Understand your child's learning and know how you can help.
            </p>
          </div>
        </div>

        {selectedStudentId && (
          <button
            onClick={() => loadParentCopilotData(selectedStudentId)}
            disabled={evaluating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${evaluating ? 'animate-spin' : ''}`} />
            <span>Refresh Guidance</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading linked students...</div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm">No linked students found for your parent account. Link your child using their invitation code first.</div>
      ) : (
        <div className="space-y-6">
          <ParentStudentSelector
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudent={(id) => setSelectedStudentId(id)}
          />

          {evaluating ? (
            <div className="p-12 text-center text-slate-500 text-sm">Synthesizing parent guidance & weekly home plan...</div>
          ) : (
            <>
              <ParentLearningSummary snapshot={snapshot} />

              {/* AI Explanation Banner */}
              {advice?.parentFriendlyExplanation && (
                <div className="rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-lg text-white">Parent Guidance Summary</h3>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full">
                          {advice.aiGenerated ? 'AI-generated guidance' : 'Deterministic Guidance'}
                        </span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">{advice.parentFriendlyExplanation}</p>
                    </div>
                  </div>
                </div>
              )}

              <ParentWeeklySupportPlan plan={advice?.weeklySupportPlan} aiGenerated={advice?.aiGenerated} />

              <ParentRecommendedActions
                actions={advice?.recommendedHomeSupportActions}
                aiGenerated={advice?.aiGenerated}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentCopilotPage;
