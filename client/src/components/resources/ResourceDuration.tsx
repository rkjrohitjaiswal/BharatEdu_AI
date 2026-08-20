import React from 'react';
import { Clock } from 'lucide-react';

interface Props {
  minutes: number;
}

export const ResourceDuration: React.FC<Props> = ({ minutes }) => {
  return (
    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
      <Clock className="w-3 h-3 text-slate-500" />
      <span>{minutes} mins</span>
    </div>
  );
};

export default ResourceDuration;
