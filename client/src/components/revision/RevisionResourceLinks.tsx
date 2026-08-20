import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RevisionResourceLinksProps {
  topic: string;
}

export const RevisionResourceLinks: React.FC<RevisionResourceLinksProps> = ({ topic }) => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="font-semibold text-slate-500 flex items-center gap-1">
        <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Study Resources:
      </span>
      <Link
        to="/resources"
        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 transition"
      >
        <span>Open Materials for {topic}</span>
        <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  );
};
