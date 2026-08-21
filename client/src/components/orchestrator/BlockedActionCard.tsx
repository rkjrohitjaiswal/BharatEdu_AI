import React from 'react';
import { IBlockedActionClient } from '../../types/learning-orchestrator';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlockedActionCardProps {
  blocked: IBlockedActionClient;
}

export const BlockedActionCard: React.FC<BlockedActionCardProps> = ({ blocked }) => {
  const { action, dependencyReason } = blocked;

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-2 opacity-80">
      <div className="flex justify-between items-center text-gray-500">
        <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
          <Lock className="w-3 h-3" />
          <span>Blocked Action</span>
        </span>
        <span>{action.estimatedMinutes} mins</span>
      </div>

      <h4 className="font-bold text-gray-900">{action.title}</h4>
      <p className="text-gray-600 text-[11px] italic bg-white p-2 rounded-lg border border-gray-100">
        🔒 {dependencyReason}
      </p>

      <div className="pt-2 text-right">
        <Link to="/resources" className="text-indigo-600 font-bold hover:underline">
          Unlock Prerequisite →
        </Link>
      </div>
    </div>
  );
};
