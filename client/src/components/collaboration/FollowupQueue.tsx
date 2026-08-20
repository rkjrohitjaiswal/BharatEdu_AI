import React from 'react';
import { AlertCircle } from 'lucide-react';
import { IFollowupRecommendationClient } from '../../types/collaboration';

interface Props {
  followups: IFollowupRecommendationClient[];
  onSelectThread: (threadId: string) => void;
}

export const FollowupQueue: React.FC<Props> = ({ followups, onSelectThread }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Teacher Follow-Up Queue
        </h3>
        <span className="text-xs text-slate-400">{followups.length} Items</span>
      </div>

      <div className="space-y-3">
        {followups.length === 0 ? (
          <p className="text-xs text-slate-400">No pending follow-ups required at this time.</p>
        ) : (
          followups.map((f) => (
            <div
              key={f.threadId}
              onClick={() => onSelectThread(f.threadId)}
              className="p-3.5 bg-slate-950/50 border border-slate-800 hover:border-purple-500/50 rounded-xl space-y-1 text-xs cursor-pointer"
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-white">{f.studentName || f.studentId}</span>
                <span className={`uppercase text-[10px] px-2 py-0.5 rounded ${
                  f.priority === 'critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {f.priority} Priority
                </span>
              </div>
              <p className="text-slate-300">{f.reason}</p>
              <div className="text-[10px] text-purple-400 font-semibold pt-1">Action: {f.suggestedAction}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowupQueue;
