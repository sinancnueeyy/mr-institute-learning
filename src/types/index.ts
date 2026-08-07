export type Role = 'DEVELOPER' | 'OFFICE_ADMIN';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: Role;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  id: string;
  siteName: string;
  contactEmail: string;
  supportPhone?: string;
  maintenanceMode: boolean;
  updatedAt: number;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedBy: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  recipientId: string;
  createdAt: number;
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface PaginationParams {
  limit: number;
  lastDocId?: string; // Simplification for cursor
  direction?: 'asc' | 'desc';
  orderBy?: string;
}

export interface QueryFilter {
  field: string;
  operator: '==' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
  value: any;
}

export interface RepositoryResponse<T> {
  data: T | null;
  error?: AppError;
}

export interface RepositoryListResponse<T> {
  data: T[];
  lastDocId?: string;
  hasMore: boolean;
  error?: AppError;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
}
