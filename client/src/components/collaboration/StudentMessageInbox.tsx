import React from 'react';
import { ICollaborationMessageClient } from '../../types/collaboration';
import { CheckCircle2, User } from 'lucide-react';

interface Props {
  messages: ICollaborationMessageClient[];
  onAcknowledge: (msgId: string) => void;
}

export const StudentMessageInbox: React.FC<Props> = ({ messages, onAcknowledge }) => {
  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div key={m.messageId} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-400">
            <span className="text-purple-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> From Teacher
            </span>
            <span>{new Date(m.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="text-slate-200 leading-relaxed font-medium">{m.body}</p>

          {m.requiresAcknowledgement && (
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-amber-400 font-semibold text-[10px]">Acknowledge Teacher Guidance</span>
              <button
                onClick={() => onAcknowledge(m.messageId)}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge & Understand
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentMessageInbox;
