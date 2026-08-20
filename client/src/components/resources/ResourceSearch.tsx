import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const ResourceSearch: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search verified learning resources, chapters, topics, or concept IDs..."
        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
      />
    </div>
  );
};

export default ResourceSearch;
