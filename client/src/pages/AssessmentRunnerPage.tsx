import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchAdaptiveAssessment,
  startAdaptiveAssessment,
  submitAssessmentAnswer,
  skipAssessmentQuestion,
  finishAdaptiveAssessment,
} from '../services/api';
import { IAdaptiveAssessment, IAssessmentQuestionClient } from '../types/adaptive-assessment';

export const AssessmentRunnerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<IAdaptiveAssessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<IAssessmentQuestionClient | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [answerText, setAnswerText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchAdaptiveAssessment(id).then(async (res) => {
      if (res.success && res.data) {
        setAssessment(res.data);
        if (res.data.currentQuestion) {
          setCurrentQuestion(res.data.currentQuestion);
        } else {
          const startRes = await startAdaptiveAssessment(id);
          if (startRes.success && startRes.data?.currentQuestion) {
            setCurrentQuestion(startRes.data.currentQuestion);
          }
        }
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async () => {
    if (!id || !currentQuestion || submitting) return;
    setSubmitting(true);

    const answer = currentQuestion.questionType === 'mcq' || currentQuestion.questionType === 'true_false'
      ? selectedOption
      : answerText;

    const res = await submitAssessmentAnswer(id, currentQuestion.questionId, answer);
    setSelectedOption('');
    setAnswerText('');

    if (res.success && res.data) {
      if (res.data.isFinished) {
        await finishAdaptiveAssessment(id);
        navigate(`/assessments/${id}/results`);
      } else if (res.data.nextQuestion) {
        setCurrentQuestion(res.data.nextQuestion);
      }
    }
    setSubmitting(false);
  };

  const handleSkip = async () => {
    if (!id || !currentQuestion || submitting) return;
    setSubmitting(true);

    const res = await skipAssessmentQuestion(id, currentQuestion.questionId);
    if (res.success && res.data?.nextQuestion) {
      setCurrentQuestion(res.data.nextQuestion);
    } else {
      await finishAdaptiveAssessment(id);
      navigate(`/assessments/${id}/results`);
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading assessment runner...</div>;
  }

  if (!assessment || !currentQuestion) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No active question found or assessment completed.</p>
        <button onClick={() => navigate('/assessments')} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded">
          Back to Assessment Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{assessment.title}</h2>
          <p className="text-xs text-gray-500">Question Sequence: #{currentQuestion.sequence} / {assessment.questionCount}</p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">
          Difficulty: {currentQuestion.difficulty}
        </span>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-6">
        <div className="text-gray-900 font-semibold text-lg">{currentQuestion.question}</div>

        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          <div className="space-y-3">
            {currentQuestion.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedOption === opt ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={selectedOption === opt}
                  onChange={() => setSelectedOption(opt)}
                  className="text-purple-600"
                />
                <span className="text-sm font-medium text-gray-800">{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <div>
            <textarea
              rows={3}
              placeholder="Type your answer here..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={handleSkip}
            disabled={submitting}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
          >
            Skip Question
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow"
          >
            {submitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};
