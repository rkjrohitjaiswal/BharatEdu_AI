import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAssessmentReview } from '../services/api';
import { IAssessmentQuestionReview } from '../types/adaptive-assessment';

export const AssessmentReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<IAssessmentQuestionReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAssessmentReview(id).then((res) => {
      if (res.success && res.data) {
        setQuestions(res.data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading post-test answer review...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post-Assessment Answer Review</h1>
          <p className="text-xs text-gray-500">Compare your submitted answers with authoritative correct solutions</p>
        </div>
        <button
          onClick={() => navigate('/assessments')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-lg"
        >
          Back to Hub
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`p-6 rounded-xl border ${q.isCorrect ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase">Question #{idx + 1} ({q.difficulty})</span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${q.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {q.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
              </span>
            </div>

            <div className="font-semibold text-gray-900 mb-4">{q.question}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded border border-gray-200">
                <span className="font-semibold text-gray-500 block mb-1">Your Answer:</span>
                <span className={q.isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                  {q.submittedAnswer || '(Skipped)'}
                </span>
              </div>
              <div className="p-3 bg-white rounded border border-gray-200">
                <span className="font-semibold text-gray-500 block mb-1">Correct Answer:</span>
                <span className="text-green-700 font-bold">{q.correctAnswer}</span>
              </div>
            </div>

            {q.feedback && (
              <p className="text-xs text-gray-600 italic mt-3 pt-2 border-t border-gray-200">{q.feedback}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
