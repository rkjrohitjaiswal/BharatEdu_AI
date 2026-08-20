import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExamPapers, generateMockExam } from '../../services/api';
import { IExamPaper } from '../../types/exam-paper';

export const MockExamCard: React.FC = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState<IExamPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    setLoading(true);
    const res = await fetchExamPapers();
    if (res.success && res.data) {
      setPapers(res.data);
    }
    setLoading(false);
  };

  const handleStartQuickMock = async () => {
    setCreating(true);
    const res = await generateMockExam('Mathematics');
    if (res.success && res.data) {
      navigate(`/exam-papers/${res.data.id || res.data.paperId}/run`);
    } else {
      navigate('/exam-papers');
    }
    setCreating(false);
  };

  const latestPaper = papers.length > 0 ? papers[0] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg font-bold text-xl">📝</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Realistic Mock Exams</h3>
            <p className="text-sm text-gray-500">Board-style timed papers with section blueprints & negative marking</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Feature 30</span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-gray-400 text-sm">Loading mock exam status...</div>
      ) : latestPaper ? (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-semibold uppercase text-red-600 tracking-wider">Latest Paper</span>
              <h4 className="font-bold text-gray-900 text-base">{latestPaper.title}</h4>
            </div>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                latestPaper.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : latestPaper.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {latestPaper.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-600">
            <div>
              <span className="text-gray-400 block">Board</span>
              <span className="font-semibold text-gray-800">{latestPaper.board}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Duration</span>
              <span className="font-semibold text-gray-800">{latestPaper.durationMinutes} mins</span>
            </div>
            <div>
              <span className="text-gray-400 block">Marks</span>
              <span className="font-semibold text-gray-800">{latestPaper.totalMarks} Marks</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center text-sm text-gray-600">
          No mock exams taken yet. Generate your first realistic board-style paper!
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/exam-papers')}
          className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors text-center"
        >
          Mock Exam Hub
        </button>
        <button
          onClick={handleStartQuickMock}
          disabled={creating}
          className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors text-center disabled:opacity-50"
        >
          {creating ? 'Generating...' : 'Start Full Mock'}
        </button>
      </div>
    </div>
  );
};
