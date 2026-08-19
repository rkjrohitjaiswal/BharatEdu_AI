import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, syncNotifications } from '../../services/api';

export const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications({ limit: 5 });
      if (res.success && res.data) {
        setRecentNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSync = async () => {
    setLoading(true);
    try {
      await syncNotifications();
      await loadNotifications();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (err) {}
  };

  const handleNotificationClick = async (n: any) => {
    const notifId = n._id || n.id;
    if (!n.isRead && notifId) {
      await markNotificationRead(notifId);
      await loadNotifications();
    }
    setIsOpen(false);
    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition"
        title="Smart Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full min-w-[18px] text-center shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSync}
                disabled={loading}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                title="Sync Notifications"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No notifications yet.</div>
            ) : (
              recentNotifications.map((n) => (
                <button
                  key={n._id || n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-3 hover:bg-slate-50 transition flex items-start gap-2.5 ${
                    n.isRead ? 'bg-white' : 'bg-emerald-50/40 font-medium'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      n.isRead ? 'bg-transparent' : 'bg-emerald-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-semibold text-slate-900 truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 capitalize">{n.priority}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
