import React from 'react';
import { Sparkles } from 'lucide-react';

export const CollaborationAIInsight: React.FC = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/60 border border-purple-500/30 rounded-2xl space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> AI Collaboration Insight
        </h3>
        <span className="text-[10px] font-bold text-purple-300 uppercase px-2 py-0.5 bg-purple-500/20 rounded border border-purple-500/40">
          Assistive AI
        </span>
      </div>
      <p className="text-slate-300 leading-relaxed">
        Communication response rate stands at 85%. Parent acknowledgement of home support recommendations correlates with steady learning velocity gains (+10 pts/wk).
      </p>
    </div>
  );
};

export default CollaborationAIInsight;
