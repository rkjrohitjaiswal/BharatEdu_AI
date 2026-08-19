import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Search, Server, LogOut, User as UserIcon } from 'lucide-react';
import { fetchHealthCheck } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from './Badge';
import { Button } from './Button';
import { NotificationBell } from './notifications/NotificationBell';

interface HeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [apiStatus, setApiStatus] = useState<{ online: boolean; message: string }>({
    online: false,
    message: 'Checking API...',
  });

  useEffect(() => {
    fetchHealthCheck().then((res) => {
      setApiStatus({
        online: res.success,
        message: res.success ? 'API Online' : 'API Offline',
      });
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 h-16 flex items-center px-4 lg:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Mobile Toggle + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg">BharatEdu</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block -mt-0.5">Equitable Education Access</p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics, practice questions, scholarships..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-800 placeholder-slate-400 transition-all"
              readOnly
            />
          </div>
        </div>

        {/* Right Side: Status Indicator + Auth Info */}
        <div className="flex items-center gap-3">
          {/* API Health Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs border border-slate-200">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-medium text-slate-700">{apiStatus.message}</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3 pl-2">
              <NotificationBell />

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Authenticated User Badge */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {getInitials(user.name)}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
                className="text-slate-600 hover:text-red-600"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" icon={<UserIcon className="w-4 h-4" />}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
