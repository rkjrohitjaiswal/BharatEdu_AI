import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
}

export const ParentResponseBox: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Reply to teacher or report home difficulty..."
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 min-h-[60px]"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="py-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" /> Send Reply
        </button>
      </div>
    </form>
  );
};

export default ParentResponseBox;
