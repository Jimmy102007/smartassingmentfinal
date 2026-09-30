import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  User, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseIcon, getCourseColorClasses } from '../components/CourseIcon';
import { AddCourseModal } from '../components/modals/AddCourseModal';

export const CoursesPage: React.FC = () => {
  const { courses, assignments, navigateTo, language, t } = useApp();
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const q = searchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q) ||
      course.teacher.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 dark:text-[#38bdf8] font-bold text-lg">›</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('coursesTitle')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('coursesSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchCourses')}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-white dark:bg-[#071733] border border-slate-200 dark:border-[#113264] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-[#0075ff] focus:outline-hidden transition-all"
            />
          </div>

          <button
            onClick={() => setIsAddCourseOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_18px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>{t('addNewCourse')}</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#051329] rounded-3xl border border-dashed border-slate-300 dark:border-[#0e2c5a] space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {searchQuery 
              ? (language === 'th' ? 'ไม่พบรายวิชาที่ตรงกับคำค้นหา' : 'No matching courses found') 
              : (language === 'th' ? 'ยังไม่ได้ลงทะเบียนรายวิชา' : 'No courses currently registered')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? (language === 'th' ? `ไม่พบรายวิชาที่ตรงกับ "${searchQuery}" กรุณาลองค้นหาด้วยคำอื่น` : `We couldn't find any courses matching "${searchQuery}". Try a different keyword.`)
              : (language === 'th' ? 'เพิ่มรายวิชาในภาคเรียนนี้เพื่อเริ่มบันทึกงาน กำหนดส่ง และบทเรียน' : 'Add your courses for this semester to track coursework and assignments.')}
          </p>
          <button
            onClick={() => {
              if (searchQuery) setSearchQuery('');
              else setIsAddCourseOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl cursor-pointer"
          >
            {searchQuery ? (language === 'th' ? 'ล้างการค้นหา' : 'Clear Search') : t('addNewCourse')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => {
            const colorStyles = getCourseColorClasses(course.color);
            const courseAssignments = assignments.filter(a => a.courseId === course.id);
            const completedCount = courseAssignments.filter(a => a.status === 'completed' || a.status === 'submitted').length;
            const pendingCount = courseAssignments.filter(a => a.status === 'pending').length;
            const totalCount = courseAssignments.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={course.id}
                onClick={() => navigateTo('course-detail', course.id)}
                className="bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] shadow-sm hover:shadow-xl hover:border-blue-400/60 dark:hover:border-[#0075ff]/60 transition-all cursor-pointer p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Subtle colored line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorStyles.gradient}`} />

                <div>
                  {/* Top Bar: Icon + Course Code + Credits */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${colorStyles.bg} flex items-center justify-center border shadow-2xs group-hover:scale-105 transition-transform`}>
                      <CourseIcon icon={course.icon} className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#081d3f] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#113264]">
                        {course.code}
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-medium">
                        {course.credits} {t('credits')}
                      </span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#38bdf8] transition-colors leading-snug">
                    {course.name}
                  </h2>

                  {/* Teacher with icon */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-2">
                    <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-semibold">{course.teacher}</span>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Meta Specs: Room & Schedule */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#0d274f] space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{course.room}</span>
                    </div>
                  </div>
                </div>

                {/* Progress & Card Action Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#0d274f]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-400">
                      {language === 'th' ? 'ความคืบหน้า' : 'Progress'}: <strong className="text-slate-900 dark:text-slate-200">{completedCount}/{totalCount}</strong> {language === 'th' ? 'งาน' : 'done'}
                    </span>
                    {pendingCount > 0 ? (
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                        {pendingCount} {t('pending')}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('submitted')}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-[#081d3f] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Open Detail Button */}
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-[#38bdf8] pt-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{t('viewDetails')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
      />
    </div>
  );
};
