import React from 'react';
import { HeartHandshake } from 'lucide-react';

export interface ParentStudentSelectorProps {
  students: any[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export const ParentStudentSelector: React.FC<ParentStudentSelectorProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Select Child for Parent Guidance</h3>
          <p className="text-xs text-slate-500">Only actively linked students appear in your parent dashboard.</p>
        </div>
      </div>

      <div className="relative min-w-[220px]">
        <select
          value={selectedStudentId}
          onChange={(e) => onSelectStudent(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="" disabled>
            Select your child...
          </option>
          {students.map((st: any) => {
            const stId = String(st._id || st.id);
            return (
              <option key={stId} value={stId}>
                {st.name || 'Child'} ({st.email || stId})
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
