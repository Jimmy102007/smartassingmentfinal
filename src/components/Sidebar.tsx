import React from 'react';
import { 
  Home, 
  BookOpen, 
  ClipboardCheck, 
  Calendar as CalendarIcon, 
  User, 
  LogOut, 
  ChevronRight,
  Moon,
  Sun,
  Award,
  Laptop,
  Users,
  Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationPage } from '../types';
import { DEMO_STUDENTS } from '../data/seedData';
import { AppLogo } from './AppLogo';

export const Sidebar: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    currentStudent, 
    logout, 
    pendingAssignmentsCount,
    registeredAccounts,
    quickSwitchAccount,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t,
    isAddAssignmentModalOpen
  } = useApp();

  const navItems: { page: NavigationPage; label: string; icon: React.ElementType; badge?: number }[] = [
    { page: 'home', label: t('home'), icon: Home },
    { page: 'courses', label: t('courses'), icon: BookOpen },
    { page: 'assignments', label: t('assignments'), icon: ClipboardCheck, badge: pendingAssignmentsCount },
    { page: 'calendar', label: t('calendar'), icon: CalendarIcon },
    { page: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col w-[280px] bg-white dark:bg-[#040d1e] border-r border-slate-200/80 dark:border-[#0d2347] shrink-0 h-screen sticky top-0 z-30 select-none ${
        isAddAssignmentModalOpen ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        transform: isAddAssignmentModalOpen ? 'translateX(-240px)' : 'translateX(0)',
        opacity: isAddAssignmentModalOpen ? 0.45 : 1,
        transition: 'transform 300ms ease, opacity 300ms ease',
      }}
    >
      {/* Brand Header */}
      <div className="p-5 pb-4">
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <AppLogo size="md" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white">
              Smart <span className="text-blue-600 dark:text-[#38bdf8]">Assignment</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-tight">
              {t('kkuSubtext')}
            </p>
          </div>
        </div>
      </div>

      {/* Student Profile Quick Strip */}
      {currentStudent && (
        <div className="px-4 py-2">
          <div 
            onClick={() => navigateTo('profile')}
            className="p-3.5 bg-slate-50 dark:bg-[#071733]/90 hover:bg-slate-100 dark:hover:bg-[#0a2046] border border-slate-200/80 dark:border-[#113264] rounded-2xl cursor-pointer transition-all shadow-sm dark:shadow-lg dark:shadow-black/40 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-[#0075ff] to-cyan-400 flex items-center justify-center text-white font-extrabold text-lg shadow-[0_0_15px_rgba(0,117,255,0.4)] shrink-0">
                {currentStudent.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentStudent.name}
                  </p>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wide">
                  {currentStudent.id}
                </p>
              </div>
            </div>

            {/* Sub-Badges */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-[#0e2c59] grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#0b2146] text-slate-700 dark:text-slate-300 font-medium">
                <Award className="w-3.5 h-3.5 text-blue-600 dark:text-[#38bdf8] shrink-0" />
                <span className="truncate">GPA <strong className="text-slate-900 dark:text-white">{currentStudent.gpa}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#0b2146] text-slate-700 dark:text-slate-300 font-medium">
                <Laptop className="w-3.5 h-3.5 text-blue-600 dark:text-[#38bdf8] shrink-0" />
                <span className="truncate">{currentStudent.major.split('&')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-1.5 text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          {t('navigation')}
        </p>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.page || (item.page === 'courses' && currentPage === 'course-detail');

          return (
            <button
              key={item.page}
              onClick={() => navigateTo(item.page)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#0075ff] text-white shadow-[0_0_22px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#091b38]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className="text-xs font-bold w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs"
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Language Switcher Row */}
        <div className="p-3 bg-slate-50 dark:bg-[#071733] border border-slate-200 dark:border-[#113264] rounded-2xl flex items-center justify-between mt-2">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Languages className="w-4 h-4 text-blue-600 dark:text-[#38bdf8]" />
            <span>{t('language')}</span>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-[#040d1e] p-1 rounded-xl border border-slate-200 dark:border-[#0d2347]">
            <button
              onClick={() => setLanguage('th')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                language === 'th'
                  ? 'bg-[#0075ff] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇹🇭 ไทย
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0075ff] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* Dark Theme toggle row in navigation */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#091b38] transition-colors cursor-pointer mt-1"
          title="Click to toggle theme"
        >
          <div className="flex items-center gap-3.5">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-blue-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <span>{theme === 'dark' ? t('darkMode') : t('lightMode')}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
            theme === 'dark' 
              ? 'bg-blue-500/20 text-[#38bdf8] border border-blue-500/30' 
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {theme === 'dark' ? t('active') : 'Light'}
          </span>
        </button>

        {/* Sign Out Action Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-colors cursor-pointer mt-1"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('signOut')}</span>
        </button>

        {/* Quick Account Switcher Strip */}
        <div className="pt-3 mt-2 border-t border-slate-200/80 dark:border-[#0d2347]">
          <div className="px-3 pb-1.5 flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5">
              <Users className="w-3 h-3 text-blue-600 dark:text-[#38bdf8]" />
              {t('switchStudent')}
            </p>
            <button
              onClick={logout}
              className="text-[10px] font-bold text-blue-600 dark:text-[#38bdf8] hover:underline cursor-pointer"
            >
              + {language === 'th' ? 'สลับบัญชี' : 'Switch'}
            </button>
          </div>
          <div className="space-y-1">
            {registeredAccounts.slice(0, 4).map(acc => {
              const isSelected = currentStudent?.id === acc.student.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => quickSwitchAccount(acc.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-[#0075ff]/20 text-blue-700 dark:text-[#38bdf8] font-bold border border-blue-200 dark:border-[#0075ff]/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#071836]'
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate font-medium">{acc.student.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{acc.id}</p>
                  </div>
                  {isSelected ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#38bdf8] shrink-0 ml-2" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Footer Watermark (KKU Style) */}
      <div className="p-4 pt-3 border-t border-slate-200/80 dark:border-[#0d2347] bg-slate-50 dark:bg-[#030915] relative overflow-hidden transition-colors">
        {/* Silhouette graphic */}
        <div className="absolute right-2 -bottom-2 opacity-15 pointer-events-none text-blue-600 dark:text-blue-300">
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 65,40 50,35 35,40" />
            <polygon points="50,30 75,70 50,65 25,70" />
            <polygon points="50,60 85,95 50,90 15,95" />
            <rect x="44" y="85" width="12" height="15" />
          </svg>
        </div>

        <div className="relative z-10">
          <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider">
            KKU
          </h3>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Khon Kaen University
          </p>
          <p className="text-[10px] text-blue-600 dark:text-blue-400/80 font-mono mt-0.5 font-medium">
            {t('kkuMotto')}
          </p>
        </div>
      </div>
    </aside>
  );
};
