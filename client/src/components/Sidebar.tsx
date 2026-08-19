import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  BrainCircuit,
  Compass,
  LineChart,
  AlertTriangle,
  History,
  Award,
  Users,
  GraduationCap,
  BarChart3,
  Home,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  Key,
  Target,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavGroupItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const studentNav: NavGroupItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Learning Coach', path: '/learning-coach', icon: Bot, badge: 'Coach' },
    { name: 'Learning Goals', path: '/goals', icon: Target, badge: 'New' },
    { name: 'Achievements', path: '/achievements', icon: Award, badge: 'Badges' },
    { name: 'AI Tutor', path: '/tutor', icon: Bot, badge: 'AI' },
    { name: 'Adaptive Practice', path: '/practice', icon: BrainCircuit },
    { name: 'Teacher Tasks', path: '/interventions', icon: Sparkles },
    { name: 'Practice History', path: '/practice-history', icon: History },
    { name: 'Mistake Review', path: '/mistakes', icon: AlertTriangle },
    { name: 'Learning Path', path: '/learning-path', icon: Compass },
    { name: 'Progress Tracker', path: '/progress', icon: LineChart },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
    { name: 'Saved Scholarships', path: '/scholarships/saved', icon: Award },
    { name: 'Parent Link', path: '/parent-link', icon: Users, badge: 'Access' },
  ];

  const teacherNav: NavGroupItem[] = [
    { name: 'Teacher Dashboard', path: '/teacher', icon: GraduationCap },
    { name: 'Remediation Portal', path: '/teacher/interventions', icon: Sparkles },
    { name: 'Students Roster', path: '/teacher/students', icon: Users },
    { name: 'Class Analytics', path: '/teacher/analytics', icon: BarChart3 },
  ];

  const parentNav: NavGroupItem[] = [
    { name: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
    { name: 'My Students', path: '/parent/dashboard', icon: Users },
    { name: 'Progress Overview', path: '/parent/dashboard', icon: LineChart },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
    { name: 'Link Student', path: '/parent-link', icon: Key },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* General Section */}
          <div>
            <NavLink to="/" onClick={() => setMobileOpen(false)} className={linkClass}>
              <Home className="w-4 h-4 shrink-0" />
              <span>Home Landing</span>
            </NavLink>
          </div>

          {/* Unauthenticated Quick Links */}
          {!user && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Authentication
              </p>
              <nav className="space-y-1">
                <NavLink to="/login" onClick={() => setMobileOpen(false)} className={linkClass}>
                  <LogIn className="w-4 h-4 shrink-0" />
                  <span>Sign In</span>
                </NavLink>
                <NavLink to="/register" onClick={() => setMobileOpen(false)} className={linkClass}>
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span>Create Account</span>
                </NavLink>
              </nav>
            </div>
          )}

          {/* Student Navigation (If student or for preview) */}
          {user && user.role === 'student' && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Student Hub
              </p>
              <nav className="space-y-1">
                {studentNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Teacher Navigation */}
          {user && user.role === 'teacher' && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Teacher Portal
              </p>
              <nav className="space-y-1">
                {teacherNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Parent Navigation */}
          {user && user.role === 'parent' && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Parent Portal
              </p>
              <nav className="space-y-1">
                {parentNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Footer info & Logout inside sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">OOSC 4.0 Hackathon</span>
            </div>
            <p className="text-[10px] text-emerald-700 leading-tight">
              AI for Equitable Education Access
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
