import React from 'react';
import { ArrowRight, GitCommit } from 'lucide-react';

export interface PrerequisiteChainProps {
  chain: string[];
}

export const PrerequisiteChain: React.FC<PrerequisiteChainProps> = ({ chain }) => {
  if (!chain || chain.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap text-xs">
      <span className="font-bold text-slate-500 flex items-center gap-1">
        <GitCommit className="w-3.5 h-3.5 text-indigo-600" /> Prerequisite Chain:
      </span>
      {chain.map((item, idx) => (
        <React.Fragment key={idx}>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              idx === 0 ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {item}
          </span>
          {idx < chain.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
        </React.Fragment>
      ))}
    </div>
  );
};
