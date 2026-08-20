import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  onSubmit: (type: string, comment?: string) => void;
}

export const ResourceFeedback: React.FC<Props> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleType = (type: string) => {
    onSubmit(type, comment);
    setComment('');
  };

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
      <div className="font-bold text-white flex items-center gap-1.5">
        <MessageSquare className="w-4 h-4 text-purple-400" /> Share Resource Feedback
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => handleType('helpful')} className="py-1 px-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-semibold">
          Helpful
        </button>
        <button onClick={() => handleType('too_easy')} className="py-1 px-2.5 bg-slate-800 text-slate-300 rounded font-semibold">
          Too Easy
        </button>
        <button onClick={() => handleType('too_difficult')} className="py-1 px-2.5 bg-slate-800 text-slate-300 rounded font-semibold">
          Too Difficult
        </button>
        <button onClick={() => handleType('not_helpful')} className="py-1 px-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded font-semibold">
          Not Helpful
        </button>
      </div>
    </div>
  );
};

export default ResourceFeedback;
