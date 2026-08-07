export interface CourseInitial {
  id: string;
  title: string;
  category: string;
  duration: string;
  mode: string;
  description: string;
  image: string;
}

export interface TestimonialInitial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface GalleryInitial {
  id: string;
  title: string;
  category: string;
  image: string;
}

export const initialCourses: CourseInitial[] = [
  {
    id: 'c1',
    title: 'Advanced Mathematics for 12th',
    category: 'Academic Tuition',
    duration: '1 Year',
    mode: 'Offline',
    description: 'Comprehensive coaching covering the entire syllabus with regular initial tests and doubt-clearing sessions.',
    image: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=800&q=80',
  },
  {
    id: 'c2',
    title: 'B.Sc Computer Science Support',
    category: 'Degree Programs',
    duration: '3 Years',
    mode: 'Hybrid',
    description: 'End-to-end academic support for university students including practical labs and project guidance.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  },
  {
    id: 'c3',
    title: 'AI & Data Science Foundation',
    category: 'AI & Skill Development',
    duration: '6 Months',
    mode: 'Online',
    description: 'Learn the fundamentals of Artificial Intelligence, Machine Learning, and Data Analytics.',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80',
  },
  {
    id: 'c4',
    title: 'Direct 10th Examination Coaching',
    category: 'Direct Examination',
    duration: '1 Year',
    mode: 'Offline',
    description: 'Intensive preparation program for students appearing for direct board examinations.',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
  },
  {
    id: 'c5',
    title: 'Digital Marketing Mastery',
    category: 'Computer Courses',
    duration: '3 Months',
    mode: 'Online',
    description: 'Complete hands-on training in SEO, SMM, and Google Ads for career growth.',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
  },
  {
    id: 'c6',
    title: 'Medical Entrance (NEET) Prep',
    category: 'Competitive Exams',
    duration: '2 Years',
    mode: 'Offline',
    description: 'Rigorous coaching program designed to crack the toughest medical entrance exams.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
  },
];

export const initialTestimonials: TestimonialInitial[] = [
  {
    id: 't1',
    name: 'Sarah Ahmed',
    role: 'Medical Student',
    content: 'MR Institute completely changed my approach to studying. The personalized attention helped me secure a top rank in my board exams.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: 't2',
    name: 'David Chen',
    role: 'Software Engineer',
    content: 'The AI foundation course was incredibly practical. I gained skills that immediately helped me land my first tech internship.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: 't3',
    name: 'Priya Sharma',
    role: 'Direct 12th Achiever',
    content: 'I had lost hope of completing my schooling, but the Direct 12th program and supportive faculty made it possible.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
];

export const initialStats = [
  { label: 'Students Empowered', value: '10,000+' },
  { label: 'Scholarships Awarded', value: '₹50L+' },
  { label: 'Expert Faculty', value: '150+' },
  { label: 'Success Rate', value: '98%' },
];

export const initialGallery: GalleryInitial[] = [
  { id: 'g1', title: 'Annual Science Fair', category: 'Events', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
  { id: 'g2', title: 'Modern Library', category: 'Campus', image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80' },
  { id: 'g3', title: 'Graduation Ceremony', category: 'Students', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
  { id: 'g4', title: 'Book Distribution', category: 'Charity', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80' },
  { id: 'g5', title: 'Computer Lab', category: 'Campus', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80' },
  { id: 'g6', title: 'State Toppers', category: 'Achievements', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80' },
];
