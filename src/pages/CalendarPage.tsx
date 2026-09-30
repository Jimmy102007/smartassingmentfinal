import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ListTodo,
  LayoutGrid,
  UploadCloud,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AddAssignmentModal } from '../components/modals/AddAssignmentModal';
import { AssignmentDetailModal } from '../components/modals/AssignmentDetailModal';
import { SubmitAssignmentModal } from '../components/modals/SubmitAssignmentModal';
import { Assignment } from '../types';
import { parseDueAt } from '../utils/deadline';

export const CalendarPage: React.FC = () => {
  const { 
    assignments, 
    toggleAssignmentStatus, 
    submittingAssignment, 
    openSubmitModal, 
    closeSubmitModal,
    language,
    t
  } = useApp();

  const [viewMode, setViewMode] = useState<'schedule' | 'matrix'>('schedule');

  // Calendar matrix date state
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const assignmentsByDate: { [dateStr: string]: Assignment[] } = {};
  assignments.forEach(a => {
    if (!assignmentsByDate[a.dueDate]) {
      assignmentsByDate[a.dueDate] = [];
    }
    assignmentsByDate[a.dueDate].push(a);
  });

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const monthName = language === 'th'
    ? `${thaiMonths[month]} ${year + 543}`
    : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const selectedDayAssignments = assignmentsByDate[selectedDateStr] || [];

  // Scannable Chronological Deadlines
  const sortedDeadlines = [...assignments].sort((a, b) => {
    return parseDueAt(a).getTime() - parseDueAt(b).getTime();
  });

  // Calculate relative due text
  const getRelativeDueInfo = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = dueDateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        text: language === 'th' ? `เลยกำหนด ${Math.abs(diffDays)} วัน` : `${Math.abs(diffDays)}d overdue`, 
        isOverdue: true, 
        isUrgent: true 
      };
    }
    if (diffDays === 0) {
      return { 
        text: language === 'th' ? 'ส่งภายในวันนี้' : 'Due Today', 
        isToday: true, 
        isUrgent: true 
      };
    }
    if (diffDays === 1) {
      return { 
        text: language === 'th' ? 'ส่งพรุ่งนี้' : 'Due Tomorrow', 
        isUrgent: true 
      };
    }
    return { 
      text: language === 'th' ? `อีก ${diffDays} วัน` : `In ${diffDays} days` 
    };
  };

  const formatShortMonth = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (language === 'th') {
      const shortM = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return shortM[d.getMonth()];
    }
    return d.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 dark:text-[#38bdf8] font-bold text-lg">›</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('calendarTitle')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('calendarSubtitle')}
          </p>
        </div>

        {/* View switcher & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#071936] border border-slate-200 dark:border-[#113264] rounded-2xl shadow-xs">
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'schedule'
                  ? 'bg-[#0075ff] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>{t('deadlineTimeline')}</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#0075ff] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('monthlyCalendar')}</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_18px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>{t('newAssignment')}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Easy-to-Scan Assignment Deadline Timeline */}
      {viewMode === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#0d274f]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('chronologicalDeadlines')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {assignments.length} {language === 'th' ? 'รายการงานทั้งหมดในภาคเรียนนี้' : 'total tasks scheduled across your courses'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  {t('pending')}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 ml-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  {t('submitted')}
                </span>
              </div>
            </div>

            {/* Scannable Deadlines List */}
            {sortedDeadlines.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {language === 'th' ? 'ยังไม่มีกำหนดส่งงานในระบบ' : 'No deadlines scheduled yet'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {language === 'th' ? 'เพิ่มการบ้านใหม่เพื่อเริ่มติดตามกำหนดส่งและวางแผนการส่งงาน' : 'Add assignments to start tracking upcoming deadlines.'}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl cursor-pointer"
                >
                  + {t('newAssignment')}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#0d274f] mt-2">
                {sortedDeadlines.map(task => {
                const isSubmitted = task.status === 'submitted' || task.status === 'completed';
                const dueInfo = getRelativeDueInfo(task.dueDate);

                return (
                  <div
                    key={task.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-[#081f44]/50 px-3 rounded-2xl transition-colors"
                  >
                    {/* Left: Date pill + Task Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      {/* Due Date Indicator Badge */}
                      <div className="w-24 shrink-0 text-center p-2 rounded-2xl bg-slate-100 dark:bg-[#081d3f] border border-slate-200 dark:border-[#113264]">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {formatShortMonth(task.dueDate)}
                        </span>
                        <span className="block text-base font-black text-slate-900 dark:text-white leading-tight">
                          {new Date(task.dueDate + 'T00:00:00').getDate()}
                        </span>
                        <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          {task.dueTime}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-[#38bdf8]">
                            {task.courseCode}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                            {task.courseName}
                          </span>
                        </div>

                        <h3 
                          onClick={() => setSelectedAssignment(task)}
                          className={`text-sm font-bold cursor-pointer transition-colors ${
                            isSubmitted
                              ? 'text-slate-400 dark:text-slate-500 line-through'
                              : 'text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-[#38bdf8]'
                          }`}
                        >
                          {task.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                            dueInfo.isOverdue && !isSubmitted
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                              : dueInfo.isToday && !isSubmitted
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-[#081d3f] text-slate-600 dark:text-slate-400'
                          }`}>
                            {dueInfo.text}
                          </span>
                          <span>·</span>
                          <span>{task.points} {t('points')}</span>
                          {task.fileName && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[150px]">
                                📄 {task.fileName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 ${
                        isSubmitted
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800'
                      }`}>
                        {isSubmitted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t('submitted')}
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            {t('pending')}
                          </>
                        )}
                      </span>

                      {!isSubmitted ? (
                        <button
                          onClick={() => openSubmitModal(task)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{t('submitAssignment')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedAssignment(task)}
                          className="px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-[#081d3f] rounded-2xl border border-blue-200 dark:border-[#113264] transition-colors cursor-pointer"
                        >
                          {t('viewAssignment')}
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedAssignment(task)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-[#081d3f] cursor-pointer"
                        title={t('assignmentDetails')}
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Monthly Calendar Grid + Day Inspector */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Monthly Calendar Grid */}
          <div className="lg:col-span-2 bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] p-5 sm:p-6 shadow-sm transition-colors">
            {/* Controls */}
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100 dark:border-[#0d274f]">
              <span className="text-base font-black text-slate-900 dark:text-white">
                {monthName}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#081d3f] hover:bg-slate-200 dark:hover:bg-[#0d2a5a] rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-[#113264]"
                >
                  {t('today')}
                </button>
                <div className="flex items-center bg-slate-100 dark:bg-[#081d3f] rounded-xl p-0.5 border border-slate-200 dark:border-[#113264]">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{language === 'th' ? 'อา.' : 'Sun'}</span>
              <span>{language === 'th' ? 'จ.' : 'Mon'}</span>
              <span>{language === 'th' ? 'อ.' : 'Tue'}</span>
              <span>{language === 'th' ? 'พ.' : 'Wed'}</span>
              <span>{language === 'th' ? 'พฤ.' : 'Thu'}</span>
              <span>{language === 'th' ? 'ศ.' : 'Fri'}</span>
              <span>{language === 'th' ? 'ส.' : 'Sat'}</span>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
              {days.map((dayNum, index) => {
                if (dayNum === null) {
                  return (
                    <div 
                      key={`blank-${index}`} 
                      className="min-h-[85px] sm:min-h-[105px] rounded-2xl bg-slate-50/40 dark:bg-[#071733]/40 p-1.5 opacity-30" 
                    />
                  );
                }

                const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayTasks = assignmentsByDate[dayStr] || [];
                const isSelected = selectedDateStr === dayStr;
                const isToday = new Date().toISOString().split('T')[0] === dayStr;

                const hasPending = dayTasks.some(t => t.status === 'pending');
                const hasHighPriority = dayTasks.some(t => t.priority === 'high' && t.status === 'pending');

                return (
                  <div
                    key={dayStr}
                    onClick={() => setSelectedDateStr(dayStr)}
                    className={`min-h-[85px] sm:min-h-[105px] rounded-2xl p-2 border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'border-[#0075ff] bg-blue-50/50 dark:bg-[#0075ff]/20 ring-2 ring-blue-400/40'
                        : isToday
                        ? 'border-blue-300 dark:border-blue-700 bg-blue-50/20 dark:bg-blue-950/30'
                        : 'border-slate-100 dark:border-[#0e2c5a] hover:border-slate-300 dark:hover:border-[#143c74] bg-white dark:bg-[#071936]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-[#0075ff] text-white shadow-xs'
                            : isSelected
                            ? 'text-blue-600 dark:text-[#38bdf8] font-black'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {dayTasks.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              hasHighPriority
                                ? 'bg-rose-500 animate-pulse'
                                : hasPending
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            title={`${dayTasks.length} task(s)`}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayTasks.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          className={`text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate ${
                            task.status === 'submitted' || task.status === 'completed'
                              ? 'bg-slate-100 dark:bg-[#040e1e] text-slate-400 line-through'
                              : task.priority === 'high'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold'
                              : 'bg-blue-100 dark:bg-[#0075ff]/30 text-blue-800 dark:text-[#38bdf8]'
                          }`}
                          title={task.title}
                        >
                          {task.courseCode}: {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-semibold block px-1">
                          +{dayTasks.length - 2} {language === 'th' ? 'รายการ' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Day Detail Inspector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-[#38bdf8]" />
                  {t('dayInspector')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedDateStr}
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 text-blue-600 dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-[#081d3f] rounded-2xl border border-blue-200 dark:border-[#113264] transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Add task on this date"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addTask')}</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] p-5 shadow-sm space-y-3 transition-colors">
              {selectedDayAssignments.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <CalendarIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {language === 'th' ? 'ไม่มีกำหนดส่งงานในวันนี้' : 'No deadlines on this day'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {language === 'th' ? `คุณไม่มีการบ้านที่ต้องส่งในวันที่ ${selectedDateStr}` : `You have no assignment submissions scheduled for ${selectedDateStr}.`}
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-xs transition-colors cursor-pointer"
                  >
                    {t('scheduleAssignment')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayAssignments.map(task => {
                    const isSubmitted = task.status === 'submitted' || task.status === 'completed';

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isSubmitted
                            ? 'bg-slate-50/60 dark:bg-[#040e1e] border-slate-200 dark:border-[#0d274f]'
                            : 'bg-white dark:bg-[#071936] border-blue-100 dark:border-[#113264] shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleAssignmentStatus(task.id)}
                            className={`mt-0.5 shrink-0 cursor-pointer ${
                              isSubmitted ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500'
                            }`}
                          >
                            {isSubmitted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <div 
                            onClick={() => setSelectedAssignment(task)}
                            className="flex-1 cursor-pointer min-w-0"
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-[#38bdf8] mb-0.5">
                              <span>{task.courseCode}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                                <Clock className="w-2.5 h-2.5" />
                                {task.dueTime}
                              </span>
                            </div>
                            <h4 className={`text-xs font-bold ${
                              isSubmitted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                            }`}>
                              {task.title}
                            </h4>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#0d274f] flex items-center justify-between text-[11px]">
                          {!isSubmitted ? (
                            <button
                              onClick={() => openSubmitModal(task)}
                              className="text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <UploadCloud className="w-3 h-3" />
                              {t('submitFile')}
                            </button>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓ {t('submitted')}
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedAssignment(task)}
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium cursor-pointer"
                          >
                            {t('viewDetails')} &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddAssignmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultDate={selectedDateStr}
      />
      <AssignmentDetailModal
        assignment={selectedAssignment}
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
      />
      <SubmitAssignmentModal
        assignment={submittingAssignment}
        isOpen={!!submittingAssignment}
        onClose={closeSubmitModal}
      />
    </div>
  );
};
