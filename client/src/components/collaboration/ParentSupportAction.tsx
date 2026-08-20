import React from 'react';
import { Home, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const ParentSupportAction: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3 text-xs">
      <div className="flex items-center gap-2 font-bold text-white">
        <Home className="w-4 h-4 text-purple-400" /> Recommended Home Support Routine
      </div>
      <p className="text-slate-300">Encourage 25 minutes of quiet revision every evening before dinner.</p>
      <button
        onClick={onComplete}
        className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center gap-1.5 text-[10px]"
      >
        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Support Routine Confirmed
      </button>
    </div>
  );
};

export default ParentSupportAction;
