import React, { useEffect, useState } from 'react';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import {
  fetchTeacherCopilotAdvice,
  fetchTeacherCopilotStudentSnapshot,
  fetchTeacherCopilotStudents,
} from '../services/api';
import { TeacherStudentSelector } from '../components/teacher-copilot/TeacherStudentSelector';
import { TeacherStudentSummary } from '../components/teacher-copilot/TeacherStudentSummary';
import { TeacherRecommendedActions } from '../components/teacher-copilot/TeacherRecommendedActions';
import { TeacherWeeklyPlan } from '../components/teacher-copilot/TeacherWeeklyPlan';
import { TeacherParentMessage } from '../components/teacher-copilot/TeacherParentMessage';

export const TeacherCopilotPage: React.FC = () => {
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
      const res = await fetchTeacherCopilotStudents();
      if (res.success && Array.isArray(res.data)) {
        setStudents(res.data);
        if (res.data.length > 0) {
          const initialId = String(res.data[0]._id || res.data[0].id);
          setSelectedStudentId(initialId);
        }
      } else {
        setError(res.message || 'Failed to load authorized teacher students');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading teacher copilot students');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentCopilotData = async (studentId: string) => {
    if (!studentId) return;
    setEvaluating(true);
    setError('');
    try {
      const snapRes = await fetchTeacherCopilotStudentSnapshot(studentId);
      if (snapRes.success) {
        setSnapshot(snapRes.data);
      } else {
        setError(snapRes.message || 'Failed to load student snapshot');
      }

      const adviceRes = await fetchTeacherCopilotAdvice(studentId);
      if (adviceRes.success) {
        setAdvice(adviceRes.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Error evaluating teacher copilot advice');
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadStudentCopilotData(selectedStudentId);
    }
  }, [selectedStudentId]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Teacher Copilot</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Understand your students and decide what to do next.
            </p>
          </div>
        </div>

        {selectedStudentId && (
          <button
            onClick={() => loadStudentCopilotData(selectedStudentId)}
            disabled={evaluating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${evaluating ? 'animate-spin' : ''}`} />
            <span>Re-evaluate Copilot Advice</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading authorized students...</div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm">No authorized students found for your teacher account.</div>
      ) : (
        <div className="space-y-6">
          <TeacherStudentSelector
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudent={(id) => setSelectedStudentId(id)}
          />

          {evaluating ? (
            <div className="p-12 text-center text-slate-500 text-sm">Synthesizing intelligence snapshot & copilot recommendations...</div>
          ) : (
            <>
              <TeacherStudentSummary snapshot={snapshot} />

              {/* AI Recommended Intervention Summary */}
              {advice?.recommendedIntervention && (
                <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-lg text-white">Recommended Intervention Overview</h3>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                          {advice.aiGenerated ? 'AI-generated recommendation' : 'Deterministic Recommendation'}
                        </span>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">{advice.recommendedIntervention}</p>
                    </div>
                  </div>
                </div>
              )}

              <TeacherWeeklyPlan plan={advice?.weeklyActionPlan} aiGenerated={advice?.aiGenerated} />

              <TeacherRecommendedActions
                actions={advice?.recommendedRemediationActions}
                aiGenerated={advice?.aiGenerated}
              />

              <TeacherParentMessage
                studentId={selectedStudentId}
                studentName={snapshot?.studentName || 'Student'}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherCopilotPage;
