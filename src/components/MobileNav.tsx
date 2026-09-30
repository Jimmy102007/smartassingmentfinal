import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  User, 
  LogOut, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationPage } from '../types';
import { AppLogo } from './AppLogo';

export const MobileNav: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    currentStudent, 
    pendingAssignmentsCount,
    logout,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t
  } = useApp();

  const navItems: { page: NavigationPage; label: string; icon: React.ElementType; badge?: number }[] = [
    { page: 'home', label: t('home'), icon: LayoutDashboard },
    { page: 'courses', label: t('courses'), icon: BookOpen },
    { page: 'assignments', label: t('assignments'), icon: CheckSquare, badge: pendingAssignmentsCount },
    { page: 'calendar', label: t('calendar'), icon: CalendarIcon },
    { page: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-[#040d1e]/95 backdrop-blur-md border-b border-[#0d2347] px-4 py-3 flex items-center justify-between transition-colors">
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <AppLogo size="sm" />
          <div>
            <h1 className="text-sm font-black text-white leading-none">
              Smart <span className="text-[#38bdf8]">Assignment</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
              {currentStudent?.id || 'Student Portal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1.5 text-[11px] font-extrabold text-[#38bdf8] bg-[#081d3f] border border-[#113264] rounded-xl transition-colors cursor-pointer"
            title="Toggle Language"
          >
            {language === 'th' ? '🇹🇭 ไทย' : '🇬🇧 EN'}
          </button>

          {/* Theme Toggle Button for Mobile */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-[#081d3f] border border-[#113264] transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#38bdf8]" />
            )}
          </button>

          {currentStudent && (
            <button
              onClick={() => navigateTo('profile')}
              className="flex items-center gap-1 px-2 py-1 bg-[#0075ff]/20 hover:bg-[#0075ff]/30 rounded-xl text-[#38bdf8] text-xs font-bold border border-[#0075ff]/40"
            >
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-[10px] flex items-center justify-center font-bold">
                {currentStudent.name.charAt(0)}
              </div>
              <span className="max-w-[55px] truncate">{currentStudent.name.split(' ')[0]}</span>
            </button>
          )}

          <button
            onClick={logout}
            title={t('signOut')}
            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-xl bg-[#081d3f] border border-[#113264] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#040d1e]/95 backdrop-blur-md border-t border-[#0d2347] px-2 py-1.5 shadow-2xl flex items-center justify-around transition-colors">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.page || (item.page === 'courses' && currentPage === 'course-detail');

          return (
            <button
              key={item.page}
              onClick={() => navigateTo(item.page)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[56px] transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#38bdf8] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-[#38bdf8]' : 'stroke-[1.75px]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#040d1e]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-[#0075ff] shadow-[0_0_8px_#0075ff] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

