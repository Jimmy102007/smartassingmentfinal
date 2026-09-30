import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sun, 
  Moon, 
  UserPlus, 
  LogIn, 
  Lock, 
  User, 
  Mail, 
  Sparkles, 
  X, 
  AlertCircle,
  Clock,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_STUDENTS } from '../data/seedData';
import { AppLogo } from '../components/AppLogo';
import { UserAccount } from '../types';

const AVATAR_PALETTES = [
  { label: 'Deep Blue Cyan', class: 'from-blue-600 via-[#0075ff] to-cyan-400' },
  { label: 'Purple Indigo', class: 'from-purple-600 via-indigo-600 to-blue-500' },
  { label: 'Emerald Teal', class: 'from-emerald-500 via-teal-600 to-cyan-500' },
  { label: 'Pink Rose', class: 'from-pink-500 via-rose-600 to-purple-600' },
  { label: 'Amber Orange', class: 'from-amber-500 via-orange-500 to-rose-500' },
  { label: 'Violet Fuchsia', class: 'from-violet-600 via-fuchsia-600 to-pink-500' },
];

export const LoginPage: React.FC = () => {
  const { 
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsDemo,
    rememberedAccounts, 
    removeRememberedAccount, 
    theme, 
    toggleTheme, 
    language, 
    toggleLanguage, 
    t 
  } = useApp();

  const isThai = language === 'th';
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up Form States
  const [regId, setRegId] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regMajor, setRegMajor] = useState('');
  const [regSemester, setRegSemester] = useState('');
  const [regUniversity, setRegUniversity] = useState('');
  const [regAvatarColor, setRegAvatarColor] = useState(AVATAR_PALETTES[0].class);

  // Error & Feedback
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Google Login
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle Email Sign In Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg(isThai ? 'กรุณากรอกอีเมลและรหัสผ่าน' : 'Please enter email and password.');
      return;
    }

    setIsLoading(true);
    const res = await loginWithEmail(email.trim(), password);
    setIsLoading(false);

    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regEmail.trim()) {
      setErrorMsg(isThai ? 'กรุณาระบุอีเมล' : 'Please enter email address.');
      return;
    }
    if (!regId.trim()) {
      setErrorMsg(isThai ? 'กรุณาระบุรหัสนักศึกษา' : 'Please enter your Student ID.');
      return;
    }
    if (!regName.trim()) {
      setErrorMsg(isThai ? 'กรุณาระบุชื่อ-นามสกุลนักศึกษา' : 'Please enter your full name.');
      return;
    }
    if (!regPassword) {
      setErrorMsg(isThai ? 'กรุณาตั้งรหัสผ่าน' : 'Please enter a password.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg(isThai ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg(isThai ? 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await registerWithEmail({
      id: regId,
      name: regName,
      email: regEmail,
      password: regPassword,
      major: regMajor || (isThai ? 'วิทยาการคอมพิวเตอร์และนวัตกรรม' : 'Computer Science & AI'),
      semester: regSemester || (isThai ? 'ภาคการศึกษาที่ 1 · ชั้นปีที่ 1' : 'Semester 1 · Year 1'),
      university: regUniversity || (isThai ? 'มหาวิทยาลัยขอนแก่น (Khon Kaen University)' : 'Khon Kaen University'),
      avatarColor: regAvatarColor,
    });
    setIsLoading(false);

    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#030d1d] text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden transition-colors selection:bg-[#0075ff] selection:text-white">
      {/* Top Controls: Dark/Light Mode & Language Switch */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-2xl bg-[#081d3f] border border-[#14376b] text-[#38bdf8] text-xs font-bold hover:bg-[#0c2b5c] transition-colors cursor-pointer shadow-xs"
        >
          {isThai ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 px-3 rounded-2xl bg-[#081d3f] border border-[#14376b] text-slate-300 hover:text-white hover:bg-[#0c2b5c] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs"
        >
          {theme === 'dark' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#38bdf8] fill-current" />
              <span className="hidden sm:inline">{t('darkMode')}</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('lightMode')}</span>
            </>
          )}
        </button>
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0075ff]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        {/* Brand Icon & Heading */}
        <div className="text-center flex flex-col items-center">
          <div className="mb-3 transform hover:scale-105 transition-transform">
            <AppLogo size="xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Smart <span className="text-[#38bdf8]">Assignment</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
            {isThai 
              ? 'ระบบการบ้านและรายวิชา พร้อม Firebase Auth & Firestore คลาวด์' 
              : 'University Smart Course & Assignment Platform with Firebase'}
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="mt-6 bg-[#051329]/95 backdrop-blur-xl py-7 px-5 sm:px-8 shadow-2xl rounded-3xl border border-[#0e2c5a] transition-colors">
          
          {/* Google Sign In Button - Prominent */}
          <div className="mb-6">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-2xl text-xs font-black text-slate-900 bg-white hover:bg-slate-100 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isThai ? 'เข้าสู่ระบบด้วยบัญชี Google' : 'Sign in with Google'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0e2c5a]"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-[#051329] px-2 text-slate-400 font-bold">
                  {isThai ? 'หรือใช้อีเมลและรหัสผ่าน' : 'Or with Email & Password'}
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Mode Tabs: [ เข้าสู่ระบบ ] | [ สมัครสมาชิกใหม่ ] */}
          <div className="flex items-center p-1 bg-[#071936] rounded-2xl border border-[#113264] mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#0075ff] text-white shadow-[0_0_15px_rgba(0,117,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('tabSignIn')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#0075ff] text-white shadow-[0_0_15px_rgba(0,117,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('tabSignUp')}</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-950/70 border border-rose-800 rounded-2xl text-xs text-rose-200 font-bold space-y-2 animate-modal-scale-fade">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="flex-1 leading-snug">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* ================= MODE 1: SIGN IN WITH EMAIL ================= */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{isThai ? 'อีเมล' : 'Email Address'}</span>
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden transition-all text-white placeholder:text-slate-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{t('password')}</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden transition-all text-white placeholder:text-slate-500 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] shadow-[0_0_20px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t('signInButton')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400 font-medium">
                  {t('dontHaveAccount')}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-[#38bdf8] hover:underline cursor-pointer ml-1"
                >
                  {t('tabSignUp')}
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 2: SIGN UP WITH EMAIL (Creates users/{uid}) ================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-[11px] text-blue-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>
                  {isThai 
                    ? 'สร้างบัญชีใหม่จะบันทึกโปรไฟล์ไปที่ Firestore ที่ users/{uid} และเปิดพื้นที่จัดเก็บวิชา/การบ้านแยกเฉพาะคุณ' 
                    : 'Registers your account and creates users/{uid} profile in Firestore.'}
                </span>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{isThai ? 'อีเมล' : 'Email Address'} <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@kkumail.com หรือ your.email@gmail.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden text-white placeholder:text-slate-500"
                />
              </div>

              {/* Student ID & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('studentId')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 663040123-4"
                    value={regId}
                    onChange={e => setRegId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden text-white font-mono placeholder:text-slate-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('studentFullName')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isThai ? 'เช่น กิตติพงษ์ สิทธิชัย' : 'e.g. Jane Doe'}
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('password')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('confirmPassword')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="ยืนยันรหัสผ่าน"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Major & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('facultyAndMajor')}
                  </label>
                  <input
                    type="text"
                    placeholder={isThai ? 'เช่น วิทยาการคอมพิวเตอร์' : 'e.g. Computer Science'}
                    value={regMajor}
                    onChange={e => setRegMajor(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('semester')}
                  </label>
                  <input
                    type="text"
                    placeholder={isThai ? 'เช่น เทอม 1 / ชั้นปีที่ 1' : 'e.g. Term 1 / Year 1'}
                    value={regSemester}
                    onChange={e => setRegSemester(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-2xl border border-[#113264] bg-[#071733] focus:border-[#0075ff] focus:outline-hidden text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isThai ? 'เลือกสีอวาตาร์' : 'Avatar Color'}
                </label>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${regAvatarColor} text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0`}>
                    {regName.trim() ? regName.trim().charAt(0) : 'S'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_PALETTES.map(p => (
                      <button
                        key={p.class}
                        type="button"
                        onClick={() => setRegAvatarColor(p.class)}
                        className={`w-5 h-5 rounded-md bg-gradient-to-br ${p.class} transition-all cursor-pointer ${
                          regAvatarColor === p.class ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                        }`}
                        title={p.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-white bg-[#0075ff] hover:bg-[#0066e0] shadow-[0_0_20px_rgba(0,117,255,0.45)] ring-1 ring-blue-300/40 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t('createAccountBtn')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400 font-medium">
                  {t('alreadyHaveAccount')}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-[#38bdf8] hover:underline cursor-pointer ml-1"
                >
                  {t('tabSignIn')}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Test Access */}
          <div className="mt-6 pt-4 border-t border-[#0d274f]">
            <details className="group/details text-xs">
              <summary className="font-bold text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-between select-none">
                <span>{isThai ? 'ทดสอบด้วยบัญชีตัวอย่าง (Demo Preview)' : 'Test with Demo Profile'}</span>
                <span className="text-slate-500 group-open/details:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-2 pt-1">
                {DEMO_STUDENTS.map(student => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => loginAsDemo(student.id)}
                    className="w-full p-2.5 rounded-2xl border border-[#0e2c5a] hover:border-blue-400/60 bg-[#071936]/60 hover:bg-[#092246] transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${student.avatarColor} text-white font-black text-xs flex items-center justify-center`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{student.id}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400">
                      {isThai ? 'เข้าใช้งาน' : 'Enter'} &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </details>
          </div>
        </div>

        {/* Security Note Footer */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Firebase Authentication & Cloud Firestore (smart-assignment-1b6b6)</span>
          </p>
        </div>
      </div>
    </div>
  );
};
