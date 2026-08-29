import { BaseRepository } from './BaseRepository';
import type { User, Settings, Media, Notification } from '../types';
import { SUPABASE_TABLES } from '../constants';

export { BaseRepository };

// System & Auth Repositories
export const userRepository = new BaseRepository<User>(SUPABASE_TABLES.USER_PROFILES);
export const activityLogRepository = new BaseRepository<any>(SUPABASE_TABLES.ACTIVITY_LOGS);

// CMS Content Repositories
export const homepageRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_HOMEPAGE);
export const aboutRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_ABOUT);
export const coursesRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_COURSES);
export const servicesRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_SERVICES);
export const charityRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_CHARITY);
export const galleryRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_GALLERY);
export const formsRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_FORMS);
export const noticesRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_NOTICES);
export const mediaRepository = new BaseRepository<Media>(SUPABASE_TABLES.CMS_MEDIA);
export const settingsRepository = new BaseRepository<Settings>(SUPABASE_TABLES.CMS_SETTINGS);
export const testimonialsRepository = new BaseRepository<any>(SUPABASE_TABLES.CMS_TESTIMONIALS);

// Operations & Intake Repositories
export const applicationsRepository = new BaseRepository<any>(SUPABASE_TABLES.APPLICATIONS);
export const studentsRepository = new BaseRepository<any>(SUPABASE_TABLES.STUDENTS);
export const enquiriesRepository = new BaseRepository<any>(SUPABASE_TABLES.ENQUIRIES);
export const scholarshipsRepository = new BaseRepository<any>(SUPABASE_TABLES.SCHOLARSHIPS);
export const charityApplicationsRepository = new BaseRepository<any>(SUPABASE_TABLES.CHARITY_APPLICATIONS);
export const formSubmissionsRepository = new BaseRepository<any>(SUPABASE_TABLES.FORM_SUBMISSIONS);
export const followUpsRepository = new BaseRepository<any>(SUPABASE_TABLES.FOLLOW_UPS);
export const notificationRepository = new BaseRepository<Notification>(SUPABASE_TABLES.NOTIFICATIONS);
export const notificationsRepository = new BaseRepository<Notification>(SUPABASE_TABLES.NOTIFICATIONS);
export const reportsRepository = new BaseRepository<any>(SUPABASE_TABLES.APPLICATIONS);

