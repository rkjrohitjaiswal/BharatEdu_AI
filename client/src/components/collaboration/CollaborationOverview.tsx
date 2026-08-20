import React from 'react';
import { MessageSquare, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface Props {
  totalThreads: number;
  openThreads: number;
  unacknowledged: number;
  pendingActions: number;
}

export const CollaborationOverview: React.FC<Props> = ({ totalThreads, openThreads, unacknowledged, pendingActions }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Parent–Teacher–Student Collaboration System</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Intervention Communication Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Evidence-based communication, parent support actions & progress tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-2xl md:text-3xl font-black text-purple-400">{totalThreads}</div>
          <div className="text-xs text-slate-400 font-medium">Total Threads</div>
        </div>
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-2xl md:text-3xl font-black text-emerald-400">{openThreads}</div>
          <div className="text-xs text-slate-400 font-medium">Active Threads</div>
        </div>
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-2xl md:text-3xl font-black text-amber-400">{unacknowledged}</div>
          <div className="text-xs text-slate-400 font-medium">Pending Acknowledgment</div>
        </div>
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-2xl md:text-3xl font-black text-indigo-400">{pendingActions}</div>
          <div className="text-xs text-slate-400 font-medium">Pending Actions</div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationOverview;
