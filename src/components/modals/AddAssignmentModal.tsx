import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Calendar, Clock, AlertCircle, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssignmentPriority } from '../../types';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string | null;
  defaultDate?: string;
}

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
  isOpen,
  onClose,
  defaultCourseId,
  defaultDate,
}) => {
  const { courses, addAssignment, language, t, setIsAddAssignmentModalOpen } = useApp();

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<AssignmentPriority>('medium');
  const [points, setPoints] = useState<number>(100);
  const [description, setDescription] = useState('');

  // Notify AppContext when modal opens/closes to slide & restore sidebar smoothly
  useEffect(() => {
    if (isOpen) {
      setIsAddAssignmentModalOpen(true);
    } else {
      setIsAddAssignmentModalOpen(false);
    }
    return () => {
      setIsAddAssignmentModalOpen(false);
    };
  }, [isOpen, setIsAddAssignmentModalOpen]);

  // Handle ESC key to dismiss modal and restore sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Default dates and course selection
  useEffect(() => {
    if (defaultDate) {
      setDueDate(defaultDate);
    } else {
      // 5 days from now
      const d = new Date();
      d.setDate(d.getDate() + 5);
      setDueDate(d.toISOString().split('T')[0]);
    }

    if (defaultCourseId && courses.some(c => c.id === defaultCourseId)) {
      setCourseId(defaultCourseId);
    } else if (courses.length > 0) {
      setCourseId(courses[0].id);
    }
  }, [defaultCourseId, defaultDate, courses, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId || !dueDate) return;

    const selectedCourse = courses.find(c => c.id === courseId);
    if (!selectedCourse) return;

    addAssignment({
      title: title.trim(),
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      courseCode: selectedCourse.code,
      dueDate,
      dueTime,
      priority,
      points: Number(points) || 100,
      description: description.trim() || (language === 'th' ? `ส่งงานและปฏิบัติตามข้อกำหนดสำหรับ ${title.trim()}` : `Complete requirements and coursework instructions for ${title.trim()}.`),
      status: 'pending',
    });

    // Reset & close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-backdrop-fade"
      style={{
        backgroundColor: 'rgba(3, 11, 24, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Centered Modal Card with Dark Glassmorphism, Blue Neon Glow, and Fade+Scale animation */}
      <div 
        className="relative w-full max-w-lg rounded-3xl overflow-hidden my-auto border border-[#0075ff]/50 neon-modal-glow animate-modal-scale-fade shadow-2xl transition-all select-none"
        style={{
          background: 'rgba(5, 19, 41, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#0d274f]/80 flex items-center justify-between bg-[#071936]/70">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <span className="p-2 bg-[#0075ff]/20 text-[#38bdf8] rounded-xl border border-[#113264] shadow-[0_0_12px_rgba(0,117,255,0.3)]">
                <PlusCircle className="w-4 h-4" />
              </span>
              {t('newAssignment')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {language === 'th' ? 'เพิ่มการบ้าน งานกลุ่ม รายงาน หรือโครงงานใหม่' : 'Add a new task, lab project, essay, or problem set.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#081d3f] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-200">
          {/* Assignment Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('assignmentTitleLabel')} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={language === 'th' ? 'เช่น รายงานวิจัยกลางภาค และการสังเคราะห์ผล' : 'e.g. Midterm Research Paper & Synthesis'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733]/90 text-white placeholder:text-slate-500 focus:border-[#0075ff] focus:ring-2 focus:ring-[#0075ff]/40 focus:outline-hidden transition-all font-medium"
            />
          </div>

          {/* Course Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('selectCourse')} <span className="text-rose-400">*</span>
            </label>
            {courses.length === 0 ? (
              <p className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-2xl border border-amber-800 font-medium">
                {language === 'th' ? 'คุณยังไม่มีรายวิชาที่ลงทะเบียน กรุณาเพิ่มรายวิชาก่อน' : 'You do not have any enrolled courses yet. Please add a course first.'}
              </p>
            ) : (
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733]/90 text-white focus:border-[#0075ff] focus:ring-2 focus:ring-[#0075ff]/40 focus:outline-hidden transition-all font-medium"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id} className="bg-[#051329] text-white">
                    {course.code} — {course.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
                {t('dueDate')} <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733]/90 text-white focus:border-[#0075ff] focus:ring-2 focus:ring-[#0075ff]/40 focus:outline-hidden font-mono transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                {t('dueTime')}
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733]/90 text-white focus:border-[#0075ff] focus:ring-2 focus:ring-[#0075ff]/40 focus:outline-hidden font-mono transition-all"
              />
            </div>
          </div>

          {/* Priority & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
                {t('priority')}
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#071936] rounded-2xl border border-[#113264]">
                {(['low', 'medium', 'high'] as AssignmentPriority[]).map(p => {
                  const label = p === 'high' ? t('highPriority') : p === 'medium' ? t('mediumPriority') : t('lowPriority');
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        priority === p
                          ? p === 'high'
                            ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                            : p === 'medium'
                            ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(217,119,6,0.5)]'
                            : 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(5,150,105,0.5)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('points')}
              </label>
              <input
                type="number"
                min={5}
                max={500}
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733]/90 text-white focus:border-[#0075ff] focus:ring-2 focus:ring-[#0075ff]/40 focus:outline-hidden transition-all font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('assignmentDescLabel')}
            </label>
            <textarea
              rows={3}
              placeholder={language === 'th' ? 'ระบุรายละเอียดคำสั่ง ข้อกำหนด รูปแบบไฟล์ หรือเกณฑ์การให้คะแนน...' : 'Detail submission requirements, formatting, guidelines, or rubrics...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733]/90 text-white placeholder:text-slate-500 focus:border-[#0075ff] focus:ring-2 focus:ring-[#0075ff]/40 focus:outline-hidden transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#0d274f]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-[#081d3f] rounded-2xl transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={courses.length === 0}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] disabled:opacity-50 rounded-2xl shadow-[0_0_22px_rgba(0,117,255,0.5)] ring-1 ring-blue-300/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
