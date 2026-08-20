import React from 'react';
import { Archive, BookOpen, Clock, FileText, Layers, Sparkles } from 'lucide-react';
import { IStudyMaterialClientDTO } from '../../types/study-material';
import { StudyMaterialPriorityBadge } from './StudyMaterialPriorityBadge';

export interface StudyMaterialCardProps {
  material: IStudyMaterialClientDTO;
  onSelect: (id: string) => void;
  onArchive?: (id: string) => void;
}

export const StudyMaterialCard: React.FC<StudyMaterialCardProps> = ({ material, onSelect, onArchive }) => {
  const { title, subject, materialType, difficulty, estimatedMinutes, sections, sourceReferences, generatedBy, id } = material;

  return (
    <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
            {subject} • {materialType.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-1.5">
            <StudyMaterialPriorityBadge difficulty={difficulty} />
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
              {generatedBy}
            </span>
          </div>
        </div>

        <h3 className="text-sm font-black text-slate-900 leading-snug">{title}</h3>

        <div className="space-y-1">
          {sections.slice(0, 2).map((sec, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-600 font-medium line-clamp-2">
              <strong className="text-slate-900">{sec.title}:</strong> {sec.content}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> {estimatedMinutes} mins study
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" /> {sections.length} Sections
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(id)}
            className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1 transition"
          >
            <BookOpen className="w-3.5 h-3.5" /> Read Notes & Flashcards
          </button>
          {onArchive && (
            <button
              onClick={() => onArchive(id)}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              title="Archive Material"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
