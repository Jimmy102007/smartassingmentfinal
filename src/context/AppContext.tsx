import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { Student, Course, Assignment, NavigationPage, ThemeMode, Language, UserAccount } from '../types';
import { translations, TranslationKey } from '../utils/translations';
import { parseDueAt } from '../utils/deadline';
import { DEMO_STUDENTS, DEMO_COURSES_ALEX, DEMO_ASSIGNMENTS_ALEX } from '../data/seedData';

export interface RegisterInput {
  id: string;
  name: string;
  email: string;
  password?: string;
  major?: string;
  semester?: string;
  university?: string;
  advisor?: string;
  phone?: string;
  avatarColor?: string;
  rememberMe?: boolean;
}

interface AppContextType {
  // Authentication & Active Student
  currentUser: FirebaseUser | null;
  currentStudent: Student | null;
  isLoggedIn: boolean;
  authLoading: boolean;

  // Firebase Auth methods
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (data: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  login: (identifier: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (studentId: string) => void;
  logout: () => Promise<void>;
  updateProfile: (updatedProfile: Partial<Student>) => Promise<void>;

  // Remembered accounts on device
  registeredAccounts: UserAccount[];
  rememberedAccounts: UserAccount[];
  removeRememberedAccount: (accountId: string) => void;
  quickSwitchAccount: (accountId: string) => void;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Language (TH / EN)
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;

  // Navigation
  currentPage: NavigationPage;
  selectedCourseId: string | null;
  navigateTo: (page: NavigationPage, courseId?: string) => void;

  // Courses (stored at users/{uid}/courses)
  courses: Course[];
  selectedCourse: Course | null;
  addCourse: (courseData: Omit<Course, 'id' | 'createdAt'>) => Promise<Course>;
  deleteCourse: (courseId: string) => Promise<void>;

  // Assignments (stored at users/{uid}/assignments)
  assignments: Assignment[];
  addAssignment: (assignmentData: Omit<Assignment, 'id'>) => Promise<Assignment>;
  toggleAssignmentStatus: (assignmentId: string) => Promise<void>;
  submitAssignment: (
    assignmentId: string, 
    notes: string, 
    fileData?: { name: string; size: string }, 
    link?: string
  ) => Promise<void>;
  deleteAssignment: (assignmentId: string) => Promise<void>;

  // Submit Modal state
  submittingAssignment: Assignment | null;
  openSubmitModal: (assignment: Assignment) => void;
  closeSubmitModal: () => void;

  // Add Assignment Modal state
  isAddAssignmentModalOpen: boolean;
  setIsAddAssignmentModalOpen: (open: boolean) => void;

  // Stats
  totalCoursesCount: number;
  pendingAssignmentsCount: number;
  completedAssignmentsCount: number;
  highPriorityAssignmentsCount: number;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_ACTIVE_STUDENT_KEY = 'smart_assignment_active_student_id';
const STORAGE_REGISTERED_ACCOUNTS_KEY = 'smart_assignment_registered_accounts';
const STORAGE_REMEMBERED_ACCOUNTS_KEY = 'smart_assignment_remembered_accounts';
const STORAGE_THEME_KEY = 'smart_assignment_theme';
const STORAGE_LANG_KEY = 'smart_assignment_language';

// Helper to sort assignments by deadline (dueAt ascending)
const sortAssignments = (list: Assignment[]): Assignment[] => {
  return [...list].sort((a, b) => {
    const timeA = parseDueAt(a).getTime();
    const timeB = parseDueAt(b).getTime();
    return timeA - timeB;
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<NavigationPage>('login');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);

  // Demo user mode flag
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Language State - Default to 'th' (Thai)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    return (saved === 'th' || saved === 'en') ? saved : 'th';
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    showToast(lang === 'th' ? '🇹🇭 เปลี่ยนภาษาเป็น: ภาษาไทย' : '🇬🇧 Switched to: English');
  };

  const toggleLanguage = () => {
    const nextLang = language === 'th' ? 'en' : 'th';
    setLanguage(nextLang);
  };

  const t = useCallback((key: TranslationKey): string => {
    const dict = translations[language] || translations.th;
    return dict[key] || translations.en[key] || (key as string);
  }, [language]);

  // Theme State - Default to 'dark'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      showToast(nextTheme === 'dark' ? '🌙 เปลี่ยนเป็นโหมดมืด (Dark Theme)' : '☀️ เปลี่ยนเป็นโหมดสว่าง (Light Theme)');
      return nextTheme;
    });
  };

