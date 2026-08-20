import React from 'react';
import { Sparkles, CheckCircle2, Play, XCircle } from 'lucide-react';
import { IClassroomIntelligenceClient } from '../../types/classroom-intelligence';
import { startClassroomIntervention, completeClassroomIntervention, dismissClassroomIntervention } from '../../services/api';

interface Props {
  interventions: IClassroomIntelligenceClient['suggestedInterventions'];
  onRefresh: () => void;
}

export const InterventionQueue: React.FC<Props> = ({ interventions, onRefresh }) => {
  const handleStart = async (id: string) => {
    await startClassroomIntervention(id);
    onRefresh();
  };

  const handleComplete = async (id: string) => {
    await completeClassroomIntervention(id, 'Successfully conducted remediation');
    onRefresh();
  };

  const handleDismiss = async (id: string) => {
    await dismissClassroomIntervention(id);
    onRefresh();
  };

  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Recommended Teacher Intervention Queue
        </h3>
        <span className="text-xs text-slate-400">{interventions.length} Pending</span>
      </div>

      <div className="space-y-3">
        {interventions.map((intv) => (
          <div key={intv.interventionId} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  intv.priority === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                  intv.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {intv.priority} Priority
                </span>
                <span className="text-xs text-purple-300 font-semibold uppercase">{intv.interventionType.replace(/_/g, ' ')}</span>
              </div>
              <span className="text-xs text-slate-400 capitalize">{intv.status}</span>
            </div>

            <p className="text-xs text-white font-medium">{intv.reason}</p>

            {intv.recommendedActions && intv.recommendedActions.length > 0 && (
              <div className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-300">Recommended Actions:</div>
                {intv.recommendedActions.map((act, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-purple-400">•</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              {intv.status === 'suggested' && (
                <button
                  onClick={() => handleStart(intv.interventionId)}
                  className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Intervention</span>
                </button>
              )}
              {['planned', 'active'].includes(intv.status) && (
                <button
                  onClick={() => handleComplete(intv.interventionId)}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete</span>
                </button>
              )}
              {intv.status !== 'dismissed' && (
                <button
                  onClick={() => handleDismiss(intv.interventionId)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterventionQueue;
