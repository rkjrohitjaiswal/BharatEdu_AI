import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchExamEvaluation } from '../services/api';
import { IExamEvaluation } from '../types/exam-evaluation';

export const ExamEvaluationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<IExamEvaluation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    const res = await fetchExamEvaluation(id!);
    if (res.success && res.data) {
      setEvaluation(res.data);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Evaluation Analysis & Feedback...</div>;
  if (!evaluation) return <div className="p-12 text-center text-gray-500">Evaluation record not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Overall Level */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full uppercase tracking-wider">
            EVALUATION REPORT
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Overall Score: {evaluation.earnedMarks} / {evaluation.totalMarks}</h1>
          <p className="text-sm text-gray-500 mt-1">Accuracy: <strong>{evaluation.accuracy}%</strong> | Percentage: <strong>{evaluation.percentage}%</strong></p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400 block uppercase font-bold">Performance Level</span>
          <span className="text-2xl font-black text-purple-600 uppercase">{evaluation.overallLevel.replace('_', ' ')}</span>
        </div>
      </div>

      {/* AI Insight */}
      {evaluation.aiInsight && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 space-y-2">
          <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
            <span>🤖</span>
            <span>AI Evaluation Insight & Feedback</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{evaluation.aiInsight}</p>
        </div>
      )}

      {/* Misconceptions Detected */}
      {evaluation.misconceptions && evaluation.misconceptions.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-red-900 flex items-center space-x-2">
            <span>⚠️</span>
            <span>Detected Misconceptions ({evaluation.misconceptions.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluation.misconceptions.map((m) => (
              <div key={m.id} className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-800 uppercase">{m.misconceptionType.replace('_', ' ')}</span>
                  <span className="px-2 py-0.5 bg-red-200 text-red-900 rounded font-semibold">{m.severity.toUpperCase()}</span>
                </div>
                <p className="text-gray-700">{m.description}</p>
                {m.recommendedAction && (
                  <p className="text-red-700 font-semibold italic">Remediation: {m.recommendedAction}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {evaluation.recommendations && evaluation.recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Personalized Remediation Plan</h2>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            {evaluation.recommendations.map((rec, idx) => (
              <li key={idx} className="leading-relaxed">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Topic & Concept Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Topic Performance</h2>
          <div className="space-y-3 text-xs">
            {evaluation.topicEvaluations.map((t) => (
              <div key={t.topicId} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-800 block text-sm">{t.topicId}</span>
                  <span className="text-gray-400">Score: {t.marksEarned}/{t.marksAvailable} marks</span>
                </div>
                <span className={`px-2.5 py-1 rounded font-bold ${t.status === 'strong' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {t.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Concept Mastery & Prerequisite Status</h2>
          <div className="space-y-3 text-xs">
            {evaluation.conceptEvaluations.map((c) => (
              <div key={c.conceptId} className="p-3 bg-gray-50 rounded-lg space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm">{c.conceptId}</span>
                  <span className="font-bold text-purple-700">{c.accuracy}% Readiness</span>
                </div>
                <p className="text-gray-500">{c.recommendedAction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate('/exam-evaluations')}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-lg"
        >
          Back to Evaluations Hub
        </button>
      </div>
    </div>
  );
};
