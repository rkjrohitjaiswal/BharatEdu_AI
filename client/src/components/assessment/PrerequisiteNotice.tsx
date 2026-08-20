import React from 'react';
import { GitBranch } from 'lucide-react';

export interface PrerequisiteNoticeProps {
  notice?: string;
}

export const PrerequisiteNotice: React.FC<PrerequisiteNoticeProps> = ({ notice }) => {
  if (!notice) return null;

  return (
    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
      <GitBranch className="w-4 h-4 text-amber-600 shrink-0" />
      <span>{notice}</span>
    </div>
  );
};
