import React from 'react';
import { Users } from 'lucide-react';

export const ClassroomEmptyState: React.FC = () => {
  return (
    <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-3xl text-center space-y-4">
      <Users className="w-12 h-12 text-slate-500 mx-auto" />
      <h3 className="text-lg font-bold text-white">No Classroom Data Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Assign student practice or assessments to populate classroom intelligence and analytics.
      </p>
    </div>
  );
};

export default ClassroomEmptyState;
