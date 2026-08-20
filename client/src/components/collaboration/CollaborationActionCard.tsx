import React from 'react';
import { ICollaborationActionClient } from '../../types/collaboration';
import { CheckCircle2, Play, ArrowUpRight } from 'lucide-react';

interface Props {
  action: ICollaborationActionClient;
  onStart?: () => void;
  onComplete?: () => void;
}

export const CollaborationActionCard: React.FC<Props> = ({ action, onStart, onComplete }) => {
  return (
    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-purple-400 font-bold uppercase text-[10px]">{action.actionType.replace(/_/g, ' ')}</span>
        <span className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded ${
          action.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
        }`}>
          {action.status}
        </span>
      </div>

      <h4 className="font-bold text-white text-sm">{action.title}</h4>
      <p className="text-slate-300">{action.description}</p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span className="text-[10px] text-slate-400">Assigned To: {action.assignedTo}</span>
        <div className="flex items-center gap-2">
          {action.targetUrl && (
            <a
              href={action.targetUrl}
              className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded font-semibold flex items-center gap-1 text-[10px]"
            >
              <span>Open Tool</span> <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {action.status === 'pending' && onStart && (
            <button
              onClick={onStart}
              className="py-1 px-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-semibold flex items-center gap-1 text-[10px]"
            >
              <Play className="w-3 h-3" /> Start
            </button>
          )}
          {action.status !== 'completed' && onComplete && (
            <button
              onClick={onComplete}
              className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold flex items-center gap-1 text-[10px]"
            >
              <CheckCircle2 className="w-3 h-3" /> Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationActionCard;
