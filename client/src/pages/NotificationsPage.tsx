import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, RefreshCw, Sparkles } from 'lucide-react';
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  syncNotifications,
} from '../services/api';
import { NotificationFilters } from '../components/notifications/NotificationFilters';
import { NotificationList } from '../components/notifications/NotificationList';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadNotifications = async (filterKey: string = activeFilter) => {
    setLoading(true);
    setError('');
    try {
      let filterOpts: any = { limit: 100 };
      if (filterKey === 'unread') {
        filterOpts.isRead = false;
      } else if (filterKey === 'urgent') {
        filterOpts.priority = 'high';
      } else if (filterKey !== 'all') {
        filterOpts.sourceType = filterKey;
      }

      const res = await fetchNotifications(filterOpts);
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      } else {
        setError(res.message || 'Failed to load notifications');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(activeFilter);
  }, [activeFilter]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncNotifications();
      await loadNotifications(activeFilter);
    } catch (err: any) {
      setError(err?.message || 'Failed to sync notifications');
    } finally {
      setSyncing(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => ((n._id || n.id) === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => (n._id || n.id) !== id));
    } catch (err) {}
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Notifications & Alerts</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic alerts from Study Plan, Scholarships, Exams, Goals, and Coach.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync Alerts</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Filters */}
      <NotificationFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        unreadCount={unreadCount}
        totalCount={notifications.length}
      />

      {/* Notification List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading your notifications...</div>
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
export default NotificationsPage;
