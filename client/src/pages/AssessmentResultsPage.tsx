import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAssessmentResults } from '../services/api';
import { IAssessmentResults } from '../types/adaptive-assessment';

export const AssessmentResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [results, setResults] = useState<IAssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAssessmentResults(id).then((res) => {
      if (res.success && res.data) {
        setResults(res.data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading assessment results...</div>;
  if (!results) return <div className="p-8 text-center text-gray-500">Results not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 rounded-xl text-white text-center shadow-lg">
        <h1 className="text-3xl font-extrabold">{results.title} - Completed!</h1>
        <p className="text-purple-100 text-sm mt-1">AI Adaptive Performance Summary</p>

        <div className="flex justify-center items-center space-x-12 mt-6">
          <div>
            <div className="text-4xl font-black">{results.score} / {results.totalMarks}</div>
            <div className="text-xs uppercase tracking-wider text-purple-200 mt-1">Score</div>
          </div>
          <div className="h-10 w-px bg-purple-400"></div>
          <div>
            <div className="text-4xl font-black">{results.accuracy}%</div>
            <div className="text-xs uppercase tracking-wider text-purple-200 mt-1">Accuracy</div>
          </div>
          <div className="h-10 w-px bg-purple-400"></div>
          <div>
            <div className="text-4xl font-black">+{results.masteryImpact}%</div>
            <div className="text-xs uppercase tracking-wider text-purple-200 mt-1">Mastery Impact</div>
          </div>
        </div>
      </div>

      {results.aiExplanation && (
        <div className="bg-white p-6 rounded-xl shadow border border-purple-100">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <span className="p-1 bg-purple-100 text-purple-600 rounded">💡</span>
            <span>AI Learning Coach Performance Analysis</span>
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{results.aiExplanation}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => navigate('/assessments')}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg"
        >
          Back to Assessments Hub
        </button>
        <button
          onClick={() => navigate(`/assessments/${id}/review`)}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg shadow"
        >
          Review Answer Solutions
        </button>
      </div>
    </div>
  );
};
