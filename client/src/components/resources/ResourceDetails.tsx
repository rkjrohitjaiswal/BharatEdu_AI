import React from 'react';
import { ArrowRight, CheckCircle2, Clock, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { ResourceReasonCard } from './ResourceReasonCard';

export interface ResourceDetailsProps {
  resource: any;
  onClose: () => void;
  onStart: (resourceId: string) => void;
  onComplete: (resourceId: string) => void;
}

export const ResourceDetails: React.FC<ResourceDetailsProps> = ({
  resource,
  onClose,
  onStart,
  onComplete,
}) => {
  if (!resource) return null;

  const { title, description, subject, topic, resourceType, estimatedMinutes, provider, officialSourceUrl, reason, isVerified } =
    resource;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {subject} • {resourceType}
            </span>
            <h3 className="font-extrabold text-lg text-slate-900 mt-1">{title}</h3>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

        {reason && <ResourceReasonCard reason={reason} />}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="text-slate-400 font-medium text-[11px]">Provider</span>
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <span>{provider || 'BharatEdu Library'}</span>
              {isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="text-slate-400 font-medium text-[11px]">Estimated Study Time</span>
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{estimatedMinutes || 15} minutes</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => onComplete(resource.resourceId)}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark as Completed</span>
          </button>

          {officialSourceUrl ? (
            <a
              href={officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onStart(resource.resourceId)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
            >
              <span>Open Study Material</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={() => onStart(resource.resourceId)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
            >
              <span>Start Studying</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
