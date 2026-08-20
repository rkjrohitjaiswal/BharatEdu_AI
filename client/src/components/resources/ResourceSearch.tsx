import React from 'react';
import { Search } from 'lucide-react';

interface ResourceSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const ResourceSearch: React.FC<ResourceSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative mb-4">
      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search verified learning resources by title, topic, or concept..."
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
      />
    </div>
  );
};
