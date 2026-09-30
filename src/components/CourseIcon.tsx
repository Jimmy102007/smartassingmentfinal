import React from 'react';
import { 
  Code, 
  Cpu, 
  Database, 
  Palette, 
  Calculator, 
  Globe, 
  Atom, 
  BookOpen, 
  Briefcase 
} from 'lucide-react';
import { CourseIconType } from '../types';

interface CourseIconProps {
  icon: CourseIconType;
  className?: string;
}

export const CourseIcon: React.FC<CourseIconProps> = ({ icon, className = 'w-5 h-5' }) => {
  switch (icon) {
    case 'code':
      return <Code className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'calculator':
      return <Calculator className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'atom':
      return <Atom className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'book-open':
    default:
      return <BookOpen className={className} />;
  }
};

export const getCourseColorClasses = (color: string) => {
  switch (color) {
    case 'purple':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-100',
        badge: 'bg-purple-100 text-purple-800',
        gradient: 'from-purple-600 to-indigo-600',
        lightBg: 'bg-purple-50/70',
        border: 'border-purple-200',
        accentText: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        ring: 'focus:ring-purple-500',
      };
    case 'blue':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-100',
        badge: 'bg-blue-100 text-blue-800',
        gradient: 'from-blue-600 to-cyan-600',
        lightBg: 'bg-blue-50/70',
        border: 'border-blue-200',
        accentText: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        ring: 'focus:ring-blue-500',
      };
    case 'pink':
      return {
        bg: 'bg-pink-50 text-pink-700 border-pink-100',
        badge: 'bg-pink-100 text-pink-800',
        gradient: 'from-pink-500 to-rose-600',
        lightBg: 'bg-pink-50/70',
        border: 'border-pink-200',
        accentText: 'text-pink-600',
        button: 'bg-pink-600 hover:bg-pink-700 text-white',
        ring: 'focus:ring-pink-500',
      };
    case 'indigo':
    default:
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        badge: 'bg-indigo-100 text-indigo-800',
        gradient: 'from-indigo-600 to-violet-600',
        lightBg: 'bg-indigo-50/70',
        border: 'border-indigo-200',
        accentText: 'text-indigo-600',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        ring: 'focus:ring-indigo-500',
      };
  }
};
