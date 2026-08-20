import React from 'react';
import { MessageSquare } from 'lucide-react';

export const CollaborationEmptyState: React.FC = () => {
  return (
    <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-3xl text-center space-y-4">
      <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
      <h3 className="text-lg font-bold text-white">No Active Collaboration Threads</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Initiate an intervention thread from Feature 37 Classroom Intelligence to start structured communication.
      </p>
    </div>
  );
};

export default CollaborationEmptyState;
