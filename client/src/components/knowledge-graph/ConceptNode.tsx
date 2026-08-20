import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface ConceptNodeProps {
  concept: any;
  readiness?: any;
  onSelect: (concept: any) => void;
  isSelected?: boolean;
}

export const ConceptNode: React.FC<ConceptNodeProps> = ({ concept, readiness, onSelect, isSelected }) => {
  const level = readiness?.readinessLevel || 'developing';
  const isBlocked = readiness?.isBlocked || level === 'blocked';

  const getStyle = (lvl: string) => {
    switch (lvl) {
      case 'strong':
        return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', icon: CheckCircle2 };
      case 'ready':
        return { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800', icon: CheckCircle2 };
      case 'weak':
        return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', icon: AlertCircle };
      case 'blocked':
        return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', icon: ShieldAlert };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', icon: AlertCircle };
    }
  };

  const style = getStyle(level);
  const Icon = style.icon;

  return (
    <div
      onClick={() => onSelect(concept)}
      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${style.bg} ${style.border} ${
        isSelected ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-md' : 'hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/80 text-slate-700 border border-slate-200">
          {concept.subject}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
          <Icon className="w-3.5 h-3.5 shrink-0" />
          <span className={style.text}>{level}</span>
        </div>
      </div>

      <h4 className="font-extrabold text-slate-900 text-xs mt-2 line-clamp-1">{concept.name}</h4>

      {readiness && (
        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-600">
          <span>Readiness:</span>
          <span className="font-extrabold">{readiness.readinessScore}%</span>
        </div>
      )}

      {isBlocked && (
        <div className="mt-1 text-[9px] font-bold text-red-600 uppercase flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" /> Prerequisite Blocked
        </div>
      )}
    </div>
  );
};
