import React from 'react';

export interface NotificationFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  unreadCount?: number;
  totalCount?: number;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onFilterChange,
  unreadCount = 0,
  totalCount = 0,
}) => {
  const tabs = [
    { id: 'all', label: 'All Notifications', count: totalCount },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'urgent', label: 'Critical & High' },
    { id: 'study_plan', label: 'Study Plan' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'exam', label: 'Exams' },
    { id: 'intervention', label: 'Interventions' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
