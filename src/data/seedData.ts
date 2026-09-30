import { Student, Course, Assignment } from '../types';

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'STU-2024-042',
    name: 'Alex Vance',
    email: 'alex.vance@university.edu',
    major: 'Computer Science & AI',
    semester: 'Fall Semester · Year 3',
    avatarColor: 'from-purple-600 to-indigo-600',
    gpa: '3.88',
    credits: 74,
    totalCredits: 120,
    university: 'Grandview Institute of Technology',
    advisor: 'Dr. Sarah Jenkins',
    phone: '+1 (555) 234-8901',
    enrolledSince: 'September 2024',
  },
  {
    id: 'STU-2025-118',
    name: 'Maya Patel',
    email: 'maya.patel@university.edu',
    major: 'Interactive Media & Design',
    semester: 'Fall Semester · Year 2',
    avatarColor: 'from-pink-500 to-purple-600',
    gpa: '3.92',
    credits: 46,
    totalCredits: 120,
    university: 'Grandview Institute of Technology',
    advisor: 'Prof. Marcus Brody',
    phone: '+1 (555) 345-9012',
    enrolledSince: 'September 2025',
  }
];

export const DEMO_COURSES_ALEX: Course[] = [
  {
    id: 'course-cs301',
    code: 'CS 301',
    name: 'Advanced Data Structures & Algorithms',
    teacher: 'Prof. Alan Thorne',
    teacherEmail: 'a.thorne@university.edu',
    officeHours: 'Tue & Thu · 2:00 PM – 4:00 PM',
    room: 'Turing Hall · Room 402',
    schedule: 'Mon & Wed · 10:00 AM – 11:30 AM',
    credits: 4,
    icon: 'code',
    color: 'purple',
    description: 'In-depth study of balanced search trees, graph algorithms, dynamic programming, and computational complexity bounds.',
    syllabusTopics: [
      'Self-balancing binary trees & Red-Black trees',
      'Shortest path & Network flow algorithms',
      'Dynamic programming memoization strategies',
      'NP-Completeness and heuristic approximations'
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'course-cs340',
    code: 'CS 340',
    name: 'Distributed Cloud Architecture',
    teacher: 'Dr. Elena Rostova',
    teacherEmail: 'e.rostova@university.edu',
    officeHours: 'Wed · 1:00 PM – 3:30 PM',
    room: 'Hopper Science Center · Lab 210',
    schedule: 'Tue & Thu · 9:00 AM – 10:30 AM',
    credits: 3,
    icon: 'database',
    color: 'blue',
    description: 'Design patterns for resilient distributed systems, eventual consistency, microservices orchestration, and cloud primitives.',
    syllabusTopics: [
      'CAP theorem, PACELC, and distributed consensus (Raft/Paxos)',
      'Event-driven architecture and message brokers',
      'Container orchestration and service meshes',
      'Fault tolerance and chaos testing methodologies'
    ],
    createdAt: '2026-09-02'
  },
  {
    id: 'course-math220',
    code: 'MATH 220',
    name: 'Linear Algebra & Applied Matrix Theory',
    teacher: 'Prof. Gabriel Reyes',
    teacherEmail: 'g.reyes@university.edu',
    officeHours: 'Mon & Fri · 11:00 AM – 1:00 PM',
    room: 'Gauss Mathematics Pavilion · Rm 105',
    schedule: 'Mon, Wed & Fri · 1:00 PM – 2:00 PM',
    credits: 4,
    icon: 'calculator',
    color: 'indigo',
    description: 'Vector spaces, linear transformations, eigenvalue decompositions, singular value decomposition (SVD), and applications in machine learning.',
    syllabusTopics: [
      'Vector spaces, subspaces, basis, and dimension',
      'Orthogonality and Gram-Schmidt process',
      'Eigenvalues, eigenvectors, and diagonalization',
      'Singular Value Decomposition (SVD) and PCA'
    ],
    createdAt: '2026-09-03'
  },
  {
    id: 'course-ds280',
    code: 'DS 280',
    name: 'Modern Web Engineering & React',
    teacher: 'Dr. Claire Laurent',
    teacherEmail: 'c.laurent@university.edu',
    officeHours: 'Thu · 3:00 PM – 5:00 PM',
    room: 'Ada Lovelace Tech Center · Rm 315',
    schedule: 'Tue & Thu · 1:30 PM – 3:00 PM',
    credits: 3,
    icon: 'cpu',
    color: 'pink',
    description: 'Component architecture, reactive state management, asynchronous data caching, accessibility standards, and web performance engineering.',
    syllabusTopics: [
      'Modern component lifecycles and hook primitives',
      'State machines and server cache synchronization',
      'Responsive design and CSS modern layouts',
      'End-to-end testing and production deployment'
    ],
    createdAt: '2026-09-04'
  }
];

export const DEMO_ASSIGNMENTS_ALEX: Assignment[] = [
  {
    id: 'assign-1',
    courseId: 'course-cs301',
    courseName: 'Advanced Data Structures & Algorithms',
    courseCode: 'CS 301',
    title: 'Red-Black Tree Insertion & Rotation Lab',
    description: 'Implement insertion and node color rebalancing rules for a left-leaning red-black tree with JUnit verification tests.',
    dueDate: '2026-09-28',
    dueTime: '23:59',
    status: 'pending',
    priority: 'high',
    points: 100,
  },
  {
    id: 'assign-2',
    courseId: 'course-math220',
    courseName: 'Linear Algebra & Applied Matrix Theory',
    courseCode: 'MATH 220',
    title: 'Problem Set 4: Eigenvalue Spectrum Decomposition',
    description: 'Complete exercises 4.1 through 4.18 covering characteristic polynomials, algebraic vs geometric multiplicity, and matrix powers.',
    dueDate: '2026-09-26',
    dueTime: '17:00',
    status: 'pending',
    priority: 'high',
    points: 50,
  },
  {
    id: 'assign-3',
    courseId: 'course-cs340',
    courseName: 'Distributed Cloud Architecture',
    courseCode: 'CS 340',
    title: 'Raft Consensus Protocol Leader Election Simulator',
    description: 'Build a lightweight heartbeat timer and candidate election state machine handling split vote scenarios in Go or TypeScript.',
    dueDate: '2026-10-04',
    dueTime: '23:59',
    status: 'pending',
    priority: 'medium',
    points: 120,
  },
  {
    id: 'assign-4',
    courseId: 'course-ds280',
    courseName: 'Modern Web Engineering & React',
    courseCode: 'DS 280',
    title: 'Responsive Dashboard Component Prototype',
    description: 'Create a high-fidelity analytics dashboard component featuring accessible ARIA labels, responsive sidebar, and theme tokens.',
    dueDate: '2026-09-25',
    dueTime: '20:00',
    status: 'completed',
    priority: 'medium',
    points: 80,
    earnedScore: 78,
    submittedAt: '2026-09-23 · 14:32',
    submissionNotes: 'All responsive breakpoints tested on Chrome and Safari. Added full keyboard navigation.',
    attachedLink: 'https://github.com/alexvance/dashboard-proto'
  },
  {
    id: 'assign-5',
    courseId: 'course-cs301',
    courseName: 'Advanced Data Structures & Algorithms',
    courseCode: 'CS 301',
    title: 'Algorithmic Complexity & Big-O Benchmark Report',
    description: 'Empirical benchmark comparison between Quicksort, Mergesort, and Heapsort on varying input distributions.',
    dueDate: '2026-09-15',
    dueTime: '23:59',
    status: 'completed',
    priority: 'low',
    points: 60,
    earnedScore: 60,
    submittedAt: '2026-09-14 · 19:15',
    submissionNotes: 'Submitted PDF report with execution graphs generated using Matplotlib.'
  },
  {
    id: 'assign-6',
    courseId: 'course-math220',
    courseName: 'Linear Algebra & Applied Matrix Theory',
    courseCode: 'MATH 220',
    title: 'Problem Set 3: Vector Subspaces & Nullspaces',
    description: 'Rigorous proofs of column space dimension, rank-nullity theorem applications, and invertible matrix equivalence.',
    dueDate: '2026-09-12',
    dueTime: '17:00',
    status: 'completed',
    priority: 'medium',
    points: 50,
    earnedScore: 48,
    submittedAt: '2026-09-12 · 11:20'
  }
];

export const DEMO_COURSES_MAYA: Course[] = [
  {
    id: 'course-des201',
    code: 'DES 201',
    name: 'Visual Systems & Design Theory',
    teacher: 'Prof. Marcus Brody',
    teacherEmail: 'm.brody@university.edu',
    officeHours: 'Mon · 10:00 AM – 12:00 PM',
    room: 'Art & Design Center · Studio 3',
    schedule: 'Mon & Wed · 9:30 AM – 11:00 AM',
    credits: 3,
    icon: 'palette',
    color: 'pink',
    description: 'Systematic typography, grid systems, chromatic harmony, and multi-platform design token systems.',
    syllabusTopics: [
      'Modular scales and typographic hierarchies',
      '8pt grid systems and fluid layout mathematics',
      'Color perception, contrast, and dark mode tokens',
      'Design token handoff to engineering'
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'course-des310',
    code: 'DES 310',
    name: 'User Experience Research & Usability Testing',
    teacher: 'Dr. Sarah Al-Mansoor',
    teacherEmail: 's.almansoor@university.edu',
    officeHours: 'Thu · 2:00 PM – 4:00 PM',
    room: 'Behavioral UX Lab · Rm 102',
    schedule: 'Tue & Thu · 11:00 AM – 12:30 PM',
    credits: 4,
    icon: 'globe',
    color: 'purple',
    description: 'Qualitative customer discovery interviews, task-based usability testing protocols, and cognitive walkthroughs.',
    syllabusTopics: [
      'Semi-structured user interview techniques',
      'Think-aloud protocol and SUS score measurement',
      'Affinity diagramming and thematic coding',
      'Translating research insights into product specifications'
    ],
    createdAt: '2026-09-02'
  },
  {
    id: 'course-med150',
    code: 'MED 150',
    name: 'Digital Audio & Motion Design',
    teacher: 'Prof. Kieran Wright',
    teacherEmail: 'k.wright@university.edu',
    officeHours: 'Fri · 1:00 PM – 3:00 PM',
    room: 'Digital Media Studio · Suite B',
    schedule: 'Fri · 9:00 AM – 12:00 PM',
    credits: 3,
    icon: 'briefcase',
    color: 'indigo',
    description: 'Kinetic typography, micro-interactions, easing curves, and spatial interface feedback sounds.',
    syllabusTopics: [
      'The 12 principles of animation applied to UI',
      'Spring physics and timing curves',
      'Micro-interaction choreography',
      'Accessibility in motion and vestibular considerations'
    ],
    createdAt: '2026-09-03'
  }
];

export const DEMO_ASSIGNMENTS_MAYA: Assignment[] = [
  {
    id: 'assign-m1',
    courseId: 'course-des201',
    courseName: 'Visual Systems & Design Theory',
    courseCode: 'DES 201',
    title: 'Brand Typography & Design Token Spec',
    description: 'Define typographic scale, letter-spacing tokens, and line-height pairing for a university mobile portal.',
    dueDate: '2026-09-27',
    dueTime: '23:59',
    status: 'pending',
    priority: 'high',
    points: 100,
  },
  {
    id: 'assign-m2',
    courseId: 'course-des310',
    courseName: 'User Experience Research & Usability Testing',
    courseCode: 'DES 310',
    title: 'Usability Test Script & 5-Participant Synthesis',
    description: 'Conduct 5 moderated usability evaluations of the student registration workflow and compile findings matrix.',
    dueDate: '2026-09-30',
    dueTime: '18:00',
    status: 'pending',
    priority: 'high',
    points: 90,
  },
  {
    id: 'assign-m3',
    courseId: 'course-med150',
    courseName: 'Digital Audio & Motion Design',
    courseCode: 'MED 150',
    title: 'Choreographed Button Micro-interaction',
    description: 'Design and prototype a multi-state loading-to-success button animation using custom bezier curves.',
    dueDate: '2026-10-06',
    dueTime: '22:00',
    status: 'pending',
    priority: 'medium',
    points: 60,
  },
  {
    id: 'assign-m4',
    courseId: 'course-des201',
    courseName: 'Visual Systems & Design Theory',
    courseCode: 'DES 201',
    title: 'Chromatic Harmony Matrix & Contrast Audit',
    description: 'Created 12 harmonic palettes and verified WCAG 2.2 AAA compliance scores across all background permutations.',
    dueDate: '2026-09-16',
    dueTime: '23:59',
    status: 'completed',
    priority: 'medium',
    points: 50,
    earnedScore: 50,
    submittedAt: '2026-09-15 · 18:40',
    submissionNotes: 'All color ramps generated in OKLCH color space for perceptually uniform lightness.'
  }
];

export function getStarterDataForStudent(name: string, id: string): {
  profile: Student;
  courses: Course[];
  assignments: Assignment[];
} {
  const cleanName = name.trim() || 'Student';
  const cleanId = id.trim().toUpperCase() || 'STU-2026-001';
  const emailName = cleanName.toLowerCase().replace(/\s+/g, '.');

  const profile: Student = {
    id: cleanId,
    name: cleanName,
    email: `${emailName}@university.edu`,
    major: 'General Studies & Technology',
    semester: 'Fall Semester · Year 1',
    avatarColor: 'from-purple-600 via-indigo-600 to-pink-500',
    gpa: '3.80',
    credits: 32,
    totalCredits: 120,
    university: 'Grandview Institute of Technology',
    advisor: 'Faculty Academic Advising',
    enrolledSince: 'September 2026',
  };

  const starterCourses: Course[] = [
    {
      id: `course-${cleanId}-1`,
      code: 'UNIV 101',
      name: 'Introduction to Academic Discovery & Research',
      teacher: 'Prof. Evelyn Reed',
      teacherEmail: 'e.reed@university.edu',
      officeHours: 'Wed · 2:00 PM – 4:00 PM',
      room: 'Main Campus · Hall 101',
      schedule: 'Mon & Wed · 10:00 AM – 11:30 AM',
      credits: 3,
      icon: 'book-open',
      color: 'purple',
      description: 'Foundations of rigorous scholarly inquiry, digital research methods, and critical synthesis.',
      syllabusTopics: [
        'Scholarly sources and peer-review evaluation',
        'Academic integrity and citation methodologies',
        'Digital library search optimization',
        'Research proposal synthesis'
      ],
      createdAt: '2026-09-01'
    },
    {
      id: `course-${cleanId}-2`,
      code: 'CS 105',
      name: 'Principles of Computational Problem Solving',
      teacher: 'Dr. Michael Chen',
      teacherEmail: 'm.chen@university.edu',
      officeHours: 'Tue & Thu · 1:00 PM – 3:00 PM',
      room: 'Science Complex · Rm 204',
      schedule: 'Tue & Thu · 9:00 AM – 10:30 AM',
      credits: 4,
      icon: 'code',
      color: 'blue',
      description: 'Core concepts in computational thinking, procedural logic, functional abstraction, and problem decomposition.',
      syllabusTopics: [
        'Logic structures, conditionals, and iteration',
        'Algorithmic decomposition and stepwise refinement',
        'Data structures and memory models',
        'Debugging and automated unit tests'
      ],
      createdAt: '2026-09-02'
    }
  ];

  const starterAssignments: Assignment[] = [
    {
      id: `assign-${cleanId}-1`,
      courseId: starterCourses[0].id,
      courseName: starterCourses[0].name,
      courseCode: starterCourses[0].code,
      title: 'Literature Review & Annotated Bibliography',
      description: 'Summarize three peer-reviewed journals examining modern technological applications in your discipline.',
      dueDate: '2026-09-29',
      dueTime: '23:59',
      status: 'pending',
      priority: 'high',
      points: 100,
    },
    {
      id: `assign-${cleanId}-2`,
      courseId: starterCourses[1].id,
      courseName: starterCourses[1].name,
      courseCode: starterCourses[1].code,
      title: 'Problem Set 1: Algorithmic Logic & Flowcharts',
      description: 'Diagram and write pseudocode for three foundational sorting and searching challenges.',
      dueDate: '2026-09-27',
      dueTime: '17:00',
      status: 'pending',
      priority: 'medium',
      points: 50,
    },
    {
      id: `assign-${cleanId}-3`,
      courseId: starterCourses[0].id,
      courseName: starterCourses[0].name,
      courseCode: starterCourses[0].code,
      title: 'Course Orientation Diagnostic Quiz',
      description: 'Initial skills evaluation and academic integrity statement submission.',
      dueDate: '2026-09-10',
      dueTime: '23:59',
      status: 'completed',
      priority: 'low',
      points: 25,
      earnedScore: 25,
      submittedAt: '2026-09-09 · 10:14',
      submissionNotes: 'All questions completed.'
    }
  ];

  return {
    profile,
    courses: starterCourses,
    assignments: starterAssignments
  };
}
