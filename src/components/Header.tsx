import React, { useState } from 'react';
import { 
  Plus, 
  Bell, 
  Search, 
  BookOpen, 
  ClipboardCheck, 
  ChevronDown,
  Sun,
  Moon,
  Home,
  ChevronRight,
  Settings,
  Pencil,
  Languages,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AddAssignmentModal } from './modals/AddAssignmentModal';
import { AddCourseModal } from './modals/AddCourseModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle,
  onSearchChange,
  searchValue = '' 
}) => {
  const { 
    currentStudent, 
    pendingAssignmentsCount, 
    navigateTo, 
    currentPage, 
    theme, 
    toggleTheme,
    language,
    toggleLanguage,
    logout,
    t 
  } = useApp();

  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const getPageBreadcrumb = () => {
    switch (currentPage) {
      case 'home': return t('home');
      case 'courses': return t('courses');
      case 'assignments': return t('assignments');
      case 'calendar': return t('calendar');
      case 'profile': return t('profile');
      default: return currentPage.replace('-', ' ');
    }
  };

  return (
    <>
      <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/90 dark:bg-[#030914]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#0d2244] sticky top-0 z-20 transition-colors">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-[#38bdf8] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-blue-600 dark:text-[#38bdf8]" />
              <span>{t('home')}</span>
            </button>
            {currentPage !== 'home' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                <span className="capitalize text-slate-700 dark:text-slate-200 font-semibold">
                  {getPageBreadcrumb()}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <Pencil className="w-5 h-5 text-blue-600 dark:text-[#38bdf8] stroke-[2.5px]" />
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          {onSearchChange && (
            <div className="relative w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue}
                onChange={e => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-[#071733] border border-slate-200 dark:border-[#113264] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 dark:focus:border-[#0075ff] focus:ring-1 focus:ring-blue-400 transition-all"
              />
            </div>
          )}

          {/* Glowing Quick Add Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_20px_rgba(0,117,255,0.45)] ring-1 ring-blue-400/40 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>{t('quickAdd')}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showQuickMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowQuickMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#06152e] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#113568] py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      setIsAddAssignmentOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-[#0b244d] hover:text-blue-700 dark:hover:text-white flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                  >
                    <ClipboardCheck className="w-4 h-4 text-blue-600 dark:text-[#38bdf8]" />
                    <span>{t('newAssignment')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      setIsAddCourseOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-[#0b244d] hover:text-blue-700 dark:hover:text-white flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>{t('enrollCourse')}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Language Switch Button (TH / EN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#071733] hover:bg-slate-200 dark:hover:bg-[#0b2246] border border-slate-200 dark:border-[#113264] rounded-2xl transition-colors cursor-pointer shadow-2xs"
            title={language === 'th' ? t('switchToEnglish') : t('switchToThai')}
          >
            <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-[#38bdf8]" />
            <span className="font-extrabold">{language === 'th' ? '🇹🇭 ไทย' : '🇬🇧 EN'}</span>
          </button>

          {/* Dark / Light Mode Toggle Pill Switch */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#071733] hover:bg-slate-200 dark:hover:bg-[#0b2246] border border-slate-200 dark:border-[#113264] rounded-2xl transition-colors cursor-pointer shadow-2xs"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-[11px]">{t('darkMode')}</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-[11px]">{t('lightMode')}</span>
              </>
            )}
          </button>

          {/* Quick Notification Bell with Red Badge Dot */}
          <button
            onClick={() => navigateTo('assignments')}
            title={t('notifications')}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#071733] hover:bg-slate-200 dark:hover:bg-[#0b2246] border border-slate-200 dark:border-[#113264] rounded-2xl transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {pendingAssignmentsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#030914]" />
            )}
          </button>

          {/* User Avatar Chip (Circle with initial A) */}
          {currentStudent && (
            <button
              onClick={() => navigateTo('profile')}
              title={currentStudent.name}
              className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#0075ff] to-cyan-400 text-white font-extrabold text-xs flex items-center justify-center shadow-[0_0_15px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 cursor-pointer hover:scale-105 transition-transform"
            >
              {currentStudent.name.charAt(0)}
            </button>
          )}

          {/* Settings Icon */}
          <button
            onClick={() => navigateTo('profile')}
            title={t('profile')}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-[#071733] hover:bg-slate-200 dark:hover:bg-[#0b2246] border border-slate-200 dark:border-[#113264] rounded-2xl transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sign Out Button in Header */}
          <button
            onClick={logout}
            title={language === 'th' ? 'ออกจากระบบ' : 'Sign Out'}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-500 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900/50 rounded-2xl transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{language === 'th' ? 'ออกจากระบบ' : 'Sign Out'}</span>
          </button>
        </div>
      </header>

      {/* Modals */}
      <AddAssignmentModal
        isOpen={isAddAssignmentOpen}
        onClose={() => setIsAddAssignmentOpen(false)}
      />
      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
      />
    </>
  );
};
