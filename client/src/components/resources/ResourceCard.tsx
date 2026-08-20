import React from 'react';
import { BookOpen, CheckCircle2, Clock, ExternalLink, Play } from 'lucide-react';

export interface ResourceCardProps {
  resource: any;
  onOpen: (resource: any) => void;
  onComplete?: (resourceId: string) => void;
  isCompleted?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onOpen,
  onComplete,
  isCompleted,
}) => {
  const { title, description, resourceType, subject, topic, estimatedMinutes, provider, officialSourceUrl } =
    resource;

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {subject} • {resourceType}
          </span>
          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> {estimatedMinutes || 15} min
          </span>
        </div>

        <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">{title}</h4>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{description}</p>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400 font-medium truncate">{provider || 'BharatEdu Hub'}</span>

        <div className="flex items-center gap-1.5">
          {onComplete && !isCompleted && (
            <button
              onClick={() => onComplete(resource.resourceId)}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-[10px] font-bold flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          )}

          <button
            onClick={() => onOpen(resource)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition inline-flex items-center gap-1 shadow-sm"
          >
            <span>Study</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
