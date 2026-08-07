import { BaseRepository } from './BaseRepository';
import type { User, Settings, Media, Notification } from '../types';
import { FIREBASE_COLLECTIONS } from '../constants';

export const userRepository = new BaseRepository<User>(FIREBASE_COLLECTIONS.USERS);
export const settingsRepository = new BaseRepository<Settings>(FIREBASE_COLLECTIONS.SETTINGS);
export const mediaRepository = new BaseRepository<Media>(FIREBASE_COLLECTIONS.MEDIA);
export const notificationRepository = new BaseRepository<Notification>(FIREBASE_COLLECTIONS.NOTIFICATIONS);
export const homepageRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.HOMEPAGE);
export const aboutRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.ABOUT);
export const servicesRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.SERVICES);
export const coursesRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.COURSES);
export const charityRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.CHARITY);
export const galleryRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.GALLERY);
export const formsRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.FORMS);
export const applicationsRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.APPLICATIONS);
export const studentsRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.STUDENTS);
export const enquiriesRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.ENQUIRIES);
export const reportsRepository = new BaseRepository<any>(FIREBASE_COLLECTIONS.REPORTS);
