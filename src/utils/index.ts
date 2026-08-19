import type { Role } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Validation Utilities
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePasswordStrength = (password: string): boolean => {
  return password.length >= 8; // Simplified for foundation
};

/**
 * Date Formatting Utilities
 */
export const formatDate = (date: Date | number | string, formatStyle: 'short' | 'long' = 'short'): string => {
  const d = new Date(date);
  if (formatStyle === 'long') {
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString();
};

/**
 * String & Slug Utilities
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');      // Replace multiple - with single -
};

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/**
 * Permissions Utilities
 */
export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  if (userRole === 'DEVELOPER') return true; // Developer has all permissions
  if (userRole === 'OFFICE_ADMIN' && requiredRole === 'OFFICE_ADMIN') return true;
  return false;
};

/**
 * SEO Utilities
 */
export const generateMetadata = (title: string, description: string, image?: string) => {
  return {
    title: `${title} | MR Institute of Learning`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
  };
};

export * from './pwa';
export * from './safeLazy';
