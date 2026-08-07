export type ApplicationStatus = 'pending' | 'under_review' | 'accepted' | 'rejected';
export type StudentStatus = 'active' | 'graduated' | 'dropped';
export type EnquiryStatus = 'new' | 'read' | 'resolved';
export type ScholarshipStatus = 'pending' | 'approved' | 'rejected';
export type NotificationType = 'alert' | 'info' | 'success';
export type FollowUpType = 'call' | 'email' | 'meeting';
export type FormSubmissionStatus = 'new' | 'under_review' | 'approved' | 'rejected' | 'closed';

export interface Application {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  courseId: string;
  status: ApplicationStatus;
  documents: string[]; // array of URLs
  submittedAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Student {
  id: string;
  applicationId?: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: StudentStatus;
  courseIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ScholarshipApplication {
  id: string;
  studentId?: string; // Optional if applicant isn't a student yet
  applicantName: string;
  email: string;
  incomeBracket: string;
  reason: string;
  documents: string[]; // array of URLs
  status: ScholarshipStatus;
  submittedAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CharityApplication {
  id: string;
  applicantName: string;
  contact: string;
  requestType: string;
  description: string;
  documents: string[]; // array of URLs
  status: ScholarshipStatus; // shares status type
  submittedAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FollowUpRecord {
  id: string;
  referenceId: string; // enquiry or application ID
  type: FollowUpType;
  notes: string;
  nextFollowUpDate?: string;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formType: string;
  formTitle: string;
  data: Record<string, any>;
  files: { fieldName: string; url: string; fileName: string }[];
  status: FormSubmissionStatus;
  assignedTo?: string;
  internalNotes?: string;
  submittedAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
