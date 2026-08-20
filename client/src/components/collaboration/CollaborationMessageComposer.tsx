import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Props {
  onSend: (body: string, requiresAck: boolean) => void;
  onGenerateDraft?: () => void;
}

export const CollaborationMessageComposer: React.FC<Props> = ({ onSend, onGenerateDraft }) => {
  const [body, setBody] = useState('');
  const [requiresAck, setRequiresAck] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSend(body, requiresAck);
    setBody('');
    setRequiresAck(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type your message, intervention guidance, or home support update..."
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 min-h-[80px]"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresAck}
            onChange={(e) => setRequiresAck(e.target.checked)}
            className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500"
          />
          <span>Require recipient acknowledgment</span>
        </label>

        <div className="flex items-center gap-2">
          {onGenerateDraft && (
            <button
              type="button"
              onClick={onGenerateDraft}
              className="py-1.5 px-3 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 font-semibold rounded-lg flex items-center gap-1.5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Message Draft</span>
            </button>
          )}

          <button
            type="submit"
            className="py-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center gap-1.5 text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default CollaborationMessageComposer;
