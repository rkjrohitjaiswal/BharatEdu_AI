import React from 'react';
import { CheckCircle2, Lock, PlayCircle, Sparkles } from 'lucide-react';
import { ILearningPathStageDTO, ILearningPathTaskDTO } from '../../types/learning-path';

export interface LearningPathStageProps {
  stage: ILearningPathStageDTO;
  isCurrent: boolean;
  onTaskStart: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
  onStageComplete: (stageId: string) => void;
}

export const LearningPathStageCard: React.FC<LearningPathStageProps> = ({
  stage,
  isCurrent,
  onTaskStart,
  onTaskComplete,
  onStageComplete,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px] uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      case 'active':
      case 'available':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-[10px] uppercase flex items-center gap-1"><Sparkles className="w-3 h-3"/> Active Stage</span>;
      case 'skipped':
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">Skipped</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 font-bold text-[10px] uppercase flex items-center gap-1"><Lock className="w-3 h-3"/> Locked</span>;
    }
  };

  const allCompleted = stage.tasks.length > 0 && stage.tasks.every((t: ILearningPathTaskDTO) => t.status === 'completed');

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 p-6 space-y-4 ${
        isCurrent
          ? 'bg-white border-indigo-300 shadow-xl ring-2 ring-indigo-500/20'
          : stage.status === 'completed'
          ? 'bg-slate-50/80 border-slate-200'
          : 'bg-slate-50/50 border-slate-200 opacity-80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
              {stage.subject} Stage {stage.stageIndex}
            </span>
            {getStatusBadge(stage.status)}
          </div>
          <h3 className="text-lg font-black text-slate-900">{stage.title}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">{stage.description}</p>
        </div>

        {stage.status !== 'completed' && allCompleted && (
          <button
            onClick={() => onStageComplete(stage.id)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Stage</span>
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-2.5 pt-2">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Stage Action Items ({stage.tasks.length})</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stage.tasks.map((task: ILearningPathTaskDTO) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                task.status === 'completed'
                  ? 'bg-emerald-50/50 border-emerald-200/60 text-slate-700'
                  : task.status === 'active'
                  ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-400/30'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-600">
                    {task.taskType} • {task.estimatedMinutes}m
                  </span>
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${task.priority === 'critical' ? 'bg-red-500' : 'bg-indigo-500'}`} />
                  )}
                </div>
                <h5 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h5>
                <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>
              </div>

              {task.status !== 'completed' && (
                <button
                  onClick={() => (task.status === 'active' ? onTaskComplete(task.id) : onTaskStart(task.id))}
                  className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    task.status === 'active'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  {task.status === 'active' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Start Task</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
