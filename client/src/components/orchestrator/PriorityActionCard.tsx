import React from 'react';
import { IOrchestrationActionItemClient } from '../../types/learning-orchestrator';
import { Clock, ArrowRight, CheckCircle, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PriorityActionCardProps {
  action: IOrchestrationActionItemClient;
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
}

export const PriorityActionCard: React.FC<PriorityActionCardProps> = ({ action, onComplete, onSkip }) => {
  const isCritical = action.priority === 'critical';

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border ${
        isCritical ? 'border-red-200 bg-red-50/20' : 'border-gray-100'
      } hover:shadow-md transition-all flex flex-col justify-between`}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              isCritical ? 'bg-red-100 text-red-700' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            {action.priority} Priority
          </span>
          <span className="text-xs text-gray-400 font-medium flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{action.estimatedMinutes}m</span>
          </span>
        </div>

        <h4 className="font-extrabold text-sm text-gray-900 mb-1">{action.title}</h4>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{action.reason}</p>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {onComplete && (
            <button
              onClick={() => onComplete(action.actionId)}
              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold"
              title="Complete Action"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {onSkip && (
            <button
              onClick={() => onSkip(action.actionId)}
              className="p-1.5 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-lg text-xs"
              title="Skip Action"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}
        </div>

        <Link
          to={action.actionUrl}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-sm"
        >
          <span>Open</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
