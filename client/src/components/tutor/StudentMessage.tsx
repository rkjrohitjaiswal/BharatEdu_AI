import React from 'react';
import { TutorMessageItem } from '../../types';
import { User } from 'lucide-react';

interface StudentMessageProps {
  message: TutorMessageItem;
}

export const StudentMessage: React.FC<StudentMessageProps> = ({ message }) => {
  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex items-start justify-end gap-2.5 my-3">
      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] space-y-1">
        <div className="bg-emerald-700 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-2xs text-xs sm:text-sm leading-relaxed font-medium">
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
        <User className="w-4 h-4" />
      </div>
    </div>
  );
};
