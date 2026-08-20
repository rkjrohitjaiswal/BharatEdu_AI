import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchExamPaperReview } from '../services/api';
import { IExamPaperQuestionReview } from '../types/exam-paper';

export const ExamPaperReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IExamPaperQuestionReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) loadReview();
  }, [id]);

  const loadReview = async () => {
    setLoading(true);
    const res = await fetchExamPaperReview(id!);
    if (res.success && res.data) {
      setQuestions(res.data);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Post-Exam Answer Review...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-red-600 tracking-wider">AUTHORIZED POST-EXAM REVIEW</span>
          <h1 className="text-xl font-extrabold text-gray-900">Question Solutions & Feedback</h1>
        </div>
        <button
          onClick={() => navigate(`/exam-papers/${id}/results`)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg"
        >
          Back to Results
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div
            key={q.id || q.questionId}
            className={`p-6 bg-white rounded-xl border-l-4 shadow-sm ${
              q.isCorrect ? 'border-l-green-500' : q.submittedAnswer ? 'border-l-red-500' : 'border-l-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase">Question {q.sequence}</span>
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded ${
                  q.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {q.isCorrect ? 'CORRECT (+1)' : 'INCORRECT'}
              </span>
            </div>

            <h3 className="font-bold text-gray-900 text-base mb-4">{q.questionText}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block font-semibold mb-1">Your Submitted Answer</span>
                <span className="font-bold text-gray-800">{q.submittedAnswer || 'Unanswered'}</span>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-green-600 block font-semibold mb-1">Authoritative Correct Solution</span>
                <span className="font-bold text-green-900">{q.correctAnswer}</span>
              </div>
            </div>

            {q.feedback && <p className="mt-3 text-xs text-gray-600 italic">Feedback: {q.feedback}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
