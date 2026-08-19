import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface ExamRiskAlertProps {
  daysCategory: string;
  daysRemaining: number;
}

export const ExamRiskAlert: React.FC<ExamRiskAlertProps> = ({ daysCategory, daysRemaining }) => {
  if (daysCategory === 'critical_mode') {
    return (
      <div className="p-4 bg-red-500 text-white rounded-2xl shadow-md space-y-1 text-xs">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-300" /> CRITICAL REVISION MODE ({daysRemaining} DAYS LEFT)
        </div>
        <p className="text-red-100 text-[11px]">
          Exam is imminent! Focus exclusively on critical learning gaps, formula recall, and mock tests.
        </p>
      </div>
    );
  }

  if (daysCategory === 'high_risk_mode') {
    return (
      <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-md space-y-1 text-xs">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Clock className="w-5 h-5 text-amber-100" /> HIGH-RISK MODE ({daysRemaining} DAYS LEFT)
        </div>
        <p className="text-amber-100 text-[11px]">
          Prioritize high-risk weak topics and resolve active learning gaps.
        </p>
      </div>
    );
  }

  return null;
};
