import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Plus, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle,
  Sparkles,
  Award,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  AlertTriangle,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseIcon, getCourseColorClasses } from '../components/CourseIcon';
import { AddCourseModal } from '../components/modals/AddCourseModal';
import { AddAssignmentModal } from '../components/modals/AddAssignmentModal';
import { AssignmentDetailModal } from '../components/modals/AssignmentDetailModal';
import { SubmitAssignmentModal } from '../components/modals/SubmitAssignmentModal';
import { Assignment } from '../types';
import { AppLogo } from '../components/AppLogo';
import { parseDueAt, useLiveTimer, getDeadlineInfo } from '../utils/deadline';

export const HomePage: React.FC = () => {
  const { 
    currentStudent, 
    courses, 
    assignments, 
    totalCoursesCount, 
    pendingAssignmentsCount, 
    completedAssignmentsCount, 
    highPriorityAssignmentsCount,
    navigateTo,
    toggleAssignmentStatus,
    submittingAssignment,
    openSubmitModal,
    closeSubmitModal,
    language,
    t
  } = useApp();

  const now = useLiveTimer();
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Filter urgent / upcoming assignments (due soonest, pending)
  const pendingAssignments = assignments
    .filter(a => a.status === 'pending')
    .sort((a, b) => parseDueAt(a).getTime() - parseDueAt(b).getTime());

  const upcomingUrgent = pendingAssignments.slice(0, 5);

  // Compute completion percentage
  const totalAssignments = assignments.length;
  const completionRate = totalAssignments > 0 
    ? Math.round((completedAssignmentsCount / totalAssignments) * 100) 
    : 100;

  // Format date nicely
  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (language === 'th') {
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        return `${d.getDate()} ${months[d.getMonth()]}`;
      } else {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Welcome Banner - Deep Navy Futuristic Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071d49] via-[#092965] to-[#04132f] border border-blue-500/20 text-white p-6 sm:p-8 shadow-xl shadow-blue-950/40">
        {/* Subtle decorative glow shapes */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-[#0075ff]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-64 h-64 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 backdrop-blur-xs text-xs font-semibold text-[#38bdf8]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>{currentStudent?.semester || 'Academic Term'}</span>
                <span>·</span>
                <span className="font-mono">{currentStudent?.id}</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('welcomeBack')}, <span className="text-[#38bdf8]">{currentStudent?.name || 'Student'}</span>! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              {language === 'th' ? (
                <>คุณมีงานที่ค้างส่งจำนวน <strong className="font-bold text-white underline decoration-cyan-400 underline-offset-4">{pendingAssignmentsCount} รายการ</strong> จัดการตารางเวลาและส่งผลงานให้ตรงตามกำหนด</>
              ) : (
                <>{t('pendingTasksNotice')} <strong className="font-bold text-white underline decoration-cyan-400 underline-offset-4">{pendingAssignmentsCount} {t('pendingItemsCount')}</strong> to complete. Stay organized, submit deliverables, and track deadlines.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddAssignmentOpen(true)}
              className="px-4 py-2.5 bg-[#0075ff] hover:bg-[#0066e0] text-white text-xs font-bold rounded-2xl shadow-[0_0_18px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span>{t('newAssignment')}</span>
            </button>
            <button
              onClick={() => setIsAddCourseOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/15 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-[#38bdf8]" />
              <span>{t('enrollCourse')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Courses */}
        <div 
          onClick={() => navigateTo('courses')} 
          className="p-5 bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] shadow-sm hover:shadow-md hover:border-blue-400/50 dark:hover:border-[#0075ff]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('enrolledCourses')}</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-[#0c244c] text-blue-600 dark:text-[#38bdf8] group-hover:scale-110 transition-transform border border-slate-200 dark:border-[#143c74]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalCoursesCount}
            </span>
            <span className="text-xs text-blue-600 dark:text-[#38bdf8] font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              {t('viewDetails')} &rarr;
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t('activeTerm')}</p>
        </div>

        {/* Pending Assignments */}
        <div 
          onClick={() => navigateTo('assignments')} 
          className="p-5 bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] shadow-sm hover:shadow-md hover:border-blue-400/50 dark:hover:border-[#0075ff]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('pendingTasks')}</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform border border-rose-200 dark:border-rose-900/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {pendingAssignmentsCount}
            </span>
            {highPriorityAssignmentsCount > 0 && (
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                ({highPriorityAssignmentsCount} {t('urgentCount')})
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t('dueForSubmission')}</p>
        </div>

        {/* Completed Assignments */}
        <div 
          onClick={() => navigateTo('assignments')} 
          className="p-5 bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] shadow-sm hover:shadow-md hover:border-blue-400/50 dark:hover:border-[#0075ff]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('submittedWork')}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-200 dark:border-emerald-900/50">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {completedAssignmentsCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              / {totalAssignments}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#081d3f] rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Completion Rate & GPA */}
        <div 
          onClick={() => navigateTo('profile')} 
          className="p-5 bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] shadow-sm hover:shadow-md hover:border-blue-400/50 dark:hover:border-[#0075ff]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {language === 'th' ? 'สถานะและผลการเรียน' : 'Academic Standing'}
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-[#0c244c] text-blue-600 dark:text-[#38bdf8] group-hover:scale-110 transition-transform border border-slate-200 dark:border-[#143c74]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'th' ? 'ความก้าวหน้า' : 'completion'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            GPA: <strong className="text-slate-800 dark:text-white font-bold">{currentStudent?.gpa || '3.85'}</strong>
          </p>
        </div>
      </div>

      {/* Main Grid: Courses + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Enrolled Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-[#38bdf8] font-bold text-base">›</span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {t('enrolledCourses')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'th' ? 'ภาพรวมวิชาที่ลงทะเบียน อาจารย์ผู้สอน และหน่วยกิต' : 'Overview of current semester classes, instructors, and icons'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddCourseOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-[#081d3f] rounded-2xl border border-blue-200 dark:border-[#113264] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('addNewCourse')}</span>
              </button>
              <button
                onClick={() => navigateTo('courses')}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#38bdf8] px-2 py-1.5 transition-colors cursor-pointer"
              >
                {t('viewAll')} &rarr;
              </button>
            </div>
          </div>

          {/* Courses Cards Grid */}
          {courses.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#051329] rounded-3xl border border-dashed border-slate-300 dark:border-[#0e2c5a] space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {language === 'th' ? 'ยังไม่ได้ลงทะเบียนรายวิชา' : 'No courses enrolled yet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {language === 'th' 
                  ? 'เพิ่มรายวิชาแรกเพื่อเริ่มจัดการการบ้าน แผนการเรียน และตารางเรียน' 
                  : 'Add your first course to begin organizing assignments, syllabus topics, and class schedules.'}
              </p>
              <button
                onClick={() => setIsAddCourseOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl cursor-pointer"
              >
                {t('addNewCourse')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map(course => {
                const colorStyles = getCourseColorClasses(course.color);
                const courseAssignments = assignments.filter(a => a.courseId === course.id);
                const completedCount = courseAssignments.filter(a => a.status === 'completed' || a.status === 'submitted').length;
                const totalCount = courseAssignments.length;
                const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <div
                    key={course.id}
                    onClick={() => navigateTo('course-detail', course.id)}
                    className="bg-white dark:bg-[#051329] rounded-3xl p-5 border border-slate-200/80 dark:border-[#0e2c5a] shadow-sm hover:shadow-md hover:border-blue-400/60 dark:hover:border-[#0075ff]/60 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar: Icon + Code + Credits */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-2xl ${colorStyles.bg} flex items-center justify-center border shadow-2xs`}>
                          <CourseIcon icon={course.icon} className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#081d3f] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#113264]">
                            {course.code}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">
                            {course.credits} {t('credits')}
                          </span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#38bdf8] transition-colors line-clamp-1">
                        {course.name}
                      </h3>

                      {/* Instructor */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {course.teacher}
                      </p>

                      {/* Schedule info */}
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 font-mono">
                        {course.schedule}
                      </p>
                    </div>

                    {/* Progress Bar & Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#0d274f]">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-500 dark:text-slate-400">
                          {language === 'th' ? 'ส่งแล้ว' : 'Submitted'}: <strong className="text-slate-800 dark:text-slate-200">{completedCount}/{totalCount}</strong>
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {progressPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#081d3f] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Upcoming Deadlines & Urgency */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-[#38bdf8] font-bold text-base">›</span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {t('upcomingDeadlines')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'th' ? 'งานที่ต้องส่งเร็วๆ นี้' : 'Nearest pending deliverables'}
              </p>
            </div>
            <button
              onClick={() => navigateTo('calendar')}
              className="text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:underline transition-colors cursor-pointer"
            >
              {t('calendar')} &rarr;
            </button>
          </div>

          <div className="bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] p-4 shadow-sm space-y-3 transition-colors">
            {upcomingUrgent.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t('noPendingTasks')}
                </p>
                <p className="text-[11px] text-slate-400">
                  {language === 'th' ? 'ไม่มีงานค้างส่งในขณะนี้ รักษามาตรฐานที่ดีต่อไป!' : 'No upcoming pending deadlines right now. Great job!'}
                </p>
              </div>
            ) : (
              upcomingUrgent.map(task => {
                const deadlineInfo = getDeadlineInfo(task, now, language);
                let urgencyBorder = 'border-slate-200 dark:border-[#0e2c5a]';
                let urgencyBg = 'bg-slate-50 dark:bg-[#071936]';

                if (deadlineInfo.isOverdue) {
                  urgencyBorder = 'border-rose-500/80 ring-1 ring-rose-500/40';
                  urgencyBg = 'bg-rose-50/60 dark:bg-rose-950/25';
                } else if (deadlineInfo.isUrgent24h) {
                  urgencyBorder = 'border-amber-400 ring-1 ring-amber-400/40';
                  urgencyBg = 'bg-amber-50/60 dark:bg-amber-950/25';
                }

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 ${urgencyBorder} ${urgencyBg}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAssignmentStatus(task.id);
                          }}
                          title={language === 'th' ? 'คลิกเพื่อเปลี่ยนเป็นส่งแล้ว' : 'Mark as submitted'}
                          className={`mt-0.5 transition-colors shrink-0 cursor-pointer ${
                            deadlineInfo.isOverdue 
                              ? 'text-rose-500 hover:text-emerald-500' 
                              : deadlineInfo.isUrgent24h 
                              ? 'text-amber-500 hover:text-emerald-500' 
                              : 'text-slate-400 hover:text-emerald-500'
                          }`}
                        >
                          <Circle className="w-4 h-4" />
                        </button>
                        <div 
                          onClick={() => setSelectedAssignment(task)}
                          className="cursor-pointer min-w-0 flex-1"
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-[#38bdf8]">
                              {task.courseCode}
                            </span>
                            {deadlineInfo.isOverdue ? (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500 text-white animate-pulse">
                                {language === 'th' ? 'เลยกำหนด' : 'OVERDUE'}
                              </span>
                            ) : deadlineInfo.isUrgent24h ? (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                {language === 'th' ? '< 24 ชม.' : '< 24h'}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#38bdf8] transition-colors truncate mt-0.5">
                            {task.title}
                          </p>
                        </div>
                      </div>

                      {/* Due Date & Countdown */}
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                          deadlineInfo.isOverdue
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-300'
                            : deadlineInfo.isUrgent24h
                            ? 'bg-amber-400/20 border-amber-400/40 text-amber-700 dark:text-amber-300'
                            : 'bg-white dark:bg-[#040d1e] border-slate-200 dark:border-[#0e2c5a] text-slate-700 dark:text-slate-300'
                        }`}>
                          <Clock className={`w-2.5 h-2.5 ${deadlineInfo.isOverdue ? 'text-rose-500' : deadlineInfo.isUrgent24h ? 'text-amber-500' : 'text-blue-500'}`} />
                          {deadlineInfo.formattedCountdown}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: "ส่งแล้ว" Action Button */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-[#0d274f]/60 text-xs">
                      <span className="text-[10px] text-slate-400">
                        {formatDateDisplay(task.dueDate)} · {task.points} {t('points')}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAssignmentStatus(task.id)}
                          className="px-2.5 py-1 text-[11px] font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                          title={language === 'th' ? 'ทำเครื่องหมายว่าส่งแล้ว' : 'Mark as submitted'}
                        >
                          <Check className="w-3 h-3 stroke-[3px]" />
                          <span>{language === 'th' ? 'ส่งแล้ว' : 'Submitted'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openSubmitModal(task)}
                          className="text-[11px] font-bold text-blue-600 dark:text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>{t('submitAssignment')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-[#0d274f]">
              <button
                onClick={() => navigateTo('calendar')}
                className="w-full py-2.5 px-3 text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-[#071936] rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-blue-200/50 dark:border-[#113264]"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{t('calendarTitle')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
      />
      <AddAssignmentModal
        isOpen={isAddAssignmentOpen}
        onClose={() => setIsAddAssignmentOpen(false)}
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
