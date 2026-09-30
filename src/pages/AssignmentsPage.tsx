import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  ArrowUpDown, 
  AlertTriangle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AddAssignmentModal } from '../components/modals/AddAssignmentModal';
import { AssignmentDetailModal } from '../components/modals/AssignmentDetailModal';
import { SubmitAssignmentModal } from '../components/modals/SubmitAssignmentModal';
import { AssignmentCard } from '../components/AssignmentCard';
import { Assignment } from '../types';
import { parseDueAt, useLiveTimer } from '../utils/deadline';

export const AssignmentsPage: React.FC = () => {
  const { 
    assignments, 
    courses, 
    pendingAssignmentsCount, 
    completedAssignmentsCount,
    submittingAssignment,
    closeSubmitModal,
    language,
    t
  } = useApp();

  const now = useLiveTimer();
  const isThai = language === 'th';

  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted' | 'urgent' | 'overdue'>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDateAsc' | 'dueDateDesc' | 'priority' | 'points'>('dueDateAsc');

  // Counts for overdue and < 24h
  const overdueCount = assignments.filter(a => {
    if (a.status === 'submitted' || a.status === 'completed') return false;
    const diff = parseDueAt(a).getTime() - now;
    return diff < 0;
  }).length;

  const urgent24hCount = assignments.filter(a => {
    if (a.status === 'submitted' || a.status === 'completed') return false;
    const diff = parseDueAt(a).getTime() - now;
    return diff >= 0 && diff <= 24 * 60 * 60 * 1000;
  }).length;

  // Filter logic
  const filteredAssignments = assignments.filter(item => {
    // 1. Search query
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      item.title.toLowerCase().includes(q) ||
      (item.courseName && item.courseName.toLowerCase().includes(q)) ||
      (item.courseCode && item.courseCode.toLowerCase().includes(q)) ||
      (item.course && item.course.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));

    if (!matchSearch) return false;

    // 2. Status filter
    const isSubmitted = item.status === 'submitted' || item.status === 'completed';
    const diff = parseDueAt(item).getTime() - now;
    const isOverdue = diff < 0 && !isSubmitted;
    const isUrgent24h = diff >= 0 && diff <= 24 * 60 * 60 * 1000 && !isSubmitted;

    if (statusFilter === 'pending' && isSubmitted) return false;
    if (statusFilter === 'submitted' && !isSubmitted) return false;
    if (statusFilter === 'urgent' && !isUrgent24h) return false;
    if (statusFilter === 'overdue' && !isOverdue) return false;

    // 3. Course filter
    if (selectedCourseFilter !== 'all' && item.courseId !== selectedCourseFilter) return false;

    return true;
  });

  // Sort logic (defaults to dueDateAsc - strictly chronological deadline)
  filteredAssignments.sort((a, b) => {
    if (sortBy === 'dueDateAsc') {
      return parseDueAt(a).getTime() - parseDueAt(b).getTime();
    }
    if (sortBy === 'dueDateDesc') {
      return parseDueAt(b).getTime() - parseDueAt(a).getTime();
    }
    if (sortBy === 'points') {
      return (b.points || 0) - (a.points || 0);
    }
    if (sortBy === 'priority') {
      const pWeights = { high: 3, medium: 2, low: 1 };
      return pWeights[b.priority] - pWeights[a.priority];
    }
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 dark:text-[#38bdf8] font-bold text-lg">›</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('assignmentsTitle')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isThai 
              ? 'ระบบติดตามการบ้าน กำหนดส่งงาน นับถอยหลัง และไฮไลต์สถานะด่วน'
              : 'Track deadlines, live countdown, and submit academic tasks'}
          </p>
        </div>

        <button
          onClick={() => setIsAddAssignmentOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_18px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>{t('newAssignment')}</span>
        </button>
      </div>

      {/* Urgency Highlight Alert Bar (Yellow & Red Notice) */}
      {(overdueCount > 0 || urgent24hCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {overdueCount > 0 && (
            <div 
              onClick={() => setStatusFilter('overdue')}
              className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-between cursor-pointer hover:bg-rose-500/20 transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)]"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                <span>
                  {isThai ? `มีงานเลยกำหนดส่งแล้ว ${overdueCount} รายการ (ไฮไลต์สีแดง)` : `${overdueCount} overdue assignments (highlighted red)`}
                </span>
              </div>
              <span className="text-[11px] underline shrink-0">{isThai ? 'ดูเฉพาะที่เลยกำหนด' : 'View overdue'} &rarr;</span>
            </div>
          )}

          {urgent24hCount > 0 && (
            <div 
              onClick={() => setStatusFilter('urgent')}
              className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-400/50 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-between cursor-pointer hover:bg-amber-400/25 transition-all shadow-[0_0_15px_rgba(251,191,36,0.15)]"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                <span>
                  {isThai ? `เหลือเวลาน้อยกว่า 24 ชม. ${urgent24hCount} รายการ (ไฮไลต์สีเหลือง)` : `${urgent24hCount} tasks due in < 24h (highlighted yellow)`}
                </span>
              </div>
              <span className="text-[11px] underline shrink-0">{isThai ? 'ดูเฉพาะด่วน' : 'View urgent'} &rarr;</span>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-[#051329] rounded-3xl p-5 border border-slate-200/80 dark:border-[#0e2c5a] shadow-sm space-y-3.5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Control Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#071936] rounded-2xl overflow-x-auto border border-slate-200 dark:border-[#113264]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-[#0075ff] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('allStatus')} ({assignments.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                statusFilter === 'pending'
                  ? 'bg-[#0075ff] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('pending')} ({pendingAssignmentsCount})
            </button>
            <button
              onClick={() => setStatusFilter('urgent')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                statusFilter === 'urgent'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-amber-600 dark:text-amber-400 hover:underline'
              }`}
            >
              ⚡ &lt; 24 ชม. ({urgent24hCount})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                statusFilter === 'overdue'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-500 hover:underline'
              }`}
            >
              ⚠️ เลยกำหนด ({overdueCount})
            </button>
            <button
              onClick={() => setStatusFilter('submitted')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                statusFilter === 'submitted'
                  ? 'bg-[#0075ff] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('submitted')} ({completedAssignmentsCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchAssignments')}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-white dark:bg-[#071733] border border-slate-200 dark:border-[#113264] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-[#0075ff] focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Secondary Row: Course dropdown & Sort By */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#0d274f] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-bold">{t('filterByCourse')}:</span>
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#113264] bg-white dark:bg-[#071733] text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500 cursor-pointer font-medium"
            >
              <option value="all">{t('allCoursesOption')}</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              {t('sortBy')}:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#113264] bg-white dark:bg-[#071733] text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500 cursor-pointer font-medium"
            >
              <option value="dueDateAsc">{isThai ? 'เรียงตามกำหนดส่ง (ใกล้ส่งก่อน)' : 'Due Date (Earliest first)'}</option>
              <option value="dueDateDesc">{isThai ? 'เรียงตามกำหนดส่ง (ส่งทีหลังก่อน)' : 'Due Date (Latest first)'}</option>
              <option value="priority">{t('sortByPriority')}</option>
              <option value="points">{t('sortByPoints')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#051329] rounded-3xl border border-dashed border-slate-300 dark:border-[#0e2c5a] space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {assignments.length === 0 
              ? (isThai ? 'ยังไม่มีการบ้านหรือรายงานใน Firestore' : 'No assignments created yet')
              : (isThai ? 'ไม่พบรายการงานตามเงื่อนไขที่เลือก' : 'No assignments match the selected filters')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {assignments.length === 0
              ? (isThai ? 'เริ่มต้นด้วยการกดปุ่ม "เพิ่มการบ้านใหม่" เพื่อบันทึกงานลงใน users/{uid}/assignments' : 'Start by adding an assignment to save to users/{uid}/assignments.')
              : (isThai ? 'ลองปรับคำค้นหา หรือเลือกตัวกรองสถานะอื่น หรือเพิ่มการบ้านใหม่' : 'Try adjusting your search query or filters, or add a new assignment.')}
          </p>
          {assignments.length === 0 ? (
            <button
              onClick={() => setIsAddAssignmentOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl cursor-pointer"
            >
              + {t('newAssignment')}
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSelectedCourseFilter('all');
              }}
              className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-[#38bdf8] bg-blue-50 dark:bg-[#081d3f] hover:bg-blue-100 rounded-2xl border border-blue-200 dark:border-[#113264] cursor-pointer"
            >
              {isThai ? 'รีเซ็ตตัวกรอง' : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map(task => (
            <AssignmentCard
              key={task.id}
              assignment={task}
              onSelect={setSelectedAssignment}
            />
          ))}
        </div>
      )}

      {/* Modals */}
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
