import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExamEvaluations } from '../../services/api';
import { IExamEvaluation } from '../../types/exam-evaluation';

export const ExamEvaluationCard: React.FC = () => {
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

  const latestEval = evaluations.length > 0 ? evaluations[0] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg font-bold text-xl">📊</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Exam Evaluation & Feedback</h3>
            <p className="text-sm text-gray-500">Answer analysis, misconception detection & remediation</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">Feature 31</span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-gray-400 text-sm">Loading evaluation analytics...</div>
      ) : latestEval ? (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-semibold uppercase text-purple-600 tracking-wider">Latest Evaluation</span>
              <h4 className="font-bold text-gray-900 text-base">Paper Score: {latestEval.earnedMarks} / {latestEval.totalMarks}</h4>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-purple-100 text-purple-800">
              {latestEval.overallLevel.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-600">
            <div>
              <span className="text-gray-400 block">Accuracy</span>
              <span className="font-semibold text-gray-800">{latestEval.accuracy}%</span>
            </div>
            <div>
              <span className="text-gray-400 block">Misconceptions</span>
              <span className="font-semibold text-red-600">{latestEval.misconceptions?.length || 0} Detected</span>
            </div>
            <div>
              <span className="text-gray-400 block">Negative Marks</span>
              <span className="font-semibold text-gray-800">-{latestEval.negativeMarks}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center text-sm text-gray-600">
          No evaluations completed yet. Complete a mock paper to receive instant AI evaluation feedback!
        </div>
      )}

      <button
        onClick={() => navigate('/exam-evaluations')}
        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors text-center"
      >
        View Full Evaluation Analytics →
      </button>
    </div>
  );
};
