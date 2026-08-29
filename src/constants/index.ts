export const APP_CONFIG = {
  appName: 'MR Institute of Learning',
  version: '1.0.0',
};

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    COURSES: '/courses',
    SERVICES: '/services',
    CHARITY: '/charity',
    GALLERY: '/gallery',
    CONTACT: '/contact',
    COURSE_DETAILS: '/courses/:courseId',
  },
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  OFFICE: {
    DASHBOARD: '/office',
    STUDENTS: '/office/students',
    APPLICATIONS: '/office/applications',
    ENQUIRIES: '/office/enquiries',
    COURSES: '/office/courses',
    SCHOLARSHIPS: '/office/scholarships',
    CHARITY: '/office/charity',
    NOTIFICATIONS: '/office/notifications',
    REPORTS: '/office/reports',
  },
  DEVELOPER: {
    DASHBOARD: '/developer',
    SETTINGS: '/developer/settings',
    SYSTEM_LOGS: '/developer/logs',
    CMS: {
      HOMEPAGE: '/developer/homepage',
      ABOUT: '/developer/about',
      COURSES: '/developer/courses',
      SERVICES: '/developer/services',
      CHARITY: '/developer/charity',
      GALLERY: '/developer/gallery',
      FORMS: '/developer/forms',
      FORM_BUILDER: '/developer/forms/builder/:id',
      FORM_SUBMISSIONS: '/developer/forms/submissions',
      MEDIA: '/developer/media',
      NOTICES: '/developer/notices',
      TESTIMONIALS: '/developer/testimonials',
      CONTACT: '/developer/contact',
    }
  },
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/unauthorized',
    SERVER_ERROR: '/500',
  }
};

export const SUPABASE_TABLES = {
  // System & Auth (2)
  USER_PROFILES: 'user_profiles',
  ACTIVITY_LOGS: 'activity_logs',

  // CMS Content (11)
  CMS_HOMEPAGE: 'cms_homepage',
  CMS_ABOUT: 'cms_about',
  CMS_COURSES: 'cms_courses',
  CMS_SERVICES: 'cms_services',
  CMS_CHARITY: 'cms_charity',
  CMS_GALLERY: 'cms_gallery',
  CMS_FORMS: 'cms_forms',
  CMS_NOTICES: 'cms_notices',
  CMS_MEDIA: 'cms_media',
  CMS_SETTINGS: 'cms_settings',
  CMS_TESTIMONIALS: 'cms_testimonials',

  // Operations & Intake (8)
  APPLICATIONS: 'applications',
  STUDENTS: 'students',
  ENQUIRIES: 'enquiries',
  SCHOLARSHIPS: 'scholarships',
  CHARITY_APPLICATIONS: 'charity_applications',
  FORM_SUBMISSIONS: 'form_submissions',
  FOLLOW_UPS: 'follow_ups',
  NOTIFICATIONS: 'notifications',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'A network error occurred. Please try again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  UNKNOWN: 'An unknown error occurred.',
};
