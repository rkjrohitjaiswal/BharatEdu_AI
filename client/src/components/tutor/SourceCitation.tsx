import React from 'react';
import { SourceCitationItem } from '../../types';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface SourceCitationProps {
  sources: SourceCitationItem[];
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Grounded Educational Sources ({sources.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sources.map((src, index) => (
          <div
            key={index}
            className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1 hover:border-emerald-400 transition-colors"
          >
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1 font-bold text-slate-800 line-clamp-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{src.title}</span>
              </div>
              {src.sourceUrl && (
                <a
                  href={src.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 shrink-0"
                  title="View Official Source"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-[10px] text-slate-500">
              {src.publisher || 'NCERT'}
              {src.section ? ` • ${src.section}` : ''}
              {src.page ? ` • Page ${src.page}` : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
