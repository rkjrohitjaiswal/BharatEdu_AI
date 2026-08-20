import React from 'react';
import { ICollaborationMessageClient } from '../../types/collaboration';
import { CheckCircle2, User, Sparkles } from 'lucide-react';

interface Props {
  messages: ICollaborationMessageClient[];
  onAcknowledge?: (msgId: string) => void;
}

export const CollaborationMessageList: React.FC<Props> = ({ messages, onAcknowledge }) => {
  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div
          key={m.messageId}
          className={`p-4 rounded-2xl border space-y-2 text-xs ${
            m.senderRole === 'teacher'
              ? 'bg-purple-950/20 border-purple-500/30 ml-4'
              : m.senderRole === 'parent'
              ? 'bg-indigo-950/20 border-indigo-500/30 mr-4'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-white">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>{m.senderRole}</span>
              {m.aiGenerated && (
                <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Drafted
                </span>
              )}
            </div>
            <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <p className="text-slate-200 leading-relaxed font-medium">{m.body}</p>

          {m.requiresAcknowledgement && (
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-amber-400 font-semibold text-[10px]">Acknowledgment Required</span>
              {onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(m.messageId)}
                  className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" /> Acknowledge Update
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollaborationMessageList;
