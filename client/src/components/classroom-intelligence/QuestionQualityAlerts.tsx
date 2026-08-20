import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const QuestionQualityAlerts: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        Question Quality & Difficulty Alerts
      </h3>

      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Question #3 has &lt;25% success rate across class. Consider reviewing options or reteaching prerequisite concept.</span>
      </div>
    </div>
  );
};

export default QuestionQualityAlerts;
