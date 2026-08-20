import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdaptiveAssessments,
  createDiagnosticAssessment,
  createExamSimulation,
  createMasteryCheck,
  createRevisionTest,
} from '../services/api';
import { IAdaptiveAssessment } from '../types/adaptive-assessment';

export const AdaptiveAssessmentPage: React.FC = () => {
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

  const handleStartType = async (type: 'diagnostic' | 'exam' | 'mastery' | 'revision') => {
    let res;
    if (type === 'diagnostic') res = await createDiagnosticAssessment();
    else if (type === 'exam') res = await createExamSimulation();
    else if (type === 'mastery') res = await createMasteryCheck();
    else res = await createRevisionTest();

    if (res.success && res.data) {
      navigate(`/assessments/${res.data.id}/run`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Adaptive Assessment Hub</h1>
          <p className="text-sm text-gray-600">Dynamic testing, prerequisite checks & performance evaluation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div onClick={() => handleStartType('diagnostic')} className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
          <h3 className="font-bold text-lg">Diagnostic Test</h3>
          <p className="text-xs text-purple-100 mt-1">Baseline evaluation across all subject concepts.</p>
          <button className="mt-4 px-4 py-2 bg-white text-purple-700 font-semibold text-xs rounded-lg shadow">Start Test</button>
        </div>

        <div onClick={() => handleStartType('mastery')} className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
          <h3 className="font-bold text-lg">Mastery Check</h3>
          <p className="text-xs text-blue-100 mt-1">Targeted test on active curriculum concepts.</p>
          <button className="mt-4 px-4 py-2 bg-white text-blue-700 font-semibold text-xs rounded-lg shadow">Start Test</button>
        </div>

        <div onClick={() => handleStartType('revision')} className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
          <h3 className="font-bold text-lg">Smart Revision Test</h3>
          <p className="text-xs text-emerald-100 mt-1">Focused test on spaced revision concepts.</p>
          <button className="mt-4 px-4 py-2 bg-white text-emerald-700 font-semibold text-xs rounded-lg shadow">Start Test</button>
        </div>

        <div onClick={() => handleStartType('exam')} className="bg-gradient-to-br from-rose-500 to-orange-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
          <h3 className="font-bold text-lg">Exam Simulation</h3>
          <p className="text-xs text-rose-100 mt-1">Full-length timed exam simulation test.</p>
          <button className="mt-4 px-4 py-2 bg-white text-rose-700 font-semibold text-xs rounded-lg shadow">Start Test</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment History</h2>
        {loading ? (
          <p className="text-sm text-gray-500 py-4">Loading assessment history...</p>
        ) : assessments.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No assessment history recorded yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {assessments.map((a) => (
              <div key={a.id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-900">{a.title}</h4>
                  <p className="text-xs text-gray-500">
                    {a.subject} • {a.questionCount} Questions • Difficulty: {a.difficulty} • Status: {a.status}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {a.status === 'completed' ? (
                    <button
                      onClick={() => navigate(`/assessments/${a.id}/results`)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-lg"
                    >
                      View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/assessments/${a.id}/run`)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-lg"
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
