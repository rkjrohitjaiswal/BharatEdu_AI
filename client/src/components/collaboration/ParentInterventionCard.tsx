import React from 'react';
import { HeartHandshake } from 'lucide-react';

export const ParentInterventionCard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <HeartHandshake className="w-5 h-5 text-purple-400" /> Child Intervention Summary
      </h3>
      <p className="text-slate-300">
        Teacher has recommended a 25-minute daily home study routine focusing on prerequisite concepts.
      </p>
    </div>
  );
};

export default ParentInterventionCard;
