import React from 'react';
import { ArrowRight, ExternalLink, GitBranch, ShieldAlert, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConceptReadiness } from './ConceptReadiness';

export interface ConceptDetailsProps {
  concept: any;
  readiness?: any;
  prerequisites: any[];
  dependents: any[];
  onClose: () => void;
}

export const ConceptDetails: React.FC<ConceptDetailsProps> = ({
  concept,
  readiness,
  prerequisites,
  dependents,
  onClose,
}) => {
  if (!concept) return null;

  const { name, subject, classLevel, description, difficulty, category, officialSourceUrl } = concept;
  const isBlocked = readiness?.isBlocked || readiness?.readinessLevel === 'blocked';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {subject} • {classLevel}
            </span>
            <h3 className="font-extrabold text-lg text-slate-900 mt-1">{name}</h3>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

        {readiness && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700">Concept Readiness Analysis</div>
            <ConceptReadiness score={readiness.readinessScore} level={readiness.readinessLevel} />

            {isBlocked && (
              <div className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Blocked by weak prerequisite: {readiness.blockingPrerequisites?.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Prerequisites */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-900 flex items-center gap-1">
            <GitBranch className="w-4 h-4 text-indigo-600" /> Prerequisite Concepts ({prerequisites.length}):
          </h4>
          {prerequisites.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              {prerequisites.map((p) => (
                <span key={p.conceptId} className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  {p.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 font-medium">Foundational concept (No prerequisites).</p>
          )}
        </div>

        {/* Dependents */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-900 flex items-center gap-1">
            <GitBranch className="w-4 h-4 text-purple-600" /> Unlocks Downstream Concepts ({dependents.length}):
          </h4>
          {dependents.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              {dependents.map((d) => (
                <span key={d.conceptId} className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-200">
                  {d.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 font-medium">Top-level concept in current curriculum path.</p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          {officialSourceUrl ? (
            <a
              href={officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              <span>Official Curriculum Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span />
          )}

          <Link
            to="/practice"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
          >
            <span>Practice Concept</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
