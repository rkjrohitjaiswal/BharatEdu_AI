import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  answeredCount: number;
  totalQuestions: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AssessmentSubmitDialog: React.FC<Props> = ({
  isOpen,
  answeredCount,
  totalQuestions,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  const unAnswered = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-purple-400">
          <CheckCircle2 className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-bold text-white">Ready to Submit?</h3>
            <p className="text-xs text-slate-400">Server will evaluate your answers once submitted.</p>
          </div>
        </div>

        {unAnswered > 0 && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>You have {unAnswered} unanswered question(s).</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 text-xs font-bold text-slate-300 hover:text-white rounded-xl"
          >
            Continue Test
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl shadow-lg"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSubmitDialog;
