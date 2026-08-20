import React from 'react';

export const StudentMessageDraft: React.FC = () => {
  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs space-y-2">
      <div className="font-bold text-white">Student Task Draft</div>
      <p className="text-slate-400">Complete 5 targeted practice questions to build foundational confidence.</p>
    </div>
  );
};

export default StudentMessageDraft;
