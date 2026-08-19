import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  Briefcase,
  Check,
  CheckCheck,
  GraduationCap,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../Badge';

export interface NotificationCardProps {
  notification: {
    _id?: string;
    id?: string;
    title: string;
    message: string;
    priority: 'low' | 'normal' | 'high' | 'critical';
    sourceType: string;
    actionUrl?: string;
    isRead: boolean;
    createdAt: string | Date;
  };
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  const navigate = useNavigate();
  const notifId = notification._id || notification.id || '';

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'study_plan':
        return <BookOpen className="w-5 h-5 text-sky-600" />;
      case 'mistake_review':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'intervention':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'scholarship':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'goal':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'exam':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'learning_coach':
        return <Bot className="w-5 h-5 text-emerald-600" />;
      case 'career':
        return <Briefcase className="w-5 h-5 text-teal-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'red';
      case 'high':
        return 'amber';
      case 'normal':
        return 'blue';
      default:
        return 'slate';
    }
  };

  const formatRelativeTime = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      if (onMarkRead && !notification.isRead && notifId) {
        onMarkRead(notifId);
      }
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        notification.isRead
          ? 'bg-white border-slate-200 text-slate-700'
          : 'bg-emerald-50/40 border-emerald-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
          {getSourceIcon(notification.sourceType)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 text-sm">{notification.title}</h4>
              {!notification.isRead && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" title="Unread" />
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={getPriorityBadgeVariant(notification.priority)} size="sm">
                {notification.priority}
              </Badge>
              <span className="text-xs text-slate-400">{formatRelativeTime(notification.createdAt)}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-3">{notification.message}</p>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            {notification.actionUrl ? (
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-slate-400 capitalize">{notification.sourceType.replace('_', ' ')}</span>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {!notification.isRead && onMarkRead && notifId && (
                <button
                  onClick={() => onMarkRead(notifId)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Read</span>
                </button>
              )}
              {onDelete && notifId && (
                <button
                  onClick={() => onDelete(notifId)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
