import React from 'react';
import { IExamRiskClient } from '../../types/exam-preparation';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ExamRiskCardProps {
  risks: IExamRiskClient[];
}

export const ExamRiskCard: React.FC<ExamRiskCardProps> = ({ risks }) => {
  if (!risks || risks.length === 0) {
    return (
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center space-x-3 mb-6">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        <span className="text-sm font-semibold text-emerald-800">No critical exam preparation risks detected. You are on track!</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-red-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Preparation Risk Signals</h3>
      </div>

      <div className="space-y-3">
        {risks.map((risk, idx) => (
          <div key={idx} className="p-4 bg-red-50/50 rounded-xl border border-red-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-red-900 text-sm">{risk.title}</span>
              <span className="bg-red-200 text-red-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                {risk.severity}
              </span>
            </div>
            <p className="text-xs text-red-700 mb-2">{risk.description}</p>
            <div className="text-xs font-semibold text-red-900 bg-red-100 p-2 rounded-lg">
              💡 Action: {risk.mitigationAction}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
