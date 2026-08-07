import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import type { ActivityLog } from '../../types/system';
import { BaseRepository } from '../BaseRepository';

class ActivityLogRepository extends BaseRepository<ActivityLog> {
  constructor() {
    super('activityLogs');
  }

  // Create an explicit log function to make it easy to use across the app
  async log(
    logData: Omit<ActivityLog, 'id' | 'timestamp' | 'ipAddress' | 'deviceInfo'>
  ) {
    try {
      const data: Omit<ActivityLog, 'id'> = {
        ...logData,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1', // Placeholder
        deviceInfo: navigator.userAgent, // Basic placeholder
      };
      return await this.create(data);
    } catch (error) {
      console.error('Failed to write activity log:', error);
      // We don't want a logging failure to crash the app operations
    }
  }

  async getRecentLogs(maxCount: number = 50) {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('timestamp', 'desc'),
        limit(maxCount)
      );
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog)),
        error: null
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const activityLogRepository = new ActivityLogRepository();
