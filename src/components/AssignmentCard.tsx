import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  UploadCloud, 
  File, 
  ChevronRight, 
  AlertTriangle, 
  Check,
  AlertCircle
} from 'lucide-react';
import { Assignment } from '../types';
import { useApp } from '../context/AppContext';
import { getDeadlineInfo, useLiveTimer } from '../utils/deadline';

interface AssignmentCardProps {
  assignment: Assignment;
  onSelect?: (assignment: Assignment) => void;
  compact?: boolean;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onSelect,
  compact = false,
}) => {
  const { toggleAssignmentStatus, openSubmitModal, language, t } = useApp();
  const now = useLiveTimer();
  const isThai = language === 'th';

  const isSubmitted = assignment.status === 'submitted' || assignment.status === 'completed';
  const deadlineInfo = getDeadlineInfo(assignment, now, language);

  // Formatting date label
  const formatDateLabel = (dueDate: string, dueTime?: string) => {
    try {
      const d = new Date(dueDate);
      if (isThai) {
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear() + 543;
        return `${day} ${month} ${year}${dueTime ? ` · ${dueTime} น.` : ''}`;
      } else {
        return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${dueTime ? ` · ${dueTime}` : ''}`;
      }
    } catch {
      return `${dueDate} ${dueTime || ''}`;
    }
  };

  // Styling based on deadline status:
  // - Yellow if < 24h remaining
  // - Red if overdue
  // - Green if submitted
  let containerBorderClass = 'border-slate-200/90 dark:border-[#0e2c5a] hover:border-blue-400/60 dark:hover:border-[#0075ff]/60';
  let containerBgClass = 'bg-white dark:bg-[#051329]';
  let urgencyGlowClass = '';

  if (isSubmitted) {
    containerBorderClass = 'border-emerald-300/80 dark:border-emerald-900/60';
    containerBgClass = 'bg-emerald-50/20 dark:bg-[#04151e]/60';
  } else if (deadlineInfo.isOverdue) {
    // Red highlight for OVERDUE
    containerBorderClass = 'border-rose-500/90 dark:border-rose-500 ring-2 ring-rose-500/30 dark:ring-rose-500/40';
    containerBgClass = 'bg-rose-50/70 dark:bg-rose-950/25';
    urgencyGlowClass = 'shadow-[0_0_20px_rgba(244,63,94,0.25)]';
  } else if (deadlineInfo.isUrgent24h) {
    // Yellow highlight for < 24 HOURS
    containerBorderClass = 'border-amber-400 dark:border-amber-400 ring-2 ring-amber-400/40 dark:ring-amber-400/50';
    containerBgClass = 'bg-amber-50/80 dark:bg-amber-950/25';
    urgencyGlowClass = 'shadow-[0_0_20px_rgba(251,191,36,0.3)]';
  }

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 border transition-all ${containerBorderClass} ${containerBgClass} ${urgencyGlowClass} group relative overflow-hidden`}
    >
      {/* Top Banner Stripe for Urgent 24h / Overdue */}
      {!isSubmitted && deadlineInfo.isOverdue && (
        <div className="absolute top-0 left-0 right-0 bg-rose-600 text-white px-4 py-1 text-[11px] font-extrabold flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
            <span>{isThai ? 'เลยกำหนดส่งแล้ว!' : 'OVERDUE DELIVERABLE'}</span>
          </span>
          <span className="font-mono text-[10px] tracking-wide">{deadlineInfo.formattedCountdown}</span>
        </div>
      )}

      {!isSubmitted && !deadlineInfo.isOverdue && deadlineInfo.isUrgent24h && (
        <div className="absolute top-0 left-0 right-0 bg-amber-500 text-slate-950 px-4 py-1 text-[11px] font-black flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>{isThai ? 'เตือนด่วน: เหลือเวลาน้อยกว่า 24 ชั่วโมง!' : 'DUE SOON: LESS THAN 24 HOURS'}</span>
          </span>
          <span className="font-mono text-[10px] tracking-wide">{deadlineInfo.formattedCountdown}</span>
        </div>
      )}

      <div className={`${!isSubmitted && (deadlineInfo.isOverdue || deadlineInfo.isUrgent24h) ? 'pt-4 sm:pt-4' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Block: Checkbox, Course info, Title, Countdown */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Status Checkbox Button */}
            <button
              type="button"
              onClick={() => toggleAssignmentStatus(assignment.id)}
              title={isSubmitted 
                ? (isThai ? 'คลิกเพื่อเปลี่ยนกลับเป็น ยังไม่ส่ง' : 'Mark as Pending') 
                : (isThai ? 'คลิกเพื่อเปลี่ยนเป็น ส่งแล้ว' : 'Mark as Submitted')}
              className={`mt-1 shrink-0 transition-transform active:scale-90 cursor-pointer ${
                isSubmitted 
                  ? 'text-emerald-500 hover:text-slate-400' 
                  : deadlineInfo.isOverdue 
                  ? 'text-rose-500 hover:text-emerald-500' 
                  : deadlineInfo.isUrgent24h
                  ? 'text-amber-500 hover:text-emerald-500'
                  : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500'
              }`}
            >
              {isSubmitted ? (
                <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              {/* Course Tag & Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-[#38bdf8]">
                  {assignment.courseCode || 'CS'}
                </span>
                <span className="text-slate-300 dark:text-slate-600 text-xs">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px]">
                  {assignment.courseName || assignment.course}
                </span>

                {/* Deadline Urgency Pill Badge */}
                {!isSubmitted ? (
                  deadlineInfo.isOverdue ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-500" />
                      <span>{isThai ? 'เลยกำหนด' : 'Overdue'}</span>
                    </span>
                  ) : deadlineInfo.isUrgent24h ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/25 text-amber-800 dark:text-amber-300 border border-amber-400/60 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{isThai ? '< 24 ชม.' : '< 24h'}</span>
                    </span>
                  ) : null
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{isThai ? 'ส่งแล้ว' : 'Submitted'}</span>
                  </span>
                )}

                {assignment.priority === 'high' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {t('highPriority')}
                  </span>
                )}
              </div>

              {/* Assignment Title */}
              <h3 
                onClick={() => onSelect && onSelect(assignment)}
                className={`text-sm sm:text-base font-bold transition-colors cursor-pointer ${
                  isSubmitted 
                    ? 'text-slate-600 dark:text-slate-300 line-through decoration-slate-400' 
                    : deadlineInfo.isOverdue 
                    ? 'text-rose-900 dark:text-rose-100 group-hover:text-rose-600'
                    : deadlineInfo.isUrgent24h
                    ? 'text-amber-950 dark:text-amber-100 group-hover:text-amber-500'
                    : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#38bdf8]'
                }`}
              >
                {assignment.title}
              </h3>

              {/* Description preview */}
              {!compact && assignment.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {assignment.description}
                </p>
              )}

              {/* Countdown & Due Date Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mt-2.5">
                {/* Due Date */}
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{formatDateLabel(assignment.dueDate, assignment.dueTime)}</span>
                </div>

                <span>·</span>

                {/* Countdown Display */}
                <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-1 rounded-xl ${
                  isSubmitted 
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                    : deadlineInfo.isOverdue
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40 animate-pulse'
                    : deadlineInfo.isUrgent24h
                    ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/50'
                    : 'bg-slate-100 dark:bg-[#071936] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#113264]'
                }`}>
                  <Clock className={`w-3.5 h-3.5 shrink-0 ${
                    deadlineInfo.isOverdue ? 'text-rose-500' : deadlineInfo.isUrgent24h ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <span>{deadlineInfo.formattedCountdown}</span>
                </div>

                {assignment.points !== undefined && (
                  <>
                    <span>·</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {assignment.points} {t('points')}
                    </span>
                  </>
                )}

                {assignment.fileName && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <File className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{assignment.fileName}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Block: "ส่งแล้ว" buttons & details */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-[#0d274f] shrink-0">
            {/* Quick Button: "ส่งแล้ว" (Mark Submitted directly) */}
            {!isSubmitted ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAssignmentStatus(assignment.id)}
                  className={`px-3.5 py-2 text-xs font-black rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                    deadlineInfo.isOverdue
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                      : deadlineInfo.isUrgent24h
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  }`}
                  title={isThai ? 'ทำเครื่องหมายว่าส่งงานแล้วทันที' : 'Mark as Submitted now'}
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                  <span>{isThai ? 'ส่งแล้ว' : 'Mark Submitted'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openSubmitModal(assignment)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_15px_rgba(0,117,255,0.4)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title={isThai ? 'อัปโหลดไฟล์และส่งงานพร้อมเอกสาร' : 'Submit with file or link'}
                >
                  <UploadCloud className="w-4 h-4 stroke-[2.5px]" />
                  <span>{isThai ? 'แนบไฟล์ส่ง' : 'Upload File'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAssignmentStatus(assignment.id)}
                  className="px-3 py-1.5 text-xs font-bold rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
                  title={isThai ? 'คลิกเพื่อเปลี่ยนกลับเป็นยังไม่ส่ง' : 'Mark as pending'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isThai ? 'ส่งเรียบร้อยแล้ว' : 'Submitted'}</span>
                </button>

                {onSelect && (
                  <button
                    type="button"
                    onClick={() => onSelect(assignment)}
                    className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-[#081d3f] rounded-2xl border border-blue-200 dark:border-[#113264] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('viewAssignment')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Details trigger button */}
            {onSelect && !isSubmitted && (
              <button
                type="button"
                onClick={() => onSelect(assignment)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#081d3f] rounded-xl transition-colors cursor-pointer"
                title={t('assignmentDetails')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
