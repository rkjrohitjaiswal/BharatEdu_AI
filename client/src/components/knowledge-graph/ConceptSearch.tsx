import React from 'react';
import { Search } from 'lucide-react';

export interface ConceptSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedSubject: string;
  onSubjectChange: (s: string) => void;
  subjects: string[];
}

export const ConceptSearch: React.FC<ConceptSearchProps> = ({
  query,
  onQueryChange,
  selectedSubject,
  onSubjectChange,
  subjects,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search concepts by name, topic, or alias..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <select
        value={selectedSubject}
        onChange={(e) => onSubjectChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
      >
        <option value="all">All Subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};
