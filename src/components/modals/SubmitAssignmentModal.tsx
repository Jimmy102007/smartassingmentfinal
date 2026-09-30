import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  File, 
  Link as LinkIcon, 
  FileText, 
  Send, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Assignment } from '../../types';
import { useApp } from '../../context/AppContext';

interface SubmitAssignmentModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
}) => {
  const { submitAssignment, language, t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [docLink, setDocLink] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen || !assignment) return null;

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
      setError('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB';

      setSelectedFile({
        name: file.name,
        size: sizeStr,
      });
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !docLink.trim()) {
      setError(language === 'th' ? 'กรุณาแนบไฟล์งาน หรือระบุลิงก์เอกสาร/ที่เก็บโค้ดเพื่อส่งงาน' : 'Please select a file or provide a project repository/document link to submit.');
      return;
    }

    submitAssignment(
      assignment.id, 
      notes.trim(), 
      selectedFile || undefined, 
      docLink.trim() || undefined
    );

    // Reset & close
    setSelectedFile(null);
    setNotes('');
    setDocLink('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#051329] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#0e2c5a] overflow-hidden my-8 transition-colors">
        {/* Top Banner */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#0d274f] bg-slate-50 dark:bg-[#071936] flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-[#38bdf8]">
              {assignment.courseCode} · {assignment.courseName}
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {t('submitAssignment')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {assignment.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#081d3f] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-900/80 rounded-2xl text-xs text-rose-300 flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Due date info banner */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071733] border border-slate-200/80 dark:border-[#113264] flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">{t('dueDate')}:</span>
            <span className="font-mono text-slate-900 dark:text-white">
              {assignment.dueDate} · {assignment.dueTime}
            </span>
          </div>

          {/* File Upload Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('selectSubmissionFile')} <span className="text-rose-500">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.zip,.tar.gz,.js,.ts,.py,.java,.cpp,.png,.jpg,.txt"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-[#0075ff]/20' 
                    : 'border-slate-300 dark:border-[#113264] hover:border-blue-400 dark:hover:border-[#0075ff] bg-slate-50/50 dark:bg-[#071733] hover:bg-blue-50/30'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-[#0075ff]/20 text-blue-600 dark:text-[#38bdf8] flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <UploadCloud className="w-6 h-6 stroke-[2.5px]" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t('dragDropText')}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t('fileSupportNotice')}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-3 px-4 py-1.5 bg-white dark:bg-[#081d3f] text-blue-600 dark:text-[#38bdf8] border border-blue-200 dark:border-[#113264] hover:bg-blue-50 dark:hover:bg-[#0d2a5a] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {t('browseFiles')}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-emerald-500/40 dark:border-emerald-700/60 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      {selectedFile.size} · {language === 'th' ? 'พร้อมส่ง' : 'Ready to submit'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-blue-600 dark:text-[#38bdf8] hover:underline px-2"
                  >
                    {language === 'th' ? 'เปลี่ยนไฟล์' : 'Change'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    title={language === 'th' ? 'ลบไฟล์' : 'Remove file'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Optional Deliverable Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
              {t('projectLinkPlaceholder')}
            </label>
            <input
              type="url"
              placeholder="https://github.com/... or https://docs.google.com/..."
              value={docLink}
              onChange={e => setDocLink(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Comments / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              {t('studentNotesLabel')}
            </label>
            <textarea
              rows={2}
              placeholder={language === 'th' ? 'สรุปการทำงาน ข้อควรระวัง หรือข้อความถึงอาจารย์ผู้ตรวจ...' : 'Summary of your solution, execution notes, or comments...'}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#0d274f] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#081d3f] rounded-2xl transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_18px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('confirmAndSubmit')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
