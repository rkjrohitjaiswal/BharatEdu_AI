import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, ArrowRight, Sparkles, Target, BookOpen, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStudentSubmissionResult } from '../services/api';

export const StudentSubmissionPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (submissionId) {
      loadResult();
    }
  }, [submissionId]);

  const loadResult = async () => {
    if (!submissionId) return;
    setLoading(true);
    const res = await fetchStudentSubmissionResult(submissionId);
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading evaluation report...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-slate-300">Submission result not found.</p>
          <button
            onClick={() => navigate('/student/assessments-portal')}
            className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl text-xs"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const feedback = data.feedback;
  const grade = data.grade;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 bg-purple-500/20 border border-purple-500/40 rounded-2xl text-purple-300">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Assessment Evaluation & Feedback</h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            {data.message || 'Teacher finalized assessment evaluation and personalized AI diagnostics.'}
          </p>

          {grade && (
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg mx-auto">
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                <div className="text-2xl font-black text-purple-400">{grade.totalScore}</div>
                <div className="text-xs text-slate-400 font-medium">Total Score</div>
              </div>
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                <div className="text-2xl font-black text-emerald-400">{grade.percentage}%</div>
                <div className="text-xs text-slate-400 font-medium">Percentage</div>
              </div>
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                <div className="text-2xl font-black text-amber-400">{feedback?.grade || 'A'}</div>
                <div className="text-xs text-slate-400 font-medium">Grade</div>
              </div>
            </div>
          )}
        </div>

        {feedback && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Teacher & AI Feedback
            </h3>
            <p className="text-sm text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              {feedback.generalFeedback}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => navigate('/student/assessments-portal')}
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2"
          >
            <span>Back to Assignments</span>
          </button>
          <button
            onClick={() => navigate('/doubts')}
            className="py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Doubt Solver</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionPage;
