import React from 'react';
import { ConversationItem } from '../../types';
import { MessageSquare, Plus, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '../Button';

interface ConversationListProps {
  conversations: ConversationItem[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 space-y-3 shrink-0">
        <Button
          onClick={onNewConversation}
          variant="primary"
          size="md"
          className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
          icon={<Plus className="w-4 h-4" />}
        >
          New Conversation
        </Button>
      </div>

      {/* Conversation List Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1">
          Previous Doubts ({conversations.length})
        </p>

        {conversations.length === 0 ? (
          <div className="p-4 text-center text-slate-500 italic text-[11px]">
            No previous conversations. Start a new chat above!
          </div>
        ) : (
          conversations.map((conv) => {
            const convId = conv._id || conv.id || '';
            const isActive = String(convId) === String(activeConversationId);

            return (
              <div
                key={convId}
                onClick={() => onSelectConversation(convId)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-emerald-900/60 border border-emerald-700/50 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="truncate max-w-[140px] sm:max-w-[170px]">{conv.title || 'Untitled Chat'}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => onDeleteConversation(convId, e)}
                    className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-colors"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
