import React, { useState, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Send, 
  FileText, 
  Link as LinkIcon, 
  Award,
  BookOpen,
  UploadCloud,
  File,
  AlertCircle,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Assignment } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLiveTimer, getDeadlineInfo } from '../../utils/deadline';

interface AssignmentDetailModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({
  assignment,
  isOpen,
  onClose,
}) => {
  const { toggleAssignmentStatus, submitAssignment, deleteAssignment, navigateTo, language, t } = useApp();
  const now = useLiveTimer();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen || !assignment) return null;

  const isSubmitted = assignment.status === 'submitted' || assignment.status === 'completed';

  const handleToggle = () => {
    toggleAssignmentStatus(assignment.id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB';

      setSelectedFile({
        name: file.name,
        size: sizeStr,
      });
      setSubmitError('');
    }
  };

  const handleOnlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !link.trim()) {
      setSubmitError(language === 'th' ? 'กรุณาเลือกไฟล์หรือระบุลิงก์ผลงาน' : 'Please select a file or provide a project/document link.');
      return;
    }
    submitAssignment(assignment.id, notes.trim(), selectedFile || undefined, link.trim() || undefined);
    setIsSubmittingForm(false);
  };

  const handleDelete = () => {
    const msg = language === 'th' 
      ? `คุณแน่ใจหรือไม่ว่าต้องการลบการบ้าน "${assignment.title}"?` 
      : `Are you sure you want to remove assignment "${assignment.title}"?`;
    if (window.confirm(msg)) {
      deleteAssignment(assignment.id);
      onClose();
    }
  };

  const handleGoToCourse = () => {
    onClose();
    navigateTo('course-detail', assignment.courseId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#051329] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#0e2c5a] overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#0d274f] flex items-start justify-between bg-slate-50 dark:bg-[#071936]">
          <div className="space-y-1">
            <button
              onClick={handleGoToCourse}
              className="text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{assignment.courseCode} · {assignment.courseName}</span>
            </button>
            <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
              {assignment.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#081d3f] rounded-xl transition-colors ml-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Live Countdown & Urgency Banner */}
          {(() => {
            const deadlineInfo = getDeadlineInfo(assignment, now, language);
            if (isSubmitted) {
              return (
                <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'th' ? 'สถานะ: ส่งงานเรียบร้อยแล้ว' : 'Status: Submitted'}</span>
                  </span>
                  {assignment.submittedAt && <span className="font-mono text-[11px]">{assignment.submittedAt}</span>}
                </div>
              );
            }
            if (deadlineInfo.isOverdue) {
              return (
                <div className="p-3.5 bg-rose-500/20 border-2 border-rose-500/80 rounded-2xl flex items-center justify-between text-xs font-extrabold text-rose-700 dark:text-rose-200 animate-pulse">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>{language === 'th' ? '⚠️ การบ้านนี้เลยกำหนดส่งแล้ว!' : '⚠️ Assignment is Overdue!'}</span>
                  </span>
                  <span className="font-mono bg-rose-600 text-white px-2 py-0.5 rounded-lg text-[11px]">
                    {deadlineInfo.formattedCountdown}
                  </span>
                </div>
              );
            }
            if (deadlineInfo.isUrgent24h) {
              return (
                <div className="p-3.5 bg-amber-400/25 border-2 border-amber-400 rounded-2xl flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />
                    <span>{language === 'th' ? '⚡ ด่วน! เหลือเวลาน้อยกว่า 24 ชั่วโมง' : '⚡ Urgent: Due in less than 24 hours'}</span>
                  </span>
                  <span className="font-mono bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[11px]">
                    {deadlineInfo.formattedCountdown}
                  </span>
                </div>
              );
            }
            return (
              <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-2xl flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-[#38bdf8]">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{language === 'th' ? 'เวลานับถอยหลังก่อนถึงกำหนดส่ง:' : 'Time remaining until deadline:'}</span>
                </span>
                <span className="font-mono font-bold bg-blue-600/20 px-2.5 py-0.5 rounded-lg">
                  {deadlineInfo.formattedCountdown}
                </span>
              </div>
            );
          })()}

          {/* Quick Mark Submitted / Toggle Action */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#071936] border border-slate-200 dark:border-[#113264]">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {language === 'th' ? 'เปลี่ยนสถานะการส่งงาน' : 'Deliverable Status'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isSubmitted 
                  ? (language === 'th' ? 'ส่งแล้ว (คลิกเพื่อยกเลิก)' : 'Submitted (click to reset)')
                  : (language === 'th' ? 'ยังไม่ได้ส่ง (กดปุ่มเพื่อยืนยันว่าส่งแล้ว)' : 'Pending (click to mark as submitted)')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                isSubmitted
                  ? 'bg-slate-200 hover:bg-slate-300 dark:bg-[#0c244c] dark:hover:bg-[#11346d] text-slate-700 dark:text-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Circle className="w-4 h-4" />
                  <span>{language === 'th' ? 'เปลี่ยนกลับเป็นยังไม่ส่ง' : 'Mark as Pending'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3px]" />
                  <span>{language === 'th' ? 'ส่งแล้ว' : 'Mark as Submitted'}</span>
                </>
              )}
            </button>
          </div>
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-[#071733] rounded-2xl border border-slate-200/80 dark:border-[#113264]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'th' ? 'สถานะ' : 'Status'}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold mt-1 ${isSubmitted ? 'text-emerald-500' : 'text-amber-500'}`}>
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
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#071733] rounded-2xl border border-slate-200/80 dark:border-[#113264]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('dueDate')}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                {assignment.dueDate}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#071733] rounded-2xl border border-slate-200/80 dark:border-[#113264]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('dueTime')}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {assignment.dueTime}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#071733] rounded-2xl border border-slate-200/80 dark:border-[#113264]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('points')}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-1">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                {assignment.earnedScore !== undefined ? `${assignment.earnedScore} / ${assignment.points}` : `${assignment.points} ${t('points')}`}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600 dark:text-[#38bdf8]" />
              {language === 'th' ? 'คำชี้แจงและรายละเอียดงาน' : 'Assignment Instructions & Requirements'}
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-[#071733] rounded-2xl border border-slate-200/80 dark:border-[#113264] text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
              {assignment.description}
            </div>
          </div>

          {/* Submission Info / Form */}
          {isSubmitted ? (
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {language === 'th' ? 'บันทึกการส่งงานเรียบร้อยแล้ว' : 'Work Submitted & Recorded'}
                </span>
                {assignment.submittedAt && (
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                    {assignment.submittedAt}
                  </span>
                )}
              </div>

              {/* Submitted File Info */}
              {assignment.fileName && (
                <div className="p-3 bg-white dark:bg-[#071936] rounded-xl border border-emerald-200/60 dark:border-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <File className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {assignment.fileName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {assignment.fileSize || (language === 'th' ? 'ไฟล์แนบ' : 'Attached file')}
                  </span>
                </div>
              )}

              {assignment.submissionNotes && (
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-[#071936] p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {language === 'th' ? 'บันทึกเพิ่มเติม:' : 'Submission note:'}
                  </span> {assignment.submissionNotes}
                </p>
              )}

              {assignment.attachedLink && (
                <a
                  href={assignment.attachedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:underline flex items-center gap-1 pt-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  {assignment.attachedLink}
                </a>
              )}
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-[#113264] rounded-2xl p-5 bg-white dark:bg-[#071936] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('submitAssignment')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'th' ? 'อัปโหลดไฟล์งานเพื่อเปลี่ยนสถานะเป็น ส่งแล้ว' : 'Upload your file to change status to Submitted'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmittingForm(!isSubmittingForm)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:bg-blue-50 dark:hover:bg-[#081d3f] rounded-xl transition-colors cursor-pointer border border-blue-200 dark:border-[#113264]"
                >
                  {isSubmittingForm ? (language === 'th' ? 'ซ่อนฟอร์ม' : 'Hide Form') : t('submitAssignment')}
                </button>
              </div>

              {submitError && (
                <div className="p-2.5 bg-rose-950/50 border border-rose-900/80 rounded-xl text-xs text-rose-300 flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {isSubmittingForm && (
                <form onSubmit={handleOnlineSubmit} className="space-y-3 pt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.zip,.tar.gz,.js,.ts,.py,.java,.cpp,.png,.jpg,.txt"
                  />

                  {/* File Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('selectSubmissionFile')} <span className="text-rose-500">*</span>
                    </label>

                    {!selectedFile ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 px-4 border border-dashed border-slate-300 dark:border-[#14396f] hover:border-blue-500 rounded-2xl text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 bg-slate-50 dark:bg-[#071733] transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4 text-blue-500" />
                        <span>{t('browseFiles')}</span>
                      </button>
                    ) : (
                      <div className="p-2.5 bg-blue-50 dark:bg-[#0075ff]/20 border border-blue-200 dark:border-[#113264] rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-900 dark:text-[#38bdf8] truncate">
                          {selectedFile.name} ({selectedFile.size})
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-rose-500 hover:text-rose-700 text-[11px] font-bold ml-2 cursor-pointer"
                        >
                          {language === 'th' ? 'ลบออก' : 'Remove'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('projectLinkPlaceholder')}
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('studentNotesLabel')}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={language === 'th' ? 'ระบุบันทึกหรือข้อความถึงอาจารย์...' : 'Add any summary or notes for the faculty...'}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0075ff] hover:bg-[#0066e0] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_18px_rgba(0,117,255,0.4)] transition-all cursor-pointer active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('confirmAndSubmit')}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#0d274f] flex items-center justify-between gap-3">
            <button
              onClick={handleDelete}
              className="px-3 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{language === 'th' ? 'ลบการบ้านนี้' : 'Delete Task'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggle}
                className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                  isSubmitted
                    ? 'bg-slate-100 dark:bg-[#081d3f] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#0d2a5a] border border-slate-200 dark:border-[#113264]'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>{language === 'th' ? 'เปลี่ยนกลับเป็น ยังไม่ส่ง' : 'Change back to Pending'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'th' ? 'เปลี่ยนสถานะเป็น ส่งแล้ว' : 'Mark as Submitted'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
