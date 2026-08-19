import React from 'react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { PreferredLanguage } from '../../types';
import { Bot, Globe, GraduationCap, Plus, History } from 'lucide-react';

interface TutorHeaderProps {
  currentLanguage: PreferredLanguage;
  onLanguageChange: (lang: PreferredLanguage) => void;
  onNewConversation: () => void;
  onToggleMobileDrawer?: () => void;
  classLevel?: number;
}

export const TutorHeader: React.FC<TutorHeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onNewConversation,
  onToggleMobileDrawer,
  classLevel = 8,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileDrawer}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 shrink-0"
          title="Conversation History"
        >
          <History className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Bot className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
              BharatEdu AI Tutor
            </h1>
            <Badge variant="emerald" size="sm">
              <GraduationCap className="w-3 h-3 mr-1" />
              Class {classLevel}
            </Badge>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
            Learn concepts step-by-step with trusted educational guidance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as PreferredLanguage)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi (हिंदी)</option>
            <option value="gujarati">Gujarati (ગુજરાતી)</option>
          </select>
        </div>

        <Button
          onClick={onNewConversation}
          variant="outline"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};
