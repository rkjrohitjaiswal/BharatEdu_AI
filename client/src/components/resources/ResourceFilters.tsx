import React from 'react';

interface Props {
  selectedSubject: string;
  selectedLanguage: string;
  selectedDifficulty: string;
  onSubjectChange: (val: string) => void;
  onLanguageChange: (val: string) => void;
  onDifficultyChange: (val: string) => void;
}

export const ResourceFilters: React.FC<Props> = ({
  selectedSubject,
  selectedLanguage,
  selectedDifficulty,
  onSubjectChange,
  onLanguageChange,
  onDifficultyChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/60 p-3 border border-slate-800 rounded-2xl">
      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 font-semibold">Subject:</span>
        <select
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-purple-500 font-bold"
        >
          <option value="all">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="Physics">Physics</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 font-semibold">Language:</span>
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-purple-500 font-bold"
        >
          <option value="all">All Languages</option>
          <option value="en">English (EN)</option>
          <option value="hi">Hindi (HI)</option>
          <option value="gu">Gujarati (GU)</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 font-semibold">Difficulty:</span>
        <select
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-purple-500 font-bold"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    </div>
  );
};

export default ResourceFilters;
