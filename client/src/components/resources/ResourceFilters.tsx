import React from 'react';

export interface ResourceFiltersProps {
  selectedSubject: string;
  onSelectSubject?: (subject: string) => void;
  selectedType?: string;
  onSelectType?: (type: string) => void;
  selectedLanguage?: string;
  selectedDifficulty?: string;
  onSubjectChange?: (subject: string) => void;
  onLanguageChange?: (language: string) => void;
  onDifficultyChange?: (difficulty: string) => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  selectedSubject,
  onSelectSubject,
  selectedType = 'All',
  onSelectType,
  selectedLanguage = 'All',
  selectedDifficulty = 'All',
  onSubjectChange,
  onLanguageChange,
  onDifficultyChange,
}) => {
  const subjects = ['All', 'Mathematics', 'Science', 'English'];
  const types = ['All', 'textbook', 'article', 'worksheet', 'video'];

  const handleSubject = (sub: string) => {
    if (onSelectSubject) onSelectSubject(sub);
    if (onSubjectChange) onSubjectChange(sub);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-gray-200">
        <span className="text-[10px] font-bold text-gray-400 uppercase px-2">Subject:</span>
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => handleSubject(sub)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedSubject === sub ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {onSelectType && (
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase px-2">Format:</span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => onSelectType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                selectedType === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
