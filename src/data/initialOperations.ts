import type { 
  Application, 
  Student, 
  Enquiry, 
  ScholarshipApplication, 
  CharityApplication,
  Notification 
} from '../types/operations';

const now = new Date().toISOString();

export const initialApplication: Omit<Application, 'id'> = {
  applicantName: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '+91 9876543210',
  courseId: 'course_123',
  status: 'under_review',
  documents: ['https://example.com/doc1.pdf'],
  submittedAt: now,
  updatedAt: now,
};

export const initialStudent: Omit<Student, 'id'> = {
  applicationId: 'app_123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9123456789',
  enrollmentDate: now,
  status: 'active',
  courseIds: ['course_123'],
  createdAt: now,
  updatedAt: now,
};

export const initialEnquiry: Omit<Enquiry, 'id'> = {
  name: 'Alice Johnson',
  email: 'alice.j@example.com',
  phone: '+91 9888877777',
  subject: 'Admission Process',
  message: 'I would like to know more about the admission process for the upcoming semester.',
  status: 'new',
  createdAt: now,
};

export const initialScholarship: Omit<ScholarshipApplication, 'id'> = {
  applicantName: 'Bob Williams',
  email: 'bob.w@example.com',
  incomeBracket: 'Below 2L',
  reason: 'Financial hardship due to recent family circumstances.',
  documents: ['https://example.com/income_cert.pdf'],
  status: 'pending',
  submittedAt: now,
};

export const initialCharity: Omit<CharityApplication, 'id'> = {
  applicantName: 'Sarah Davis',
  contact: '+91 9999988888',
  requestType: 'Book Bank',
  description: 'Requesting syllabus books for 11th grade science stream.',
  documents: [],
  status: 'pending',
  submittedAt: now,
};

export const initialNotification: Omit<Notification, 'id'> = {
  title: 'New Enquiry Received',
  message: 'Alice Johnson has submitted a new enquiry.',
  type: 'info',
  isRead: false,
  createdAt: now,
};
