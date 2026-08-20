import React from 'react';
import { Filter } from 'lucide-react';

export interface ResourceFiltersProps {
  selectedSubject: string;
  onSelectSubject: (subj: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  verifiedOnly: boolean;
  onToggleVerified: (val: boolean) => void;
  subjects: string[];
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  selectedSubject,
  onSelectSubject,
  selectedType,
  onSelectType,
  verifiedOnly,
  onToggleVerified,
  subjects,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => onSelectSubject(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          onChange={(e) => onSelectType(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Material Types</option>
          <option value="video">Videos</option>
          <option value="notes">Notes</option>
          <option value="practice">Practice</option>
          <option value="revision">Revision</option>
          <option value="simulation">Simulations</option>
          <option value="career_resource">Career Guides</option>
        </select>
      </div>

      <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => onToggleVerified(e.target.checked)}
          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
        />
        <span>Verified Sources Only</span>
      </label>
    </div>
  );
};
