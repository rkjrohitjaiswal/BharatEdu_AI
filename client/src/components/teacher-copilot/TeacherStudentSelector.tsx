import React from 'react';
import { UserCheck, Users } from 'lucide-react';

export interface TeacherStudentSelectorProps {
  students: any[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export const TeacherStudentSelector: React.FC<TeacherStudentSelectorProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Select Student for Copilot Advice</h3>
          <p className="text-xs text-slate-500">Only authorized students in your assigned roster appear here.</p>
        </div>
      </div>

      <div className="relative min-w-[220px]">
        <select
          value={selectedStudentId}
          onChange={(e) => onSelectStudent(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>
            Select a student...
          </option>
          {students.map((st: any) => {
            const stId = String(st._id || st.id);
            return (
              <option key={stId} value={stId}>
                {st.name || 'Student'} ({st.email || stId})
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
