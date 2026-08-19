import React, { useState } from 'react';
import { Copy, Mail, Sparkles } from 'lucide-react';
import { fetchTeacherCopilotParentMessage } from '../../services/api';

export interface TeacherParentMessageProps {
  studentId: string;
  studentName: string;
}

export const TeacherParentMessage: React.FC<TeacherParentMessageProps> = ({ studentId, studentName }) => {
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetchTeacherCopilotParentMessage(studentId);
      if (res.success) {
        setDraft(res.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (draft?.body) {
      navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          <span>Parent Communication Draft</span>
        </h3>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{loading ? 'Generating...' : 'Generate Parent Message'}</span>
        </button>
      </div>

      {draft && (
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">{draft.subject}</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
            {draft.body}
          </pre>

          <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            ⚠️ {draft.disclaimer || 'AI-generated draft — review before sending.'}
          </div>
        </div>
      )}
    </div>
  );
};
