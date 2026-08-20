import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchExamPaperResults } from '../services/api';
import { IExamPaperResults } from '../types/exam-paper';

export const ExamPaperResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<IExamPaperResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) loadResults();
  }, [id]);

  const loadResults = async () => {
    setLoading(true);
    const res = await fetchExamPaperResults(id!);
    if (res.success && res.data) {
      setResults(res.data);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Calculating Exam Performance & AI Insights...</div>;
  if (!results) return <div className="p-12 text-center text-gray-500">Exam results not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Performance Summary Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 text-center space-y-4">
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">
          MOCK EXAM EVALUATED
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">{results.title}</h1>

        <div className="flex justify-center items-baseline space-x-2 pt-2">
          <span className="text-5xl font-black text-red-600">{results.netMarks}</span>
          <span className="text-2xl text-gray-400 font-bold">/ {results.totalMarks} Marks</span>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-4 text-center">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Gross Score</span>
            <span className="text-xl font-bold text-gray-800">+{results.grossMarks}</span>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <span className="text-xs text-red-500 block uppercase font-bold">Negative Marks</span>
            <span className="text-xl font-bold text-red-600">-{results.negativeMarks}</span>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-xs text-blue-500 block uppercase font-bold">Accuracy</span>
            <span className="text-xl font-bold text-blue-700">{results.accuracy}%</span>
          </div>
        </div>
      </div>

      {/* AI Performance Insight */}
      {results.aiInsight && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 space-y-2">
          <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
            <span>🤖</span>
            <span>AI Exam Coach Performance Insight</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{results.aiInsight}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(`/exam-papers/${id}/review`)}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm text-center"
        >
          View Full Answer & Solution Review →
        </button>
        <button
          onClick={() => navigate('/exam-papers')}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl text-center"
        >
          Back to Mock Hub
        </button>
      </div>
    </div>
  );
};
