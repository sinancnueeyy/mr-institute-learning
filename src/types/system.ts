export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PUBLISH' | 'APPROVE' | 'REJECT';

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  role: string;
  module: string; // e.g., 'CMS_COURSES', 'OFFICE_ADMISSIONS'
  action: ActivityAction;
  description: string;
  ipAddress?: string; // Placeholder for backend resolution
  deviceInfo?: string; // Placeholder for user-agent resolution
  timestamp: string;
}
