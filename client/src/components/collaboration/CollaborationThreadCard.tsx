import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import { ICollaborationThreadClient } from '../../types/collaboration';

interface Props {
  thread: ICollaborationThreadClient;
  isSelected: boolean;
  onClick: () => void;
}

export const CollaborationThreadCard: React.FC<Props> = ({ thread, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'bg-purple-950/40 border-purple-500/60 text-white shadow-lg'
          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">{thread.threadType}</span>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
          thread.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          {thread.status}
        </span>
      </div>
      <h4 className="text-sm font-bold mt-1">{thread.subject}</h4>
      <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
        <span>Topic: {thread.topic || 'General'}</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(thread.lastMessageAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default CollaborationThreadCard;
