import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Award, Zap, HelpCircle, BookOpen, Flame, ShieldCheck, Crown, CheckCircle2, Star, TrendingUp, Target, Flag } from 'lucide-react';

interface AchievementCardProps {
  achievement: any;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'help-circle':
        return <HelpCircle className="w-5 h-5 text-sky-500" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'check-circle-2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'star':
        return <Star className="w-5 h-5 text-purple-500" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'target':
        return <Target className="w-5 h-5 text-red-500" />;
      case 'flag':
        return <Flag className="w-5 h-5 text-teal-500" />;
      default:
        return <Award className="w-5 h-5 text-purple-600" />;
    }
  };

  const formattedDate = new Date(achievement.earnedAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="p-4 bg-gradient-to-br from-white to-purple-50/40 border border-purple-100 rounded-xl shadow-xs space-y-2 text-xs">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-white border border-purple-200 rounded-xl shadow-xs shrink-0">
          {getIcon(achievement.icon)}
        </div>
        <div className="space-y-0.5">
          <h4 className="font-bold text-slate-900">{achievement.title}</h4>
          <p className="text-slate-500 text-[11px] leading-tight">{achievement.description}</p>
        </div>
      </div>
      <div className="pt-2 border-t border-purple-100 flex justify-between items-center text-[10px] text-slate-400">
        <Badge variant="purple">Earned</Badge>
        <span>Unlocked: {formattedDate}</span>
      </div>
    </div>
  );
};
