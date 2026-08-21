import React from 'react';
import { IOrchestrationActionItemClient } from '../../types/learning-orchestrator';
import { ArrowRight, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NextBestActionProps {
  action: IOrchestrationActionItemClient;
  onComplete?: (actionId: string) => void;
}

export const NextBestAction: React.FC<NextBestActionProps> = ({ action, onComplete }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 p-0.5 rounded-2xl shadow-xl mb-6">
      <div className="bg-slate-900 rounded-[15px] p-6 text-white">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 text-yellow-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Your Single Next Best Action</span>
          </div>
          <span className="bg-yellow-400/20 text-yellow-300 text-xs font-black px-3 py-1 rounded-full border border-yellow-400/30">
            {action.priorityScore}% Priority
          </span>
        </div>

        <h2 className="text-xl font-extrabold text-white mb-2">{action.title}</h2>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">{action.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-4 text-slate-300">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>{action.estimatedMinutes} Mins</span>
            </span>
            <span className="bg-slate-800 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold capitalize">
              {action.sourceFeature.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {onComplete && (
              <button
                onClick={() => onComplete(action.actionId)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Complete</span>
              </button>
            )}

            <Link
              to={action.actionUrl}
              className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
            >
              <span>Execute Action Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
