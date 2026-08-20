import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdaptiveAssessments, createDiagnosticAssessment } from '../../services/api';
import { IAdaptiveAssessment } from '../../types/adaptive-assessment';

export const AdaptiveAssessmentCard: React.FC = () => {
  const [assessments, setAssessments] = useState<IAdaptiveAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdaptiveAssessments()
      .then((res) => {
        if (res.success && res.data) {
          setAssessments(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const latest = assessments[0];

  const handleStartDiagnostic = async () => {
    const res = await createDiagnosticAssessment();
    if (res.success && res.data) {
      navigate(`/assessments/${res.data.id}/run`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Adaptive Assessment Engine</h3>
            <p className="text-xs text-gray-500">AI-driven personalized testing & dynamic mastery checks</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
          Feature 29
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse flex space-x-4 py-4">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : latest ? (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{latest.title}</h4>
                <p className="text-xs text-gray-500">
                  {latest.subject} • {latest.questionCount} Questions • Difficulty: <span className="font-semibold text-purple-700 uppercase">{latest.difficulty}</span>
                </p>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${latest.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {latest.status.replace('_', ' ')}
              </span>
            </div>
            {latest.status === 'completed' && (
              <div className="flex items-center justify-between text-xs text-gray-600 mt-3 pt-2 border-t border-purple-100">
                <span>Score: <strong>{latest.score}</strong></span>
                <span>Accuracy: <strong>{latest.accuracy}%</strong></span>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {latest.status !== 'completed' ? (
              <button
                onClick={() => navigate(`/assessments/${latest.id}/run`)}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition-colors text-center"
              >
                Resume Assessment
              </button>
            ) : (
              <button
                onClick={handleStartDiagnostic}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition-colors text-center"
              >
                Take New Assessment
              </button>
            )}
            <button
              onClick={() => navigate('/assessments')}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
            >
              View All ({assessments.length})
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-gray-600 mb-4">No assessments taken yet. Start a diagnostic test to evaluate your baseline mastery!</p>
          <button
            onClick={handleStartDiagnostic}
            className="py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Start Diagnostic Test
          </button>
        </div>
      )}
    </div>
  );
};
