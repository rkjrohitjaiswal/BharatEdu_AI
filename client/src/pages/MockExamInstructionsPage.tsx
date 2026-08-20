import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Flame, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMockExamInstructions, startMockExam } from '../services/api';
import { IMockExamClient } from '../types/mock-exam';

export const MockExamInstructionsPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<IMockExamClient | null>(null);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (examId) {
      loadInstructions();
    }
  }, [examId]);

  const loadInstructions = async () => {
    if (!examId) return;
    setLoading(true);
    const res = await fetchMockExamInstructions(examId);
    if (res.success && res.data) {
      setExam(res.data.exam);
      setInstructions(res.data.instructions);
    }
    setLoading(false);
  };

  const handleBegin = async () => {
    if (!examId) return;
    setStarting(true);
    const res = await startMockExam(examId);
    if (res.success) {
      navigate(`/exam-simulator/${examId}`);
    } else {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading exam configuration & instructions...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-slate-300">Exam configuration not found.</p>
          <button
            onClick={() => navigate('/exam-simulator')}
            className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl"
          >
            Back to Exam Simulator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Official Exam Environment</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">{exam.title}</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium">Duration</div>
              <div className="text-lg font-bold text-purple-300 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {exam.durationMinutes} Mins
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Questions</div>
              <div className="text-lg font-bold text-white">{exam.totalQuestions}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Marks</div>
              <div className="text-lg font-bold text-emerald-400">{exam.totalMarks}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Negative Marking</div>
              <div className="text-lg font-bold text-rose-400">{exam.negativeMarking ? `-${exam.negativeMarks}` : 'None'}</div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              General Instructions
            </h3>
            <div className="space-y-3 bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
              {instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => navigate('/exam-simulator')}
              className="py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel & Return
            </button>

            <button
              onClick={handleBegin}
              disabled={starting}
              className="py-3 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              <span>{starting ? 'Initializing Timer...' : 'I Am Ready — Begin Exam'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExamInstructionsPage;
