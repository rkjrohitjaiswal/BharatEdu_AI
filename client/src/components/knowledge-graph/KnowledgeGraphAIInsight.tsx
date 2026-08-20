import React from 'react';
import { Sparkles } from 'lucide-react';

export interface KnowledgeGraphAIInsightProps {
  summary: any;
}

export const KnowledgeGraphAIInsight: React.FC<KnowledgeGraphAIInsightProps> = ({ summary }) => {
  if (!summary) return null;

  const { summaryMessage = 'Knowledge graph mapping prerequisite dependencies and concept health.' } = summary;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white">AI Concept Dependency Strategy</h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
          Prerequisite Dependency Graph
        </span>
      </div>

      <p className="text-sm text-indigo-100 font-medium leading-relaxed">{summaryMessage}</p>
      <p className="text-xs text-slate-300">
        Prerequisite gaps are identified automatically. Strengthening root prerequisites unlocks downstream topics in math, science, and CS.
      </p>
    </div>
  );
};
