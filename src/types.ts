export type NavigationPage = 
  | 'login' 
  | 'home' 
  | 'courses' 
  | 'course-detail' 
  | 'assignments' 
  | 'calendar' 
  | 'profile';

export type ThemeMode = 'light' | 'dark';
export type Language = 'th' | 'en';

export interface Student {
  id: string; // e.g. "STU-2024-042" or Firebase UID
  uid?: string; // Firebase Auth UID
  name: string;
  email: string;
  major: string;
  semester: string;
  avatarColor: string; // gradient or theme color
  avatarUrl?: string; // custom avatar image or emoji/icon
  photoURL?: string; // Firebase user photo
  gpa: string;
  credits: number;
  totalCredits: number;
  university: string;
  advisor: string;
  phone?: string;
  enrolledSince?: string;
}

export type CourseIconType = 
  | 'code' 
  | 'cpu' 
  | 'database' 
  | 'palette' 
  | 'calculator' 
  | 'globe' 
  | 'atom' 
  | 'book-open' 
  | 'briefcase';

export interface Course {
  id: string;
  code: string;
  name: string;
  teacher: string;
  teacherEmail: string;
  officeHours: string;
  room: string;
  schedule: string;
  credits: number;
  icon: CourseIconType;
  color: 'purple' | 'blue' | 'pink' | 'indigo' | 'violet';
  description: string;
  syllabusTopics: string[];
  createdAt: string;
}

export type AssignmentPriority = 'high' | 'medium' | 'low';
export type AssignmentStatus = 'pending' | 'submitted' | 'completed';

export interface UserAccount {
  id: string; // e.g. "663040123-4" or "STU-2026-001" or UID
  username: string; // login identifier
  password?: string; // stored password
  student: Student;
  isDemo?: boolean; // true if a built-in demo account
  registeredAt: string;
  lastLoginAt: string;
  rememberMe?: boolean;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  course?: string; // required field in Firestore: course title/code
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // e.g., "23:59" or "11:59 PM"
  dueAt?: string; // ISO timestamp representing deadline
  status: AssignmentStatus;
  priority: AssignmentPriority;
  points: number;
  earnedScore?: number;
  submittedAt?: string;
  submissionNotes?: string;
  attachedLink?: string;
  fileName?: string;
  fileSize?: string;
}

