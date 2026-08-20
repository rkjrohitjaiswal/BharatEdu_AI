import React from 'react';

export const ParentProgressFollowup: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs space-y-1">
      <div className="font-bold text-white">Progress Follow-Up</div>
      <p className="text-slate-400">Child's practice accuracy has shown consistent steady improvement (+8%) over recent sessions.</p>
    </div>
  );
};

export default ParentProgressFollowup;
