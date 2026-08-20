import React from 'react';
import { ILearningResourceClient } from '../../types/resource-recommendation';
import { ResourceSourceBadge } from './ResourceSourceBadge';
import { ResourceDuration } from './ResourceDuration';
import { ExternalLink, CheckCircle2, Play, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  resource: ILearningResourceClient;
  onStart?: () => void;
  onComplete?: () => void;
  onSave?: () => void;
  onFeedback?: (type: string) => void;
}

export const ResourceDetails: React.FC<Props> = ({ resource, onStart, onComplete, onSave, onFeedback }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-xs shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <ResourceSourceBadge provider={resource.provider} isVerified={resource.isVerified} />
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{resource.title}</h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">{resource.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onSave && (
            <button onClick={onSave} className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" /> Save
            </button>
          )}
          {resource.sourceUrl && (
            <a
              href={resource.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-1.5"
            >
              <span>Visit Official Source</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Type</div>
          <div className="font-bold text-white capitalize mt-1">{resource.resourceType.replace(/_/g, ' ')}</div>
        </div>
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Difficulty</div>
          <div className="font-bold text-purple-400 capitalize mt-1">{resource.difficulty}</div>
        </div>
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Estimated Time</div>
          <div className="font-bold text-emerald-400 mt-1">{resource.estimatedMinutes} Mins</div>
        </div>
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 font-medium">Board & Grade</div>
          <div className="font-bold text-amber-400 mt-1">{resource.board} • Class {resource.classLevel}</div>
        </div>
      </div>

      {resource.learningObjectives && resource.learningObjectives.length > 0 && (
        <div className="space-y-2 p-4 bg-slate-950/40 border border-slate-800 rounded-2xl">
          <h4 className="font-bold text-white text-sm">Learning Objectives</h4>
          <ul className="space-y-1 text-slate-300">
            {resource.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onFeedback && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <span className="text-slate-400 font-semibold">Was this recommendation helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFeedback('helpful')}
              className="py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold flex items-center gap-1"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Helpful
            </button>
            <button
              onClick={() => onFeedback('not_helpful')}
              className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg font-bold flex items-center gap-1"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> Not Helpful
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetails;
