import { BaseRepository } from '../BaseRepository';
import type { ActivityLog } from '../../types/system';
import { SUPABASE_TABLES } from '../../constants';

export class ActivityLogRepository extends BaseRepository<ActivityLog> {
  constructor() {
    super(SUPABASE_TABLES.ACTIVITY_LOGS);
  }

  // Create an explicit log function to make it easy to use across the app
  async log(
    logData: Omit<ActivityLog, 'id' | 'timestamp' | 'ipAddress' | 'deviceInfo'>
  ) {
    try {
      const nowIso = new Date().toISOString();
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';

      const data: any = {
        ...logData,
        timestamp: nowIso,
        createdAt: nowIso,
        ipAddress: '127.0.0.1',
        deviceInfo: userAgent,
      };

      return await this.create(data);
    } catch (error) {
      console.error('Failed to write activity log:', error);
      // Fire-and-forget: do not crash operations on logging failure
    }
  }

  async getRecentLogs(maxCount: number = 50) {
    try {
      const res = await this.query([], {
        orderBy: 'createdAt',
        direction: 'desc',
        limit: maxCount
      });
      return {
        data: res.data,
        error: res.error?.message || null
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const activityLogRepository = new ActivityLogRepository();
