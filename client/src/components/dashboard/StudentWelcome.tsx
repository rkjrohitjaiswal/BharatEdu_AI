import React from 'react';
import { User, StudentProfileData } from '../../types';
import { Badge } from '../Badge';
import { Flame, GraduationCap, Globe, BookOpen } from 'lucide-react';

interface StudentWelcomeProps {
  user: User | null;
  profile: StudentProfileData;
}

export const StudentWelcome: React.FC<StudentWelcomeProps> = ({ user, profile }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const streak = profile?.currentStreak || 0;

  return (
    <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-3 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="emerald" size="md">
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            Class {profile?.classLevel || 8} • {profile?.educationBoard || 'NCERT'}
          </Badge>
          <Badge variant="slate" size="md" className="bg-white/10 text-white border-white/20">
            <Globe className="w-3.5 h-3.5 mr-1" />
            {(user?.preferredLanguage || profile?.preferredLanguage || 'english').toUpperCase()}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {getGreeting()}, {user?.name || 'Student'} 👋
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
          Here is your personalized learning overview. Track your conceptual mastery, view recommended topics, and manage daily study goals.
        </p>
      </div>

      {/* Streak Badge Widget */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 shrink-0 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <p className="text-xs text-emerald-100 font-medium">Learning Streak</p>
          <p className="text-xl font-bold text-white">
            {streak > 0 ? `${streak} Day Streak 🔥` : 'Start Streak Today'}
          </p>
        </div>
      </div>
    </div>
  );
};
