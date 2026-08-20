import React, { useState } from 'react';
import { HelpCircle, Lightbulb } from 'lucide-react';

export interface HintPanelProps {
  hint?: string;
  onUseHint?: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({ hint, onUseHint }) => {
  const [showHint, setShowHint] = useState<boolean>(false);

  if (!hint) return null;

  return (
    <div className="space-y-2">
      {!showHint ? (
        <button
          type="button"
          onClick={() => {
            setShowHint(true);
            if (onUseHint) onUseHint();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition"
        >
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <span>Need a Hint?</span>
        </button>
      ) : (
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 font-medium space-y-1">
          <div className="flex items-center gap-1 font-bold text-indigo-700">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hint:</span>
          </div>
          <p>{hint}</p>
        </div>
      )}
    </div>
  );
};
