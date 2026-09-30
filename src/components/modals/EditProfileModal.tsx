import React, { useState, useEffect } from 'react';
import { X, UserCheck, Mail, BookOpen, GraduationCap, Building2, Phone, Palette, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PALETTES = [
  { label: 'Deep Blue Cyan', class: 'from-blue-600 to-cyan-400' },
  { label: 'Purple Indigo', class: 'from-purple-600 to-indigo-600' },
  { label: 'Pink Rose', class: 'from-pink-500 to-rose-600' },
  { label: 'Emerald Teal', class: 'from-emerald-500 to-teal-500' },
  { label: 'Violet Fuchsia', class: 'from-violet-600 to-fuchsia-600' },
  { label: 'Amber Orange', class: 'from-amber-500 to-orange-500' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, updateProfile, language, t } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [semester, setSemester] = useState('');
  const [university, setUniversity] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarColor, setAvatarColor] = useState('');

  useEffect(() => {
    if (currentStudent) {
      setName(currentStudent.name || '');
      setEmail(currentStudent.email || '');
      setMajor(currentStudent.major || '');
      setSemester(currentStudent.semester || '');
      setUniversity(currentStudent.university || (language === 'th' ? 'มหาวิทยาลัยเทคโนโลยีแห่งชาติ' : 'State University of Technology'));
      setAdvisor(currentStudent.advisor || '');
      setPhone(currentStudent.phone || '');
      setAvatarColor(currentStudent.avatarColor || 'from-blue-600 to-cyan-400');
    }
  }, [currentStudent, isOpen, language]);

  if (!isOpen || !currentStudent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      major: major.trim(),
      semester: semester.trim(),
      university: university.trim(),
      advisor: advisor.trim(),
      phone: phone.trim(),
      avatarColor,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#051329] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#0e2c5a] overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#0d274f] flex items-center justify-between bg-slate-50 dark:bg-[#071936]">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 bg-blue-100 dark:bg-[#0075ff]/20 text-blue-600 dark:text-[#38bdf8] rounded-xl border border-blue-200 dark:border-[#113264]">
                <UserCheck className="w-4 h-4" />
              </span>
              {t('editProfile')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'th' ? 'อัปเดตข้อมูลส่วนตัวและข้อมูลทางวิชาการของนักศึกษา' : 'Update your personal and academic credentials.'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Avatar Preview & Palette Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-500" />
              {language === 'th' ? 'ธีมสีรูปโปรไฟล์' : 'Profile Avatar Theme'}
            </label>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor} text-white text-xl font-black flex items-center justify-center shadow-md shrink-0`}>
                {name.charAt(0) || 'S'}
              </div>
              <div className="flex flex-wrap gap-2">
                {AVATAR_PALETTES.map(p => (
                  <button
                    key={p.class}
                    type="button"
                    onClick={() => setAvatarColor(p.class)}
                    className={`w-7 h-7 rounded-xl bg-gradient-to-br ${p.class} transition-all cursor-pointer ${
                      avatarColor === p.class ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#051329] scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={p.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('studentFullName')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('studentId')}
              </label>
              <input
                type="text"
                disabled
                value={currentStudent.id}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-100 dark:bg-[#081d3f]/60 text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                {t('phone')}
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                {t('major')}
              </label>
              <input
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                {t('semester')}
              </label>
              <input
                type="text"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                {t('university')}
              </label>
              <input
                type="text"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('advisor')}
              </label>
              <input
                type="text"
                value={advisor}
                onChange={e => setAdvisor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 dark:border-[#113264] bg-slate-50 dark:bg-[#071733] text-slate-900 dark:text-white focus:border-[#0075ff] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#0d274f]">
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
              <Save className="w-3.5 h-3.5" />
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
