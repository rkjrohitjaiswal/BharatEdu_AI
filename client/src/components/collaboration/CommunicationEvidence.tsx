import React from 'react';
import { Database } from 'lucide-react';

interface Props {
  evidence: string[];
}

export const CommunicationEvidence: React.FC<Props> = ({ evidence }) => {
  return (
    <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1 text-xs">
      <div className="font-bold text-slate-300 flex items-center gap-1">
        <Database className="w-3.5 h-3.5 text-purple-400" /> Grounded Evidence
      </div>
      {evidence.map((ev, i) => (
        <div key={i} className="text-slate-400 flex items-center gap-1">
          <span className="text-purple-400">•</span>
          <span>{ev}</span>
        </div>
      ))}
    </div>
  );
};

export default CommunicationEvidence;
