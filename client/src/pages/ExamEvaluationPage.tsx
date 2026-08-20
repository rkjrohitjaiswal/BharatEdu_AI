import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExamEvaluations } from '../services/api';
import { IExamEvaluation } from '../types/exam-evaluation';

export const ExamEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<IExamEvaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    setLoading(true);
    const res = await fetchExamEvaluations();
    if (res.success && res.data) {
      setEvaluations(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-3 py-1 bg-purple-500/30 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Feature 31 • Multi-Level Performance Analysis
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            AI Exam Evaluation & Feedback Engine
          </h1>
          <p className="text-purple-100 text-base">
            Detailed post-exam evaluation with question, topic, concept, and misconception analysis plus personalized remediation recommendations.
          </p>
        </div>
      </div>

      {/* Evaluations List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Exam Evaluations</h2>
          <span className="text-xs font-semibold text-gray-400">{evaluations.length} Evaluations Recorded</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading evaluation reports...</div>
        ) : evaluations.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <p>No evaluation reports found yet.</p>
            <button
              onClick={() => navigate('/exam-papers')}
              className="px-5 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-lg shadow-sm"
            >
              Go to Mock Exam Hub →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {evaluations.map((item) => (
              <div key={item.id || item.evaluationId} className="p-6 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                      {item.overallLevel.toUpperCase().replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">Accuracy: {item.accuracy}%</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Earned Score: {item.earnedMarks} / {item.totalMarks} Marks ({item.percentage}%)
                  </h3>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>Correct: <strong>{item.correctCount}</strong></span>
                    <span>Incorrect: <strong>{item.incorrectCount}</strong></span>
                    <span>Negative Marks: <strong className="text-red-600">-{item.negativeMarks}</strong></span>
                    <span>Misconceptions: <strong className="text-purple-600">{item.misconceptions?.length || 0}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/exam-evaluations/${item.id || item.evaluationId}`)}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  View Full Report →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
