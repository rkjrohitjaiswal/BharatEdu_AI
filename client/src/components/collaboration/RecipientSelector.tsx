import React from 'react';
import { Users } from 'lucide-react';

interface Props {
  recipient: 'parent' | 'student' | 'both';
  onChange: (val: 'parent' | 'student' | 'both') => void;
}

export const RecipientSelector: React.FC<Props> = ({ recipient, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-400 font-semibold flex items-center gap-1">
        <Users className="w-3.5 h-3.5 text-purple-400" /> Recipient:
      </span>
      <select
        value={recipient}
        onChange={(e) => onChange(e.target.value as any)}
        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
      >
        <option value="both">Parent & Student (Both)</option>
        <option value="parent">Parent Only</option>
        <option value="student">Student Only</option>
      </select>
    </div>
  );
};

export default RecipientSelector;
