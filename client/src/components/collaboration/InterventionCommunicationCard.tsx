import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export const InterventionCommunicationCard: React.FC = () => {
  return (
    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white">Intervention Communication</span>
        <span className="text-purple-400 font-semibold">Active</span>
      </div>
      <p className="text-slate-400">Communication log synced with Feature 37 Classroom Intelligence.</p>
    </div>
  );
};

export default InterventionCommunicationCard;
