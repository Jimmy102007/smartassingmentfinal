import React, { useState } from 'react';
import { X, BookOpen, User, Mail, Clock, MapPin, Award, Check, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourseIconType } from '../../types';
import { CourseIcon } from '../CourseIcon';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS: CourseIconType[] = [
  'code',
  'cpu',
  'database',
  'palette',
  'calculator',
  'globe',
  'atom',
  'book-open',
  'briefcase',
];

const AVAILABLE_COLORS: ('purple' | 'blue' | 'pink' | 'indigo')[] = [
  'purple',
  'blue',
  'pink',
  'indigo',
];

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose }) => {
  const { addCourse, language, t } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [schedule, setSchedule] = useState(language === 'th' ? 'จันทร์ & พุธ · 10:00 - 11:30 น.' : 'Mon & Wed · 10:00 AM – 11:30 AM');
  const [officeHours, setOfficeHours] = useState(language === 'th' ? 'อังคาร · 14:00 - 16:00 น.' : 'Tue · 2:00 PM – 4:00 PM');
  const [room, setRoom] = useState(language === 'th' ? 'อาคาร 4 · ห้อง 201' : 'Hall C · Rm 201');
  const [credits, setCredits] = useState<number>(3);
  const [icon, setIcon] = useState<CourseIconType>('code');
  const [color, setColor] = useState<'purple' | 'blue' | 'pink' | 'indigo'>('blue');
  const [description, setDescription] = useState('');
  const [syllabusInput, setSyllabusInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !teacher.trim()) {
      return;
    }

    const defaultTopics = language === 'th'
      ? ['หลักการพื้นฐานและระเบียบวิธีวิจัย', 'การประยุกต์ใช้งานและการทดลองในห้องปฏิบัติการ', 'โครงงานและผลงานวิชาการ']
      : ['Fundamental principles & core methodology', 'Applied analysis and lab practicals', 'Midterm capstone project'];

    const syllabusTopics = syllabusInput
      ? syllabusInput.split('\n').map(s => s.trim()).filter(Boolean)
      : defaultTopics;

    addCourse({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      teacher: teacher.trim(),
      teacherEmail: teacherEmail.trim() || `${teacher.trim().toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      schedule,
      officeHours,
      room,
      credits: Number(credits) || 3,
      icon,
      color,
      description: description.trim() || (language === 'th' ? `เนื้อหารายวิชาครอบคลุมทฤษฎีและการประยุกต์ใช้งานเชิงปฏิบัติการในวิชา ${name.trim()}` : `Coursework covering foundations and practical applications in ${name.trim()}.`),
      syllabusTopics,
    });

    // Reset fields
    setName('');
    setCode('');
    setTeacher('');
    setTeacherEmail('');
    setDescription('');
    setSyllabusInput('');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#051329] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#0e2c5a] overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#0d274f] flex items-center justify-between bg-slate-50 dark:bg-[#071936]">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 bg-blue-100 dark:bg-[#0075ff]/20 text-blue-600 dark:text-[#38bdf8] rounded-xl border border-blue-200 dark:border-[#113264]">
                <BookOpen className="w-4 h-4" />
              </span>
              {t('addNewCourse')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'th' ? 'ลงทะเบียนรายวิชาใหม่ อาจารย์ผู้สอน ตารางเรียน และไอคอนวิชา' : 'Add a university course with instructor, schedule, and custom icon.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#081d3f] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Course Name and Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'th' ? 'ชื่อรายวิชา' : 'Course Name'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={language === 'th' ? 'เช่น ปัญญาประดิษฐ์และโครงข่ายประสาท' : 'e.g. Artificial Intelligence & Neural Systems'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'th' ? 'รหัสวิชา' : 'Course Code'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS 420"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] uppercase focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Teacher and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-500" />
                {language === 'th' ? 'ชื่ออาจารย์ผู้สอน' : 'Teacher Name'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={language === 'th' ? 'เช่น ผศ.ดร. ธนกฤต มงคลสุข' : 'e.g. Prof. Rachel Hayes'}
                value={teacher}
                onChange={e => setTeacher(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                {language === 'th' ? 'อีเมลอาจารย์' : 'Teacher Email'}
              </label>
              <input
                type="email"
                placeholder="teacher@university.edu"
                value={teacherEmail}
                onChange={e => setTeacherEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Schedule, Room & Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {language === 'th' ? 'วัน-เวลาเรียน' : 'Lecture Schedule'}
              </label>
              <input
                type="text"
                placeholder="Mon & Wed · 10-11:30 AM"
                value={schedule}
                onChange={e => setSchedule(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {language === 'th' ? 'ห้องเรียน' : 'Classroom / Hall'}
              </label>
              <input
                type="text"
                placeholder="Hall B · Rm 204"
                value={room}
                onChange={e => setRoom(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                {t('credits')}
              </label>
              <select
                value={credits}
                onChange={e => setCredits(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              >
                <option value={1}>1 {t('credits')}</option>
                <option value={2}>2 {t('credits')}</option>
                <option value={3}>3 {t('credits')}</option>
                <option value={4}>4 {t('credits')}</option>
                <option value={5}>5 {t('credits')}</option>
              </select>
            </div>
          </div>

          {/* Icon & Theme Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'th' ? 'ไอคอนวิชา' : 'Course Icon'}
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ICONS.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setIcon(item)}
                    className={`p-2 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                      icon === item
                        ? 'border-[#0075ff] bg-blue-50 dark:bg-[#0075ff]/20 text-blue-600 dark:text-[#38bdf8] ring-2 ring-blue-400/40'
                        : 'border-slate-200 dark:border-[#113264] text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-[#1a468a] bg-white dark:bg-[#071936]'
                    }`}
                  >
                    <CourseIcon icon={item} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'th' ? 'สีประจำวิชา' : 'Theme Accent'}
              </label>
              <div className="flex items-center gap-2">
                {AVAILABLE_COLORS.map(c => {
                  const colorMap = {
                    purple: 'bg-indigo-600',
                    blue: 'bg-blue-600',
                    pink: 'bg-rose-500',
                    indigo: 'bg-cyan-600',
                  };
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full ${colorMap[c]} flex items-center justify-center text-white transition-transform cursor-pointer ${
                        color === c ? 'scale-110 ring-2 ring-offset-2 dark:ring-offset-[#051329] ring-blue-400' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {color === c && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'th' ? 'รายละเอียดวิชา' : 'Course Description'}
            </label>
            <textarea
              rows={2}
              placeholder={language === 'th' ? 'วัตถุประสงค์และขอบเขตเนื้อหารายวิชา...' : 'Brief course objectives and syllabus scope...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden resize-none"
            />
          </div>

          {/* Syllabus Topics */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'th' ? 'หัวข้อหลักในหลักสูตร (บรรทัดละ 1 หัวข้อ)' : 'Key Syllabus Topics (one per line)'}
            </label>
            <textarea
              rows={2}
              placeholder={language === 'th' ? 'สัปดาห์ 1-3: พื้นฐานระบบสารสนเทศ&#10;สัปดาห์ 4-7: การวิเคราะห์และออกแบบโครงสร้าง&#10;สัปดาห์ 8-12: โครงงานประยุกต์' : 'Week 1-3: Foundations&#10;Week 4-7: Advanced Algorithms&#10;Week 8-12: Capstone Project'}
              value={syllabusInput}
              onChange={e => setSyllabusInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden resize-none font-mono"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#0d274f]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#081d3f] rounded-2xl transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] rounded-2xl shadow-[0_0_18px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              <span>{t('enrollCourse')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
