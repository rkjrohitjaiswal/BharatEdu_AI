import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoubts, solveDoubt } from '../../services/api';
import { IStudentDoubtClient } from '../../types/doubt-solver';

export const DoubtSolverCard: React.FC = () => {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState<IStudentDoubtClient[]>([]);
  const [questionInput, setQuestionInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    setLoading(true);
    const res = await fetchDoubts();
    if (res.success && res.data) {
      setDoubts(res.data);
    }
    setLoading(false);
  };

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    setSubmitting(true);
    const res = await solveDoubt({ question: questionInput.trim() });
    setSubmitting(false);
    if (res.success && res.data) {
      setQuestionInput('');
      navigate(`/doubts/${res.data.id || res.data.doubtId}`);
    }
  };

  const latestDoubt = doubts.length > 0 ? doubts[0] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xl">💡</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Doubt Solver</h3>
            <p className="text-sm text-gray-500">Step-by-step grounded explanations & learning guidance</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">Feature 32</span>
      </div>

      <form onSubmit={handleQuickAsk} className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask any academic doubt (e.g. How to solve 2x + 5 = 15?)..."
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={submitting || !questionInput.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {submitting ? 'Solving...' : 'Solve AI'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="py-4 text-center text-gray-400 text-xs">Loading recent doubts...</div>
      ) : latestDoubt ? (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100 text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-indigo-600 uppercase">{latestDoubt.subject}</span>
            <span className="text-gray-400">{new Date(latestDoubt.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-800 font-medium truncate">"{latestDoubt.question}"</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-center text-xs text-gray-500">
          No doubts asked yet. Ask your first doubt above!
        </div>
      )}

      <button
        onClick={() => navigate('/doubts')}
        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors text-center"
      >
        View All Doubts Hub →
      </button>
    </div>
  );
};
