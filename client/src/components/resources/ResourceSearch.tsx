import React from 'react';
import { Search } from 'lucide-react';

export interface ResourceSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export const ResourceSearch: React.FC<ResourceSearchProps> = ({ query, onQueryChange }) => {
  return (
    <div className="relative flex-1">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search resources by title, topic, or tag..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};
