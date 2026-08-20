import React from 'react';
import { Target } from 'lucide-react';

export const StudentInterventionCard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-400" /> Assigned Guided Remediation
      </h3>
      <p className="text-slate-300">
        Your teacher assigned a targeted 5-question practice module to build prerequisite understanding in Fractions.
      </p>
    </div>
  );
};

export default StudentInterventionCard;
