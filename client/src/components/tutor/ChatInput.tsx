import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  loading = false,
}) => {
  const [content, setContent] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 1000;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!content.trim() || disabled || loading) return;
    onSendMessage(content.trim());
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-3 sm:p-4 rounded-b-2xl shrink-0 space-y-2">
      <div className="relative border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-xl bg-white shadow-2xs overflow-hidden transition-all">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="Ask a learning doubt or explain what concept you're stuck on..."
          disabled={disabled || loading}
          rows={1}
          className="w-full px-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none max-h-32"
          aria-label="Ask AI Tutor a question"
        />

        {/* Input Bar Controls */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {/* Future Voice Input Button */}
            <button
              type="button"
              disabled
              title="Voice Input (Coming in Phase 6)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 disabled:opacity-50 cursor-not-allowed transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Future Image Upload Button */}
            <button
              type="button"
              disabled
              title="Image Upload (Coming in Phase 6)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 disabled:opacity-50 cursor-not-allowed transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-mono">
              {content.length}/{MAX_CHARS}
            </span>

            <button
              type="button"
              onClick={handleSend}
              disabled={!content.trim() || disabled || loading}
              className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs ${
                content.trim() && !disabled && !loading
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
