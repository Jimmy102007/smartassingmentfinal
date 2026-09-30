import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Header } from './components/Header';
import { Toast } from './components/Toast';

// Pages
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent: React.FC = () => {
  const { currentPage, isLoggedIn, language } = useApp();

  // If not logged in, or on the login page
  if (!isLoggedIn || currentPage === 'login') {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  const getPageHeaderInfo = () => {
    const isThai = language === 'th';
    switch (currentPage) {
      case 'home':
        return {
          title: isThai ? 'แดชบอร์ดนักศึกษา' : 'Student Dashboard',
          subtitle: isThai 
            ? 'ยินดีต้อนรับสู่ระบบจัดการการบ้านและรายวิชาอัจฉริยะ' 
            : 'Welcome to your smart assignment and course manager',
        };
      case 'courses':
        return {
          title: isThai ? 'รายวิชา & หลักสูตร' : 'Courses & Curriculum',
          subtitle: isThai 
            ? 'จัดการรายวิชาที่ลงทะเบียน แผนการเรียน และช่องทางติดต่ออาจารย์ผู้สอน' 
            : 'Enrolled subjects and instructor contact directories',
        };
      case 'course-detail':
        return {
          title: isThai ? 'พื้นที่รายวิชา' : 'Course Workspace',
          subtitle: isThai 
            ? 'ภาพรวมรายวิชา หัวข้อบทเรียน และรายการงานที่มอบหมาย' 
            : 'Course overview, deliverables, and syllabus schedule',
        };
      case 'assignments':
        return {
          title: isThai ? 'การบ้าน & กำหนดส่งงาน' : 'Assignments & Deadlines',
          subtitle: isThai 
            ? 'ติดตาม ตรวจสอบ และส่งงานการบ้านทั้งหมดของคุณ' 
            : 'Track, submit, and manage all your academic deliverables',
        };
      case 'calendar':
        return {
          title: isThai ? 'ปฏิทินกำหนดส่งงาน' : 'Academic Calendar',
          subtitle: isThai 
            ? 'ภาพรวมไทม์ไลน์และกำหนดเวลาส่งงานเพื่อการวางแผนที่มีประสิทธิภาพ' 
            : 'Schedule timeline of assignment submissions and exams',
        };
      case 'profile':
        return {
          title: isThai ? 'ข้อมูลและประวัตินักศึกษา' : 'My Profile & Records',
          subtitle: isThai 
            ? 'ข้อมูลส่วนตัว บัญชีนักศึกษา ผลการเรียน และการจัดการบัญชี' 
            : 'Academic profile, GPA records, and account switcher',
        };
      default:
        return {
          title: isThai ? 'Smart Assignment' : 'Smart Assignment',
          subtitle: isThai ? 'ระบบส่งการบ้านมหาวิทยาลัย' : 'University Learning Platform',
        };
    }
  };

  const headerInfo = getPageHeaderInfo();

  return (
    <div className="min-h-screen bg-[#f0f4fa] dark:bg-[#030914] flex flex-col md:flex-row text-slate-900 dark:text-slate-100 transition-colors relative">
      {/* Background Neon Ambient Glows */}
      <div className="fixed top-0 right-0 w-[550px] h-[450px] bg-gradient-to-b from-[#0075ff]/15 via-[#00aaff]/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[450px] h-[350px] bg-gradient-to-t from-[#003899]/15 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 md:pb-6 relative z-10">
        {/* Mobile Top App Bar */}
        <MobileNav />

        {/* Desktop Header */}
        <Header 
          title={headerInfo.title} 
          subtitle={headerInfo.subtitle} 
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'courses' && <CoursesPage />}
          {currentPage === 'course-detail' && <CourseDetailPage />}
          {currentPage === 'assignments' && <AssignmentsPage />}
          {currentPage === 'calendar' && <CalendarPage />}
          {currentPage === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Global Notification Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
