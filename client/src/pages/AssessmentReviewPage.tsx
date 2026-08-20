import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Sparkles, ArrowRight, RotateCcw, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { approveAIEvaluation, fetchSubmissionAIEvaluation, modifyAndFinalizeGrade } from '../services/api';
import { IAIEvaluationClient } from '../types/assessment';

export const AssessmentReviewPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<IAIEvaluationClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherFeedback, setTeacherFeedback] = useState('Excellent work! Good conceptual clarity.');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    if (!submissionId) return;
    setLoading(true);
    const res = await fetchSubmissionAIEvaluation(submissionId);
    if (res.success && res.data) {
      setEvaluations(res.data);
    }
    setLoading(false);
  };

  const handleApproveAll = async () => {
    if (!submissionId) return;
    setProcessing(true);
    const res = await approveAIEvaluation(submissionId);
    if (res.success) {
      navigate('/teacher/assessments');
    }
    setProcessing(false);
  };

  const handleFinalizeGrade = async () => {
    if (!submissionId) return;
    setProcessing(true);
    const questionGrades = evaluations.map((ev) => ({
      questionId: ev.questionId,
      score: ev.proposedScore,
      maxScore: ev.maxScore,
      isObjective: false,
      aiApproved: true,
      teacherComment: ev.feedback,
    }));

    const res = await modifyAndFinalizeGrade(submissionId, {
      questionGrades,
      teacherFeedback,
    });

    if (res.success) {
      navigate('/teacher/assessments');
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading AI proposed evaluations...</p>
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
              <Sparkles className="w-6 h-6 text-purple-400" />
              Teacher Review & AI Evaluation Assist
            </h1>
            <p className="text-slate-400 text-sm mt-1">Review evidence, proposed rubric scores, and finalize student grade.</p>
          </div>
        </div>

        {evaluations.map((ev, i) => (
          <div key={i} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Question Evaluation #{i + 1}
              </span>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-400">{ev.proposedScore} / {ev.maxScore} Marks</span>
                <div className="text-[10px] text-slate-400">AI Confidence: {Math.round(ev.confidence * 100)}%</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-slate-300">AI Feedback & Evidence:</div>
              <p className="text-slate-400">{ev.feedback}</p>
              {ev.strengths?.length > 0 && (
                <div className="text-emerald-400">
                  <span className="font-semibold">Strengths:</span> {ev.strengths.join(', ')}
                </div>
              )}
              {ev.weaknesses?.length > 0 && (
                <div className="text-rose-400">
                  <span className="font-semibold">Weaknesses:</span> {ev.weaknesses.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <label className="text-xs font-bold text-slate-300 block">Teacher General Feedback</label>
          <textarea
            value={teacherFeedback}
            onChange={(e) => setTeacherFeedback(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handleApproveAll}
            disabled={processing}
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Approve AI Evaluation</span>
          </button>

          <button
            onClick={handleFinalizeGrade}
            disabled={processing}
            className="py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <span>Finalize & Return to Student</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentReviewPage;
