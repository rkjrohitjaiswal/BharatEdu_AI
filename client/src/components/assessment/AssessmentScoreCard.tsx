import React from 'react';
import { IAssessmentAttemptClient } from '../../types/assessment-engine';
import { Award, CheckCircle, XCircle, MinusCircle, Clock } from 'lucide-react';

interface Props {
  attempt: IAssessmentAttemptClient;
}

export const AssessmentScoreCard: React.FC<Props> = ({ attempt }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
            Official Evaluated Result
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Assessment Performance Summary</h2>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-purple-300">{attempt.percentage}%</div>
          <div className="text-xs text-slate-400 font-semibold">{attempt.obtainedMarks} / {attempt.totalMarks} Marks</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="font-bold text-white">{attempt.correctCount}</div>
            <div className="text-[10px] text-slate-400">Correct</div>
          </div>
        </div>
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5">
          <XCircle className="w-5 h-5 text-rose-400" />
          <div>
            <div className="font-bold text-white">{attempt.incorrectCount}</div>
            <div className="text-[10px] text-slate-400">Incorrect</div>
          </div>
        </div>
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5">
          <MinusCircle className="w-5 h-5 text-amber-400" />
          <div>
            <div className="font-bold text-white">{attempt.skippedCount}</div>
            <div className="text-[10px] text-slate-400">Skipped</div>
          </div>
        </div>
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-purple-400" />
          <div>
            <div className="font-bold text-white">{Math.round((attempt.timeSpentSeconds || 0) / 60)} mins</div>
            <div className="text-[10px] text-slate-400">Time Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentScoreCard;
