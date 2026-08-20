import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  durationMinutes: number;
  onTimeUp?: () => void;
}

export const AssessmentTimer: React.FC<Props> = ({ durationMinutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isWarning = secondsLeft < 300;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold font-mono transition-all ${
      isWarning ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse' : 'bg-slate-900/80 border-slate-800 text-slate-300'
    }`}>
      <Clock className={`w-4 h-4 ${isWarning ? 'text-rose-400' : 'text-purple-400'}`} />
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
    </div>
  );
};

export default AssessmentTimer;
