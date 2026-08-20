import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, ArrowRight, Save, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStudentAssessmentQuestions, saveStudentAssessmentDraft, submitStudentAssessment } from '../services/api';
import { IAssessmentQuestionClient } from '../types/assessment';

export const StudentAssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IAssessmentQuestionClient[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (assessmentId) {
      loadQuestions();
    }
  }, [assessmentId]);

  const loadQuestions = async () => {
    if (!assessmentId) return;
    setLoading(true);
    const res = await fetchStudentAssessmentQuestions(assessmentId);
    if (res.success && res.data) {
      setQuestions(res.data);
    }
    setLoading(false);
  };

  const handleAnswerChange = (qId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSaveDraft = async () => {
    if (!assessmentId) return;
    const formatted = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      answer: ans,
    }));
    await saveStudentAssessmentDraft(assessmentId, { answers: formatted });
  };

  const handleSubmit = async () => {
    if (!assessmentId) return;
    setSubmitting(true);
    const formatted = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      answer: ans,
    }));
    const res = await submitStudentAssessment(assessmentId, { answers: formatted });
    if (res.success && res.data?.submission?.submissionId) {
      navigate(`/student/submissions/${res.data.submission.submissionId}/result`);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading assignment questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              Assessment Attempt
            </h1>
            <p className="text-slate-400 text-sm mt-1">Answer all questions carefully before submitting.</p>
          </div>
          <button
            onClick={handleSaveDraft}
            className="py-2 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
        </div>

        {questions.map((q, idx) => (
          <div key={q.questionId} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Question #{idx + 1} ({q.marks} Marks)
              </span>
              <span className="text-xs text-slate-400 capitalize">{q.questionType.replace(/_/g, ' ')}</span>
            </div>

            <div className="text-base font-semibold text-white">{q.question}</div>

            {q.questionType === 'mcq' && q.options && (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                      answers[q.questionId] === opt
                        ? 'bg-purple-600/20 border-purple-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q_${q.questionId}`}
                      checked={answers[q.questionId] === opt}
                      onChange={() => handleAnswerChange(q.questionId, opt)}
                      className="accent-purple-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {['short_answer', 'long_answer', 'essay'].includes(q.questionType) && (
              <textarea
                value={answers[q.questionId] || ''}
                onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
                placeholder="Type your response here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-purple-500"
                rows={4}
              />
            )}
          </div>
        ))}

        <div className="flex items-center justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="py-3 px-8 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Assessment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAssessmentPage;
