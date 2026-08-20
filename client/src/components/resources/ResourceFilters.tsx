import React from 'react';

export interface ResourceFiltersProps {
  selectedSubject: string;
  onSubjectChange: (s: string) => void;
  selectedType: string;
  onTypeChange: (t: string) => void;
  subjects: string[];
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  selectedSubject,
  onSubjectChange,
  selectedType,
  onTypeChange,
  subjects,
}) => {
  const types = ['all', 'article', 'video', 'notes', 'worksheet', 'practice', 'reference'];

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs">
      <select
        value={selectedSubject}
        onChange={(e) => onSubjectChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {types.map((t) => (
          <option key={t} value={t}>
            {t === 'all' ? 'All Formats' : t.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};
