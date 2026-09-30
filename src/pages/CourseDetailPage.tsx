import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Calendar, 
  Trash2, 
  ListTodo, 
  UploadCloud, 
  File, 
  Home
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseIcon, getCourseColorClasses } from '../components/CourseIcon';
import { AddAssignmentModal } from '../components/modals/AddAssignmentModal';
import { AssignmentDetailModal } from '../components/modals/AssignmentDetailModal';
import { SubmitAssignmentModal } from '../components/modals/SubmitAssignmentModal';
import { AssignmentCard } from '../components/AssignmentCard';
import { Assignment } from '../types';
import { parseDueAt } from '../utils/deadline';

export const CourseDetailPage: React.FC = () => {
  const { 
    selectedCourse, 
    assignments, 
    navigateTo, 
    toggleAssignmentStatus, 
    deleteCourse,
    submittingAssignment,
    openSubmitModal,
    closeSubmitModal,
    language,
    t
  } = useApp();

  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  if (!selectedCourse) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500 text-sm">
          {language === 'th' ? 'ไม่พบรายวิชาที่เลือก' : 'No course selected.'}
        </p>
        <button
          onClick={() => navigateTo('courses')}
          className="px-4 py-2 bg-[#0075ff] text-white rounded-2xl text-xs font-bold cursor-pointer"
        >
          &larr; {t('courses')}
        </button>
      </div>
    );
  }

  const colorStyles = getCourseColorClasses(selectedCourse.color);

  // Filter course-specific assignments
  const courseAssignments = assignments.filter(a => a.courseId === selectedCourse.id);
  const pendingCount = courseAssignments.filter(a => a.status === 'pending').length;
  const submittedCount = courseAssignments.filter(a => a.status === 'completed' || a.status === 'submitted').length;
  const totalCount = courseAssignments.length;
  const progressPct = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

  const displayedAssignments = courseAssignments
    .filter(item => {
      const isSubmitted = item.status === 'submitted' || item.status === 'completed';
      if (filter === 'pending') return !isSubmitted;
      if (filter === 'submitted') return isSubmitted;
      return true;
    })
    .sort((a, b) => parseDueAt(a).getTime() - parseDueAt(b).getTime());

  const handleDeleteCourse = () => {
    const msg = language === 'th' 
      ? `คุณแน่ใจหรือไม่ว่าต้องการถอนรายวิชา "${selectedCourse.name}"? การบ้านทั้งหมดที่เกี่ยวข้องจะถูกลบด้วย` 
      : `Are you sure you want to drop course "${selectedCourse.name}"? All related assignments will also be deleted.`;
    if (window.confirm(msg)) {
      deleteCourse(selectedCourse.id);
    }
  };

  const formatDateLabel = (dateStr: string, dueTime?: string) => {
    try {
      const d = new Date(dateStr);
      if (language === 'th') {
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear() + 543;
        return `${day} ${month} ${year}${dueTime ? ` • ${dueTime} น.` : ''}`;
      } else {
        return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${dueTime ? ` at ${dueTime}` : ''}`;
      }
    } catch {
      return `${dateStr} ${dueTime || ''}`;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Back Button & Course Actions Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('courses')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#071936] hover:bg-slate-50 dark:hover:bg-[#0b244d] border border-slate-200 dark:border-[#113264] rounded-2xl transition-all shadow-2xs group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-[#38bdf8] group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'th' ? 'กลับไปยังหน้ารายวิชา' : 'Back to Courses'}</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl hover:bg-slate-100 dark:hover:bg-[#081d3f] transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('dashboard')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddAssignmentOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_15px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>{t('newAssignment')}</span>
          </button>
          <button
            onClick={handleDeleteCourse}
            className="p-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-2xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer"
            title={language === 'th' ? 'ถอนรายวิชานี้' : 'Drop Course'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Course Hero Banner */}
      <div className="bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] p-6 sm:p-8 shadow-sm relative overflow-hidden transition-colors">
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colorStyles.gradient}`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${colorStyles.bg} flex items-center justify-center border shadow-sm shrink-0`}>
              <CourseIcon icon={selectedCourse.icon} className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-[#38bdf8]">
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-[#081d3f] border border-blue-200 dark:border-[#113264]">
                  {selectedCourse.code}
                </span>
                <span className="text-slate-400 font-sans">·</span>
                <span className="text-slate-600 dark:text-slate-400 font-sans font-semibold">
                  {selectedCourse.credits} {t('credits')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedCourse.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed pt-1">
                {selectedCourse.description}
              </p>
            </div>
          </div>

          {/* Course Progress Summary widget */}
          <div className="lg:w-64 p-4 rounded-2xl bg-slate-50 dark:bg-[#071936] border border-slate-200/80 dark:border-[#113264] shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'th' ? 'ความคืบหน้าของวิชา' : 'Course Completion'}
              </span>
              <span className="text-slate-900 dark:text-white">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-[#081d3f] rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>{submittedCount} {t('submitted')}</span>
              <span>·</span>
              <span className="text-rose-500 font-bold">{pendingCount} {t('pending')}</span>
            </div>
          </div>
        </div>

        {/* Instructor & Logistics Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#0d274f] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-[#081d3f] text-blue-600 dark:text-[#38bdf8] rounded-xl border border-slate-200 dark:border-[#113264]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'th' ? 'อาจารย์ผู้สอน' : 'Instructor'}
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedCourse.teacher}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-[#081d3f] text-blue-600 dark:text-[#38bdf8] rounded-xl border border-slate-200 dark:border-[#113264]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'th' ? 'อีเมลอาจารย์' : 'Faculty Email'}
              </p>
              <a 
                href={`mailto:${selectedCourse.teacherEmail}`}
                className="text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:underline"
              >
                {selectedCourse.teacherEmail}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-[#081d3f] text-blue-600 dark:text-[#38bdf8] rounded-xl border border-slate-200 dark:border-[#113264]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'th' ? 'ตารางเรียนและเวลาให้คำปรึกษา' : 'Schedule & Hours'}
              </p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{selectedCourse.schedule}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">OH: {selectedCourse.officeHours}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-100 dark:bg-[#081d3f] text-blue-600 dark:text-[#38bdf8] rounded-xl border border-slate-200 dark:border-[#113264]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'th' ? 'ห้องเรียน' : 'Location'}
              </p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{selectedCourse.room}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Assignments List + Syllabus Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Course Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-600 dark:text-[#38bdf8]" />
                {language === 'th' ? 'การบ้านและภาระงานของวิชานี้' : 'Course Deliverables & Tasks'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'th' ? 'รายการงาน โครงงาน และการส่งงานในรายวิชานี้' : 'Tasks, projects, and deliverables assigned for this class'}
              </p>
            </div>

            {/* Filter Tabs (Interactive Segmented Control) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#071936] rounded-2xl border border-slate-200 dark:border-[#113264]">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#0075ff] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('allStatus')} ({courseAssignments.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filter === 'pending'
                    ? 'bg-[#0075ff] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('pending')} ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('submitted')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filter === 'submitted'
                    ? 'bg-[#0075ff] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('submitted')} ({submittedCount})
              </button>
            </div>
          </div>

          {/* Assignments List */}
          {displayedAssignments.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#051329] rounded-3xl border border-dashed border-slate-200 dark:border-[#0e2c5a] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {filter === 'pending' 
                  ? (language === 'th' ? 'ไม่มีงานค้างส่งในวิชานี้!' : 'No pending assignments for this class!') 
                  : (language === 'th' ? 'ไม่พบการบ้านในหมวดหมู่นี้' : 'No assignments found in this category.')}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'th' ? 'คลิก "เพิ่มการบ้าน" ด้านบนเพื่อกำหนดงานใหม่ในรายวิชานี้' : 'Click "Add Assignment" above to schedule a new task for this class.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedAssignments.map(task => (
                <AssignmentCard
                  key={task.id}
                  assignment={task}
                  onSelect={setSelectedAssignment}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Syllabus & Key Learning Topics */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-[#38bdf8]" />
              {language === 'th' ? 'หัวข้อในบทเรียน' : 'Syllabus Outline'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'th' ? 'เนื้อหาและขั้นตอนการเรียนรู้' : 'Module roadmap and milestones'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] p-5 shadow-sm space-y-3 transition-colors">
            {selectedCourse.syllabusTopics.map((topic, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-lg bg-blue-50 dark:bg-[#081d3f] text-blue-600 dark:text-[#38bdf8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 dark:border-[#113264]">
                  {idx + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {topic}
                </span>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 dark:border-[#0d274f] text-center">
              <p className="text-[11px] text-slate-400">
                {language === 'th' ? 'รายวิชาลงทะเบียนในภาคการศึกษาปัจจุบัน' : 'Course registered for Academic Term'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAssignmentModal
        isOpen={isAddAssignmentOpen}
        onClose={() => setIsAddAssignmentOpen(false)}
        defaultCourseId={selectedCourse.id}
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