  // Remembered accounts in localStorage
  const [rememberedAccounts, setRememberedAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_REMEMBERED_ACCOUNTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_REGISTERED_ACCOUNTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const rememberAccountOnDevice = (student: Student) => {
    const acc: UserAccount = {
      id: student.id,
      username: student.email,
      student,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    const filtered = rememberedAccounts.filter(a => a.id !== student.id && a.username !== student.email);
    const updated = [acc, ...filtered];
    setRememberedAccounts(updated);
    localStorage.setItem(STORAGE_REMEMBERED_ACCOUNTS_KEY, JSON.stringify(updated));
  };

  const removeRememberedAccount = (accountId: string) => {
    const updated = rememberedAccounts.filter(a => a.id !== accountId);
    setRememberedAccounts(updated);
    localStorage.setItem(STORAGE_REMEMBERED_ACCOUNTS_KEY, JSON.stringify(updated));
    showToast(language === 'th' ? 'ลบประวัติบัญชีเรียบร้อยแล้ว' : 'Account removed from saved list');
  };

  // --- FIREBASE AUTH LISTENER & FIRESTORE REAL-TIME SUBSCRIPTIONS ---
  useEffect(() => {
    let unsubscribeCourses: (() => void) | null = null;
    let unsubscribeAssignments: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsDemoUser(false);
        setCurrentUser(fbUser);

        try {
          // 1. Fetch or create users/{uid} document
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let studentProfile: Student;

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            studentProfile = {
              id: data.studentId || fbUser.uid.substring(0, 10).toUpperCase(),
              uid: fbUser.uid,
              name: data.name || fbUser.displayName || 'University Student',
              email: fbUser.email || '',
              major: data.major || (language === 'th' ? 'วิทยาการคอมพิวเตอร์และนวัตกรรม' : 'Computer Science & AI'),
              semester: data.semester || (language === 'th' ? 'ภาคการศึกษาที่ 1 · ชั้นปีที่ 1' : 'Semester 1 · Year 1'),
              avatarColor: data.avatarColor || 'from-blue-600 via-[#0075ff] to-cyan-400',
              avatarUrl: fbUser.photoURL || data.avatarUrl,
              photoURL: fbUser.photoURL || undefined,
              gpa: data.gpa || '0.00',
              credits: data.credits || 0,
              totalCredits: data.totalCredits || 120,
              university: data.university || (language === 'th' ? 'มหาวิทยาลัยขอนแก่น (Khon Kaen University)' : 'Grandview Institute of Technology'),
              advisor: data.advisor || (language === 'th' ? 'อาจารย์ที่ปรึกษาประจำสาขา' : 'Academic Advisor'),
              phone: data.phone || '',
              enrolledSince: data.enrolledSince || new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }),
            };
          } else {
            // First time login for this user! Create users/{uid} document
            const studentId = `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
            studentProfile = {
              id: studentId,
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'New Student',
              email: fbUser.email || '',
              major: language === 'th' ? 'วิทยาการคอมพิวเตอร์และนวัตกรรม' : 'Computer Science & AI',
              semester: language === 'th' ? 'ภาคการศึกษาที่ 1 · ชั้นปีที่ 1' : 'Semester 1 · Year 1',
              avatarColor: 'from-blue-600 via-[#0075ff] to-cyan-400',
              avatarUrl: fbUser.photoURL || undefined,
              photoURL: fbUser.photoURL || undefined,
              gpa: '0.00',
              credits: 0,
              totalCredits: 120,
              university: language === 'th' ? 'มหาวิทยาลัยขอนแก่น (Khon Kaen University)' : 'Khon Kaen University',
              advisor: language === 'th' ? 'อาจารย์ที่ปรึกษาประจำสาขา' : 'Academic Advisor',
              phone: '',
              enrolledSince: new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }),
            };

            await setDoc(userDocRef, {
              uid: fbUser.uid,
              studentId: studentProfile.id,
              name: studentProfile.name,
              email: studentProfile.email,
              photoURL: fbUser.photoURL || null,
              avatarColor: studentProfile.avatarColor,
              major: studentProfile.major,
              semester: studentProfile.semester,
              gpa: studentProfile.gpa,
              credits: studentProfile.credits,
              totalCredits: studentProfile.totalCredits,
              university: studentProfile.university,
              advisor: studentProfile.advisor,
              phone: studentProfile.phone,
              enrolledSince: studentProfile.enrolledSince,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            }, { merge: true });
          }

          setCurrentStudent(studentProfile);
          rememberAccountOnDevice(studentProfile);
          localStorage.setItem(STORAGE_ACTIVE_STUDENT_KEY, fbUser.uid);

          // 2. Real-time subscription to users/{uid}/courses
          const coursesColRef = collection(db, 'users', fbUser.uid, 'courses');
          unsubscribeCourses = onSnapshot(coursesColRef, (snapshot) => {
            const courseList: Course[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data();
              courseList.push({
                id: docSnap.id,
                code: data.code || 'CS 101',
                name: data.name || 'Untitled Course',
                teacher: data.teacher || 'Instructor',
                teacherEmail: data.teacherEmail || '',
                officeHours: data.officeHours || '',
                room: data.room || '',
                schedule: data.schedule || '',
                credits: Number(data.credits) || 3,
                icon: data.icon || 'book-open',
                color: data.color || 'blue',
                description: data.description || '',
                syllabusTopics: data.syllabusTopics || [],
                createdAt: data.createdAt || new Date().toISOString().split('T')[0],
              });
            });
            setCourses(courseList);
          }, (err) => {
            console.error('Error listening to courses:', err);
          });

          // 3. Real-time subscription to users/{uid}/assignments
          // Sorted by dueAt ascending as requested ("แสดงงานเรียงตามกำหนดส่ง")
          const assignmentsColRef = collection(db, 'users', fbUser.uid, 'assignments');
          unsubscribeAssignments = onSnapshot(assignmentsColRef, (snapshot) => {
            const assignmentList: Assignment[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data();
              const dueAt = data.dueAt || (data.dueDate ? `${data.dueDate}T${data.dueTime || '23:59'}:00` : new Date().toISOString());
              const dueDate = data.dueDate || (dueAt ? dueAt.split('T')[0] : '');
              const dueTime = data.dueTime || (dueAt && dueAt.includes('T') ? dueAt.split('T')[1].substring(0, 5) : '23:59');

              assignmentList.push({
                id: docSnap.id,
                title: data.title || 'Untitled Assignment',
                course: data.course || data.courseName || data.courseCode || 'General',
                courseId: data.courseId || '',
                courseName: data.courseName || data.course || 'Course',
                courseCode: data.courseCode || (data.course ? data.course.split(' ')[0] : 'CS'),
                description: data.description || '',
                dueDate,
                dueTime,
                dueAt,
                status: data.status || 'pending',
                priority: data.priority || 'medium',
                points: Number(data.points) || 100,
                earnedScore: data.earnedScore !== undefined ? Number(data.earnedScore) : undefined,
                submittedAt: data.submittedAt || undefined,
                submissionNotes: data.submissionNotes || undefined,
                attachedLink: data.attachedLink || undefined,
                fileName: data.fileName || undefined,
                fileSize: data.fileSize || undefined,
              });
            });

            // Strictly sort by deadline
            setAssignments(sortAssignments(assignmentList));
          }, (err) => {
            console.error('Error listening to assignments:', err);
          });

          setCurrentPage(prev => (prev === 'login' ? 'home' : prev));
        } catch (err: any) {
          console.error('Auth initialization error:', err);
          showToast(`⚠️ เกิดข้อผิดพลาด: ${err.message || 'Firebase Error'}`);
        } finally {
          setAuthLoading(false);
        }
      } else {
        // User logged out
        if (unsubscribeCourses) unsubscribeCourses();
        if (unsubscribeAssignments) unsubscribeAssignments();

        setCurrentUser(null);
        if (!isDemoUser) {
          setCurrentStudent(null);
          setCourses([]);
          setAssignments([]);
          setCurrentPage('login');
        }
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeCourses) unsubscribeCourses();
      if (unsubscribeAssignments) unsubscribeAssignments();
    };
  }, []);

  // --- GOOGLE SIGN-IN ---
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Check / create users/{uid} document
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const studentId = `KKU-${new Date().getFullYear().toString().slice(-2)}${Math.floor(100000 + Math.random() * 900000)}`;
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          studentId,
          name: fbUser.displayName || 'Google Student',
          email: fbUser.email,
          photoURL: fbUser.photoURL || null,
          major: language === 'th' ? 'วิทยาการคอมพิวเตอร์และสารสนเทศ' : 'Computer Science & Information',
          semester: language === 'th' ? 'ภาคการศึกษาที่ 1 · ชั้นปีที่ 1' : 'Semester 1 · Year 1',
          university: 'มหาวิทยาลัยขอนแก่น (Khon Kaen University)',
          gpa: '0.00',
          credits: 0,
          totalCredits: 120,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        });
      } else {
        await updateDoc(userDocRef, {
          lastLoginAt: new Date().toISOString(),
        });
      }

      showToast(language === 'th' ? `🎉 ยินดีต้อนรับ ${fbUser.displayName || 'เข้าสู่ระบบ'}!` : `Welcome, ${fbUser.displayName}!`);
      return { success: true };
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      let errorMsg = err.message || 'Google sign in failed';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = language === 'th' ? 'หน้าต่างล็อกอินถูกปิด กรุณาลองใหม่อีกครั้ง' : 'Popup was closed before sign in.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = language === 'th' ? 'โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase Auth' : 'Domain not authorized in Firebase Console.';
      }
      showToast(`❌ ${errorMsg}`);
      return { success: false, error: errorMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  // --- EMAIL / PASSWORD SIGN-IN ---
  const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      
      // Update lastLoginAt
      const userDocRef = doc(db, 'users', result.user.uid);
      await updateDoc(userDocRef, {
        lastLoginAt: new Date().toISOString(),
      }).catch(() => {
        // Doc might be created by auth listener
      });

      showToast(language === 'th' ? 'เข้าสู่ระบบสำเร็จแล้ว!' : 'Signed in successfully!');
      return { success: true };
    } catch (err: any) {
      console.error('Email sign in error:', err);
      let errorMsg = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errorMsg = language === 'th' ? '❌ ไม่พบบัญชีนี้ หรือรหัสผ่านไม่ถูกต้อง กรุณาสมัครสมาชิกก่อน' : 'Invalid email or password.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = language === 'th' ? '❌ รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่' : 'Incorrect password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = language === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Invalid email format.';
      }
      return { success: false, error: errorMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  // --- EMAIL / PASSWORD SIGN-UP (create users/{uid}) ---
  const registerWithEmail = async (data: RegisterInput): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthLoading(true);
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanName = data.name.trim();
      const cleanId = data.id.trim().toUpperCase();

      if (!cleanEmail || !data.password) {
        return { success: false, error: language === 'th' ? 'กรุณากรอกอีเมลและรหัสผ่าน' : 'Email and password required' };
      }

      // 1. Create auth user in Firebase
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      const fbUser = result.user;

      // Update profile display name
      await updateFirebaseProfile(fbUser, { displayName: cleanName });

      // 2. Create document at users/{uid} as required!
      const userDocRef = doc(db, 'users', fbUser.uid);
      const newStudentDoc = {
        uid: fbUser.uid,
        studentId: cleanId,
        name: cleanName,
        email: cleanEmail,
        photoURL: null,
        avatarColor: data.avatarColor || 'from-blue-600 via-[#0075ff] to-cyan-400',
        major: data.major?.trim() || (language === 'th' ? 'วิทยาการคอมพิวเตอร์และนวัตกรรม' : 'Computer Science & AI'),
        semester: data.semester?.trim() || (language === 'th' ? 'ภาคการศึกษาที่ 1 · ชั้นปีที่ 1' : 'Semester 1 · Year 1'),
        university: data.university?.trim() || (language === 'th' ? 'มหาวิทยาลัยขอนแก่น (Khon Kaen University)' : 'Khon Kaen University'),
        advisor: data.advisor?.trim() || (language === 'th' ? 'อาจารย์ที่ปรึกษาประจำสาขา' : 'Academic Advisor'),
        phone: data.phone?.trim() || '',
        gpa: '0.00',
        credits: 0,
        totalCredits: 120,
        enrolledSince: new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, newStudentDoc);

      showToast(
        language === 'th' 
          ? `🎉 สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ ${cleanName} เริ่มต้นใช้งานระบบบันทึกงานใหม่ได้ทันที` 
          : `🎉 Account created! Welcome ${cleanName}.`
      );

      return { success: true };
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMsg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = language === 'th' ? '❌ อีเมลนี้ลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบ' : 'This email is already registered. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = language === 'th' ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = language === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Invalid email address.';
      }
      return { success: false, error: errorMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  // Backwards compatibility wrappers
  const login = async (identifier: string, password?: string, rememberMe?: boolean) => {
    // If identifier is an email:
    if (identifier.includes('@')) {
      return loginWithEmail(identifier, password || '');
    }
    // If user entered student id e.g. 663040123-4:
    // Try email formatted e.g. {id}@university.edu or student id match in remembered
    const guessedEmail = identifier.toLowerCase().replace(/[^a-z0-9]/g, '') + '@student.university.edu';
    return loginWithEmail(guessedEmail, password || '');
  };

  const register = async (data: RegisterInput) => {
    let email = data.email?.trim();
    if (!email || !email.includes('@')) {
      const cleanId = data.id.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      email = `${cleanId}@student.university.edu`;
    }
    return registerWithEmail({ ...data, email });
  };

  // Demo fallback mode for offline/quick preview
  const loginAsDemo = (studentId: string) => {
    setIsDemoUser(true);
    const demo = DEMO_STUDENTS.find(s => s.id === studentId) || DEMO_STUDENTS[0];
    setCurrentStudent(demo);
    setCourses(DEMO_COURSES_ALEX);
    setAssignments(sortAssignments(DEMO_ASSIGNMENTS_ALEX));
    setCurrentPage('home');
    showToast(language === 'th' ? `เข้าใช้งานในโหมดทดลอง: ${demo.name}` : `Demo mode: ${demo.name}`);
  };

  const quickSwitchAccount = (accountId: string) => {
    const acc = rememberedAccounts.find(a => a.id === accountId);
    if (acc) {
      setCurrentStudent(acc.student);
      setCurrentPage('home');
      showToast(language === 'th' ? `สลับบัญชี: ${acc.student.name}` : `Switched to: ${acc.student.name}`);
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem(STORAGE_ACTIVE_STUDENT_KEY);
    setCurrentUser(null);
    setCurrentStudent(null);
    setCourses([]);
    setAssignments([]);
    setIsDemoUser(false);
    setCurrentPage('login');
    showToast(language === 'th' ? 'ออกจากระบบเรียบร้อยแล้ว' : 'Logged out successfully');
  };

  // Update profile
  const updateProfile = async (updated: Partial<Student>) => {
    if (!currentStudent) return;
    const newProfile = { ...currentStudent, ...updated };
    setCurrentStudent(newProfile);

    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          name: newProfile.name,
          major: newProfile.major,
          semester: newProfile.semester,
          university: newProfile.university,
          advisor: newProfile.advisor,
          phone: newProfile.phone || '',
          avatarColor: newProfile.avatarColor,
          gpa: newProfile.gpa,
        }, { merge: true });
      } catch (err) {
        console.error('Failed to update Firestore profile:', err);
      }
    }
    showToast(language === 'th' ? 'บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!' : 'Profile updated and saved!');
  };

  // Navigation
  const navigateTo = (page: NavigationPage, courseId?: string) => {
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- COURSE ACTIONS: users/{uid}/courses ---
  const addCourse = async (courseData: Omit<Course, 'id' | 'createdAt'>): Promise<Course> => {
    const courseId = `course-${Date.now()}`;
    const newCourse: Course = {
      ...courseData,
      id: courseId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (currentUser) {
      try {
        const courseDocRef = doc(db, 'users', currentUser.uid, 'courses', courseId);
        await setDoc(courseDocRef, {
          code: newCourse.code,
          name: newCourse.name,
          teacher: newCourse.teacher,
          teacherEmail: newCourse.teacherEmail,
          officeHours: newCourse.officeHours,
          room: newCourse.room,
          schedule: newCourse.schedule,
          credits: newCourse.credits,
          icon: newCourse.icon,
          color: newCourse.color,
          description: newCourse.description,
          syllabusTopics: newCourse.syllabusTopics || [],
          createdAt: newCourse.createdAt,
        });
      } catch (err) {
        console.error('Error saving course to Firestore:', err);
      }
    } else {
      // Local state fallback for demo
      setCourses(prev => [newCourse, ...prev]);
    }

    showToast(language === 'th' ? `ลงทะเบียนวิชา "${newCourse.name}" เรียบร้อยแล้ว!` : `Course "${newCourse.name}" added!`);
    return newCourse;
  };

  const deleteCourse = async (courseId: string) => {
    const target = courses.find(c => c.id === courseId);

    if (currentUser) {
      try {
        const courseDocRef = doc(db, 'users', currentUser.uid, 'courses', courseId);
        await deleteDoc(courseDocRef);

        // Also delete any assignments under this course
        const courseAssignments = assignments.filter(a => a.courseId === courseId);
        for (const assign of courseAssignments) {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'assignments', assign.id)).catch(() => {});
        }
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    } else {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setAssignments(prev => prev.filter(a => a.courseId !== courseId));
    }

    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setCurrentPage('courses');
    }
    showToast(language === 'th' ? `ถอนวิชา "${target?.name || courseId}" แล้ว` : `Removed course "${target?.name || courseId}"`);
  };

  // --- ASSIGNMENT ACTIONS: users/{uid}/assignments ---
  // Mandatory fields: title, course, description, dueAt, status, priority, submittedAt
  const addAssignment = async (assignmentData: Omit<Assignment, 'id'>): Promise<Assignment> => {
    const assignId = `assign-${Date.now()}`;
    const time = assignmentData.dueTime || '23:59';
    const cleanTime = time.includes(':') ? time : `${time}:00`;
    const dueAt = assignmentData.dueAt || `${assignmentData.dueDate}T${cleanTime.length === 5 ? cleanTime + ':00' : cleanTime}`;
    const courseTitle = assignmentData.course || `${assignmentData.courseCode} - ${assignmentData.courseName}`;

    const newAssignment: Assignment = {
      ...assignmentData,
      id: assignId,
      course: courseTitle,
      dueAt,
      status: assignmentData.status || 'pending',
    };

    if (currentUser) {
      try {
        const assignDocRef = doc(db, 'users', currentUser.uid, 'assignments', assignId);
        await setDoc(assignDocRef, {
          title: newAssignment.title,
          course: newAssignment.course,
          courseId: newAssignment.courseId,
          courseCode: newAssignment.courseCode,
          courseName: newAssignment.courseName,
          description: newAssignment.description,
          dueAt: newAssignment.dueAt,
          dueDate: newAssignment.dueDate,
          dueTime: newAssignment.dueTime,
          status: newAssignment.status,
          priority: newAssignment.priority,
          points: newAssignment.points,
          submittedAt: null,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error saving assignment to Firestore:', err);
      }
    } else {
      setAssignments(prev => sortAssignments([newAssignment, ...prev]));
    }

    showToast(language === 'th' ? `เพิ่มการบ้าน "${newAssignment.title}" สำเร็จ!` : `Added assignment "${newAssignment.title}"`);
    return newAssignment;
  };

  const toggleAssignmentStatus = async (assignmentId: string) => {
    const current = assignments.find(a => a.id === assignmentId);
    if (!current) return;

    const isDone = current.status === 'submitted' || current.status === 'completed';
    const nextStatus: 'pending' | 'submitted' = isDone ? 'pending' : 'submitted';
    const submittedAt = nextStatus === 'submitted' 
      ? new Date().toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'short', day: 'numeric' }) + ' · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;

    if (currentUser) {
      try {
        const assignDocRef = doc(db, 'users', currentUser.uid, 'assignments', assignmentId);
        await updateDoc(assignDocRef, {
          status: nextStatus,
          submittedAt: submittedAt || null,
          earnedScore: nextStatus === 'submitted' ? (current.earnedScore || current.points) : null,
        });
      } catch (err) {
        console.error('Error updating assignment status in Firestore:', err);
      }
    } else {
      setAssignments(prev => prev.map(item => {
        if (item.id === assignmentId) {
          return {
            ...item,
            status: nextStatus,
            submittedAt: submittedAt || undefined,
            earnedScore: nextStatus === 'submitted' ? (item.earnedScore || item.points) : undefined,
          };
        }
        return item;
      }));
    }

    if (nextStatus === 'submitted') {
      showToast(language === 'th' ? `🎉 ส่งงาน "${current.title}" เรียบร้อยแล้ว` : `Marked as submitted: "${current.title}"`);
    } else {
      showToast(language === 'th' ? `เปลี่ยนสถานะเป็น ยังไม่ส่ง สำหรับ "${current.title}"` : `Status set to Pending for "${current.title}"`);
    }
  };

  const submitAssignment = async (
    assignmentId: string, 
    notes: string, 
    fileData?: { name: string; size: string }, 
    link?: string
  ) => {
    const current = assignments.find(a => a.id === assignmentId);
    const submittedAt = new Date().toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'short', day: 'numeric' }) + ' · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (currentUser) {
      try {
        const assignDocRef = doc(db, 'users', currentUser.uid, 'assignments', assignmentId);
        await updateDoc(assignDocRef, {
          status: 'submitted',
          submittedAt,
          submissionNotes: notes || '',
          attachedLink: link || '',
          fileName: fileData?.name || current?.fileName || 'deliverable.pdf',
          fileSize: fileData?.size || current?.fileSize || '1.2 MB',
          earnedScore: current?.earnedScore || current?.points || 100,
        });
      } catch (err) {
        console.error('Error submitting assignment in Firestore:', err);
      }
    } else {
      setAssignments(prev => prev.map(item => {
        if (item.id === assignmentId) {
          return {
            ...item,
            status: 'submitted',
            submittedAt,
            submissionNotes: notes,
            attachedLink: link,
            fileName: fileData?.name || item.fileName || 'deliverable.pdf',
            fileSize: fileData?.size || item.fileSize || '1.2 MB',
            earnedScore: item.earnedScore || item.points,
          };
        }
        return item;
      }));
    }

    showToast(language === 'th' ? 'ส่งงานเรียบร้อยแล้ว! สถานะเปลี่ยนเป็น ส่งแล้ว' : 'Assignment submitted successfully!');
  };

  const deleteAssignment = async (assignmentId: string) => {
    const target = assignments.find(a => a.id === assignmentId);

    if (currentUser) {
      try {
        const assignDocRef = doc(db, 'users', currentUser.uid, 'assignments', assignmentId);
        await deleteDoc(assignDocRef);
      } catch (err) {
        console.error('Error deleting assignment in Firestore:', err);
      }
    } else {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    }

    showToast(language === 'th' ? `ลบการบ้าน "${target?.title || ''}" แล้ว` : `Removed assignment "${target?.title || ''}"`);
  };

  const openSubmitModal = (assignment: Assignment) => {
    setSubmittingAssignment(assignment);
  };

  const closeSubmitModal = () => {
    setSubmittingAssignment(null);
  };

  // Stats calculation
  const totalCoursesCount = courses.length;
  const pendingAssignmentsCount = assignments.filter(a => a.status === 'pending').length;
  const completedAssignmentsCount = assignments.filter(a => a.status === 'submitted' || a.status === 'completed').length;
  const highPriorityAssignmentsCount = assignments.filter(a => a.status === 'pending' && a.priority === 'high').length;

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentStudent,
        isLoggedIn: !!currentStudent,
        authLoading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        registeredAccounts,
        rememberedAccounts,
        removeRememberedAccount,
        quickSwitchAccount,
        theme,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        t,
        currentPage,
        selectedCourseId,
        navigateTo,
        courses,
        selectedCourse,
        addCourse,
        deleteCourse,
        assignments,
        addAssignment,
        toggleAssignmentStatus,
        submitAssignment,
        deleteAssignment,
        submittingAssignment,
        openSubmitModal,
        closeSubmitModal,
        isAddAssignmentModalOpen,
        setIsAddAssignmentModalOpen,
        totalCoursesCount,
        pendingAssignmentsCount,
        completedAssignmentsCount,
        highPriorityAssignmentsCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
