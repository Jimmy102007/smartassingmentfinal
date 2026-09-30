import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Award, 
  Edit3, 
  Trash2,
  Users, 
  BookOpen, 
  Moon,
  Sun,
  Laptop,
  ArrowRight,
  ChevronRight,
  Calendar as CalendarIcon,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_STUDENTS } from '../data/seedData';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { SubmitAssignmentModal } from '../components/modals/SubmitAssignmentModal';
import { AssignmentDetailModal } from '../components/modals/AssignmentDetailModal';
import { Assignment } from '../types';

export const ProfilePage: React.FC = () => {
  const { 
    currentStudent, 
    courses, 
    assignments, 
    registeredAccounts,
    quickSwitchAccount,
    logout,
    navigateTo,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t
  } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionAssignment, setSubmissionAssignment] = useState<Assignment | null>(null);

  if (!currentStudent) return null;

  const totalCredits = courses.reduce((acc, c) => acc + (c.credits || 0), 0);

  // Helper to format date in Thai or English based on language
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (language === 'th') {
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear() + 543; // Buddhist Era
        const hours = d.getHours().toString().padStart(2, '0');
        const mins = d.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year} • ${hours}:${mins} น.`;
      } else {
        return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      }
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto pb-16">
      {/* Student Academic Profile Main Card */}
      <div className="bg-white dark:bg-[#051329]/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-[#0e2c5a] p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
        {/* Top Header inside card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-[#0d274f]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-[#38bdf8] font-bold text-lg">›</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('studentProfile')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {t('profileSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="px-3.5 py-2 text-xs font-bold text-[#38bdf8] bg-blue-500/10 hover:bg-blue-500/20 rounded-2xl border border-blue-400/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'th' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}</span>
            </button>

            {/* Dark Mode Pill Button */}
            <button
              onClick={toggleTheme}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0065e0] rounded-2xl shadow-[0_0_15px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 fill-current text-blue-200" />
                  <span>{t('darkMode')}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-200" />
                  <span>{t('lightMode')}</span>
                </>
              )}
            </button>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#081d3f] hover:bg-slate-200 dark:hover:bg-[#0d2a5a] hover:text-slate-900 dark:hover:text-white rounded-2xl border border-slate-200 dark:border-[#14376b] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
              <span>{t('editProfile')}</span>
            </button>

            {/* Logout / Sign Out Button */}
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              title={language === 'th' ? 'ออกจากระบบ' : 'Sign Out'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'ออกจากระบบ' : 'Sign Out'}</span>
            </button>

            {/* Delete / Reset Profile Button */}
            <button
              onClick={() => {
                if (confirm('Reset student profile information to initial university defaults?')) {
                  localStorage.removeItem(`smart_assignment_${currentStudent.id}_profile`);
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#081d3f] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 rounded-2xl border border-slate-200 dark:border-[#14376b] hover:border-rose-200 dark:hover:border-rose-900 transition-colors flex items-center gap-2 cursor-pointer"
              title={t('deleteProfile')}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('deleteProfile')}</span>
            </button>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Glossy 3D Blue Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#38bdf8] via-[#0075ff] to-[#0048b3] text-white text-3xl sm:text-4xl font-black flex items-center justify-center shadow-[0_0_30px_rgba(0,117,255,0.4)] ring-2 ring-blue-300/40 relative overflow-hidden shrink-0">
                {/* 3D Sheen highlight */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none" />
                <span className="relative z-10 drop-shadow-md">{currentStudent.name.charAt(0)}</span>
              </div>

              {/* Identity labels & tags */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-blue-50 dark:bg-[#082046] text-blue-700 dark:text-[#38bdf8] border border-blue-200 dark:border-[#133b74] flex items-center gap-1.5">
                    <span className="text-[10px]">🪪</span>
                    {t('studentId')} : {currentStudent.id}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-700/60 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    {t('activeStudentStatus')}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentStudent.name}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-0.5">
                  <span className="flex items-center gap-1.5 text-blue-700 dark:text-[#38bdf8] font-bold">
                    <Laptop className="w-3.5 h-3.5" />
                    {currentStudent.major}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-[#0075ff]/20 text-blue-800 dark:text-[#38bdf8] text-[10px] font-bold border border-blue-200 dark:border-[#0075ff]/40">
                    AI
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {currentStudent.university} • {currentStudent.semester}
                  </span>
                </div>
              </div>
            </div>

            {/* Modify Details Action Button */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-[#081d3f] hover:bg-[#0075ff] hover:text-white rounded-2xl border border-slate-200 dark:border-[#14376b] hover:border-blue-400/50 shadow-xs transition-all flex items-center gap-2 self-start md:self-center cursor-pointer shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('modifyDetails')}</span>
            </button>
          </div>

          {/* 4 Metrics in 2x2 Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Metric 1 */}
            <div className="p-4 bg-slate-50 dark:bg-[#071936] rounded-2xl border border-slate-200/80 dark:border-[#103160] flex items-center gap-3.5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c244c] flex items-center justify-center text-blue-600 dark:text-[#38bdf8] shrink-0 border border-slate-200 dark:border-[#143c74] shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest block">
                  {t('institutionalEmail')}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={currentStudent.email}>
                  {currentStudent.email}
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 bg-slate-50 dark:bg-[#071936] rounded-2xl border border-slate-200/80 dark:border-[#103160] flex items-center gap-3.5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c244c] flex items-center justify-center text-blue-600 dark:text-[#38bdf8] shrink-0 border border-slate-200 dark:border-[#143c74] shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest block">
                  {t('cumulativeGpa')}
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {currentStudent.gpa} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ 4.00</span>
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 bg-slate-50 dark:bg-[#071936] rounded-2xl border border-slate-200/80 dark:border-[#103160] flex items-center gap-3.5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c244c] flex items-center justify-center text-blue-600 dark:text-[#38bdf8] shrink-0 border border-slate-200 dark:border-[#143c74] shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest block">
                  {t('enrolledCredits')}
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {totalCredits} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ 18 Credits</span>
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 bg-slate-50 dark:bg-[#071936] rounded-2xl border border-slate-200/80 dark:border-[#103160] flex items-center gap-3.5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0c244c] flex items-center justify-center text-blue-600 dark:text-[#38bdf8] shrink-0 border border-slate-200 dark:border-[#143c74] shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest block">
                  {t('facultyAdvisor')}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {currentStudent.advisor || 'Dr. Somchai K.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Upcoming Assignments Section (matching the screenshot) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-[#38bdf8] uppercase tracking-wider block">
              {language === 'th' ? 'การบ้านล่าสุด' : 'My Upcoming'}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('assignments')}
            </h3>
          </div>

          <button
            onClick={() => navigateTo('assignments')}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_18px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Assignment Cards list */}
        <div className="space-y-3">
          {assignments.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#051329] rounded-2xl border border-dashed border-slate-200 dark:border-[#0e2c5a] space-y-2">
              <BookOpen className="w-7 h-7 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'th' ? 'ยังไม่มีงานหรือการบ้านที่ต้องส่ง' : 'No upcoming assignments'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'th' ? 'คุณสามารถเพิ่มการบ้านใหม่ได้จากหน้าหลัก หรือหน้ารายวิชา' : 'You can add assignments from the Home or Courses tab.'}
              </p>
            </div>
          ) : (
            assignments.slice(0, 4).map((assignment, index) => {
              const isPending = assignment.status === 'pending';
              const course = courses.find(c => c.id === assignment.courseId);
              const borderColors = [
                'border-l-[#0075ff]',
                'border-l-amber-500',
                'border-l-purple-500',
                'border-l-cyan-400'
              ];
              const borderLeft = borderColors[index % borderColors.length];

              return (
                <div
                  key={assignment.id}
                  className={`p-5 rounded-2xl bg-white dark:bg-[#051329] border border-slate-200/90 dark:border-[#0d274f] border-l-4 ${borderLeft} hover:border-slate-300 dark:hover:border-[#133b74] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm dark:shadow-md`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-[#38bdf8]">
                        {course ? `${course.code} - ${course.name}` : assignment.title}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#38bdf8] transition-colors">
                      {assignment.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {assignment.description || (language === 'th' ? 'ยังไม่มีรายละเอียด' : 'No description provided')}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(assignment.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {/* Status Badge */}
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      assignment.status === 'submitted'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/60'
                        : index === 1
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700/60'
                          : 'bg-slate-100 dark:bg-[#0d2347] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#14376b]'
                    }`}>
                      {assignment.status === 'submitted' 
                        ? t('submitted') 
                        : index === 1 
                          ? t('inProgress') 
                          : t('notStarted')}
                    </span>

                    {/* Action Link (ดูงาน / ส่งงาน >) */}
                    <button
                      onClick={() => {
                        if (isPending) {
                          setSubmissionAssignment(assignment);
                        } else {
                          setSelectedAssignment(assignment);
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:text-blue-800 dark:hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-blue-50 dark:hover:bg-[#0b244d]"
                    >
                      <span>{isPending ? t('submitAssignment') : t('viewAssignment')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Multi-Student Account Switcher */}
      <div className="bg-white dark:bg-[#051329] rounded-3xl border border-slate-200/80 dark:border-[#0d274f] p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-[#38bdf8]" />
              {language === 'th' ? 'ระบบสลับบัญชีและจดจำแอคเคาท์' : 'Account Switcher & Remembered Profiles'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'th' 
                ? 'ข้อมูลการเรียน รายวิชา และการบ้านจะถูกจัดเก็บแยกเฉพาะบัญชีของคุณอย่างเป็นส่วนตัว'
                : 'Courses, assignments, and submissions are securely isolated per student account.'}
            </p>
          </div>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-[#081d3f] rounded-2xl border border-blue-200 dark:border-[#113264] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>+ {language === 'th' ? 'สลับหรือสมัครบัญชีใหม่' : 'Switch or Add Account'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {registeredAccounts.map(acc => {
            const isCurrent = currentStudent.id === acc.student.id;

            return (
              <div
                key={acc.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-[#0075ff] bg-blue-50/70 dark:bg-[#0075ff]/15 ring-1 ring-blue-400/50'
                    : 'border-slate-200 dark:border-[#0e2c5a] bg-slate-50 dark:bg-[#071936] hover:border-slate-300 dark:hover:border-[#143c74]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.student.avatarColor || 'from-blue-600 to-cyan-400'} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                    {acc.student.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {acc.student.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {acc.id} · {acc.student.major}
                    </p>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="text-[11px] font-bold text-blue-700 dark:text-[#38bdf8] bg-blue-100 dark:bg-[#0075ff]/30 px-3 py-1 rounded-xl border border-blue-300 dark:border-blue-400/40 shrink-0">
                    {t('active')}
                  </span>
                ) : (
                  <button
                    onClick={() => quickSwitchAccount(acc.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-white bg-slate-200/80 dark:bg-[#0a234c] hover:bg-[#0075ff] rounded-xl transition-all border border-slate-300 dark:border-[#133b74] cursor-pointer shrink-0"
                  >
                    {t('switchStudent')} &rarr;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <SubmitAssignmentModal
        isOpen={!!submissionAssignment}
        assignment={submissionAssignment}
        onClose={() => setSubmissionAssignment(null)}
      />

      <AssignmentDetailModal
        isOpen={!!selectedAssignment}
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
      />
    </div>
  );
};
