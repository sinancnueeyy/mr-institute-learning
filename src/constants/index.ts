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
    }
  },
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/unauthorized',
    SERVER_ERROR: '/500',
  }
};

export const FIREBASE_COLLECTIONS = {
  SETTINGS: 'settings',
  HOMEPAGE: 'homepage',
  ABOUT: 'about',
  SERVICES: 'services',
  COURSES: 'courses',
  CHARITY: 'charity',
  GALLERY: 'gallery',
  FORMS: 'forms',
  FORM_SUBMISSIONS: 'formSubmissions',
  APPLICATIONS: 'applications',
  STUDENTS: 'students',
  ENQUIRIES: 'enquiries',
  NOTIFICATIONS: 'notifications',
  USERS: 'users',
  MEDIA: 'media',
  REPORTS: 'reports',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'A network error occurred. Please try again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  UNKNOWN: 'An unknown error occurred.',
};
