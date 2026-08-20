import React from 'react';
import { Sparkles, Check, Edit3 } from 'lucide-react';

interface Props {
  subject: string;
  body: string;
  evidence: string[];
  onApply: (body: string) => void;
}

export const TeacherMessageDraft: React.FC<Props> = ({ subject, body, evidence, onApply }) => {
  return (
    <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-2xl space-y-3 text-xs">
      <div className="flex items-center justify-between font-bold text-purple-300">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" /> AI Draft Preview
        </span>
        <span className="text-[10px] text-slate-400">Neutral & Evidence-Grounded</span>
      </div>

      <div className="font-bold text-white text-sm">{subject}</div>
      <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">{body}</p>

      {evidence && evidence.length > 0 && (
        <div className="text-[10px] text-slate-400">
          <strong>Evidence Base:</strong> {evidence.join(' • ')}
        </div>
      )}

      <button
        onClick={() => onApply(body)}
        className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
      >
        <Check className="w-4 h-4" /> Apply Draft to Composer
      </button>
    </div>
  );
};

export default TeacherMessageDraft;
