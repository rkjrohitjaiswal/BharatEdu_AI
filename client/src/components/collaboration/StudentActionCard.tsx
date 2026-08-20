import React from 'react';
import { ICollaborationActionClient } from '../../types/collaboration';
import { Play, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface Props {
  action: ICollaborationActionClient;
  onStart: () => void;
  onComplete: () => void;
}

export const StudentActionCard: React.FC<Props> = ({ action, onStart, onComplete }) => {
  return (
    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-purple-400 font-bold uppercase text-[10px]">{action.actionType}</span>
        <span className="text-slate-400 font-semibold uppercase text-[10px]">{action.status}</span>
      </div>

      <h4 className="font-bold text-white text-sm">{action.title}</h4>
      <p className="text-slate-300">{action.description}</p>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
        {action.targetUrl && (
          <a
            href={action.targetUrl}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded font-semibold flex items-center gap-1 text-[10px]"
          >
            <span>Open Tool</span> <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
        {action.status === 'pending' && (
          <button
            onClick={onStart}
            className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-[10px] flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5" /> Start Task
          </button>
        )}
        {action.status !== 'completed' && (
          <button
            onClick={onComplete}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px] flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentActionCard;
