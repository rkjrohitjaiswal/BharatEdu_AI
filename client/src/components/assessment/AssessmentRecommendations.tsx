import React from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  actions: string[];
}

export const AssessmentRecommendations: React.FC<Props> = ({ actions }) => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3 text-xs">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" /> Recommended Action Plan
      </h3>
      <div className="space-y-2">
        {actions.map((act, idx) => (
          <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-slate-300">
            <span>{act}</span>
            <Link to="/resources" className="text-purple-400 font-bold hover:underline flex items-center gap-1">
              Start <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentRecommendations;
