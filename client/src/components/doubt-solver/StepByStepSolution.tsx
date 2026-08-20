import React from 'react';
import { CheckCircle, HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import { IDoubtSolutionClientDTO } from '../../types/doubt-solver';

export interface StepByStepSolutionProps {
  solution: IDoubtSolutionClientDTO;
  onSocraticMode?: () => void;
}

export const StepByStepSolutionCard: React.FC<StepByStepSolutionProps> = ({ solution, onSocraticMode }) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-black text-slate-900">Step-by-Step Educational Solution</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[10px] uppercase">
          {solution.category.replace('_', ' ')}
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
        {solution.summary}
      </p>

      {/* Prerequisite Chain */}
      {solution.prerequisiteChain.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Prerequisite Learning Chain</h4>
          <div className="flex flex-wrap gap-1.5">
            {solution.prerequisiteChain.map((p, idx) => (
              <span key={idx} className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                {idx + 1}. {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Solution Steps */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Solution Steps</h4>
        {solution.steps.map((step) => (
          <div key={step.stepNumber} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center">
                {step.stepNumber}
              </span>
              <h5 className="text-xs font-black text-slate-900">{step.title}</h5>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Follow Up Suggestions */}
      {solution.followUpQuestions.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Follow-Up Suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {solution.followUpQuestions.map((fq, idx) => (
              <button
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs transition border border-indigo-100"
              >
                {fq}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
