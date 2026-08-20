import React from 'react';

export const FollowupCard: React.FC = () => {
  return (
    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-xs space-y-1">
      <div className="font-bold text-white">Follow-Up Required</div>
      <p className="text-slate-400">Unacknowledged message sent 2 days ago.</p>
    </div>
  );
};

export default FollowupCard;
