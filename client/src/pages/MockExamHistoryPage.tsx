import React, { useEffect, useState } from 'react';
import { Award, Clock, History, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMockExamHistory } from '../services/api';

export const MockExamHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const res = await fetchMockExamHistory();
    if (res.success && res.data) {
      setHistory(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-purple-400" />
              Mock Exam History
            </h1>
            <p className="text-slate-400 text-sm mt-1">Review past mock attempt scores, accuracy, and detailed diagnostic reports.</p>
          </div>
          <button
            onClick={() => navigate('/exam-simulator')}
            className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-xs"
          >
            Take New Mock
          </button>
        </div>

        {loading ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-slate-400 animate-pulse">
            Loading exam history...
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-slate-400">
            No mock exams completed yet. Take your first exam to build performance history!
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((att, i) => (
              <div key={i} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">
                    Attempt #{att.attemptNumber || 1} • {att.status}
                  </div>
                  <div className="text-lg font-bold text-white">Score: {att.score} Marks</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Accuracy: {att.accuracy}% • Attempted: {att.attemptedCount} • Correct: {att.correctCount}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/exam-simulator/${att.examId}/result`)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <span>View Result</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockExamHistoryPage;
