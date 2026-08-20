import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CollaborationFollowupCard: React.FC = () => {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Collaboration Follow-Up Queue
        </h4>
        <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">2 Pending</span>
      </div>

      <p className="text-xs text-slate-300">
        1 unacknowledged intervention update & 1 overdue practice task require follow-up.
      </p>

      <Link
        to="/teacher/collaboration"
        className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 pt-1"
      >
        <span>Open Collaboration Hub</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default CollaborationFollowupCard;
