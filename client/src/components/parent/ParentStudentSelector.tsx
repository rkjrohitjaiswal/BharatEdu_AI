import React from 'react';

interface ParentStudentSelectorProps {
  linkedStudents: any[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export const ParentStudentSelector: React.FC<ParentStudentSelectorProps> = ({
  linkedStudents,
  selectedStudentId,
  onSelectStudent,
}) => {
  if (!linkedStudents || linkedStudents.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/15 text-xs">
      <span className="text-purple-200 font-semibold pl-1">My Students:</span>
      <select
        value={selectedStudentId}
        onChange={(e) => onSelectStudent(e.target.value)}
        className="bg-purple-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-purple-700 focus:outline-none cursor-pointer"
      >
        {linkedStudents.map((ls) => {
          const s = ls.student;
          const sid = String(s?._id || s?.id || s);
          return (
            <option key={sid} value={sid}>
              {s?.name || 'Student'}
            </option>
          );
        })}
      </select>
    </div>
  );
};
