import React from 'react';
import { BellOff } from 'lucide-react';
import { NotificationCard } from './NotificationCard';

export interface NotificationListProps {
  notifications: any[];
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkRead,
  onDelete,
}) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-slate-50/50">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <BellOff className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-800 text-base">No Notifications</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          You are all caught up! System notifications and updates will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <NotificationCard
          key={n._id || n.id}
          notification={n}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
