export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterCard?: string;
  noIndex?: boolean;
}

export interface HomepageContent {
  id: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription?: string;
  heroImage: string;
  heroVideo?: string;
  heroOverlayOpacity?: number;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  
  stats: { label: string; value: string; icon?: string }[];
  features: { title: string; description: string; icon: string }[];
  partnerLogos: { name: string; website?: string; logoUrl: string; order: number }[];
  
  featuredCourseIds: string[];
  courseSelectionType?: 'manual' | 'latest' | 'featured';
  
  featuredServiceIds: string[];
  serviceSelectionType?: 'manual' | 'latest' | 'featured';

  testimonialSelectionType?: 'manual' | 'latest';
  testimonialCount?: number;

  announcementText: string;
  announcementLink: string;
  
  seo?: SeoMetadata;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface AboutContent {
  id: string;
  title: string;
  story: string;
  vision: string;
  mission: string;
  values: { title: string; description: string; icon?: string }[];
  timeline: { year: string; title: string; description: string }[];
  chairmanMessage: { name: string; message: string; image: string; signature?: string };
  principalMessage: { name: string; message: string; image: string; signature?: string };
  stats: { label: string; value: string }[];
  teamMembers: { name: string; role: string; image: string; isLeadership?: boolean }[];
  achievements: { title: string; description: string; year?: string }[];
  infrastructure: { title: string; description: string; image: string }[];
  
  seo?: SeoMetadata;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CourseContent {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  mode: string;
  image: string;
  gallery: string[];
  facultyIds?: string[];
  syllabusPdf?: string;
  eligibility: string;
  fees?: string;
  admissionDates?: string;
  batchSchedule?: string;
  highlights: string[];
  syllabus: string[];
  faqs: { question: string; answer: string }[];
  relatedCourseIds?: string[];
  brochurePdf?: string;
  formTypeMapping?: string; // Form ID or Type to use for enquiry
  
  seo?: SeoMetadata;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ServiceContent {
  id: string;
  title: string;
  description: string;
  iconName: string;
  image?: string;
  benefits: string[];
  eligibility?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  
  seo?: SeoMetadata;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CharityContent {
  id: string;
  title: string;
  description: string;
  schemes: { title: string; description: string; eligibility: string; docsRequired: string[] }[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  successStories: { name: string; story: string; image?: string; course?: string }[];
  impactStats: { label: string; value: string }[];
  videos: string[];
  faqs: { question: string; answer: string }[];
  formTypeMapping?: string;

  seo?: SeoMetadata;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface GalleryContent {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  imageUrl: string;
  videoUrl?: string;
  isFeatured?: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface NoticeContent {
  id: string;
  type: 'news' | 'announcement' | 'exam' | 'scholarship' | 'holiday' | 'event';
  title: string;
  description: string;
  link?: string;
  attachmentUrl?: string;
  publishDate: string;
  expiryDate?: string;
  isFeatured: boolean;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface TestimonialContent {
  id: string;
  studentName: string;
  course: string;
  rating: number; // 1-5
  review: string;
  image?: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type FormFieldType = 
  | 'text' | 'email' | 'phone' | 'number' | 'password' | 'textarea'
  | 'select' | 'multi-select' | 'radio' | 'checkbox' | 'toggle'
  | 'date' | 'time' | 'datetime'
  | 'file' | 'image' | 'url'
  | 'hidden' | 'divider' | 'heading' | 'paragraph';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  name: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  required: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  width?: 'full' | 'half' | 'third' | 'quarter';
  order: number;
  options?: { label: string; value: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    regex?: string;
    customErrorMessage?: string;
    min?: number;
    max?: number;
    allowedFileTypes?: string[];
    maxFileSize?: number;
  };
  conditionalVisibility?: {
    fieldId: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: any;
  };
  customCssClass?: string;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  fields: FormField[];
}

export interface FormSchema {
  id: string;
  title: string;
  type: string;
  description?: string;
  steps: FormStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: number;
  uploadedAt: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  branches: { name: string; address: string; phone: string; email: string; mapUrl?: string }[];
  departmentContacts: { department: string; name: string; email: string; phone: string }[];
  emergencyContacts: { label: string; phone: string }[];
  officeHours: string;
  socialLinks: Record<string, string>;
  formTypeMapping?: string;
  maintenanceMode: boolean;
  seo?: SeoMetadata;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
