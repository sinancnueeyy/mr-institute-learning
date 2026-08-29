import { BaseRepository } from '../BaseRepository';
import type { Notification } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';
import { supabase } from '../../supabase/client';

export class NotificationsRepository extends BaseRepository<Notification> {
  constructor() {
    super(SUPABASE_TABLES.NOTIFICATIONS);
  }

  async getUserNotifications(userId?: string) {
    try {
      const filters = userId ? [{ field: 'recipientId', operator: '==' as const, value: userId }] : [];
      const res = await this.query(filters, { orderBy: 'createdAt', direction: 'desc', limit: 100 });
      return {
        data: res.data,
        error: res.error?.message || null
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async markAsRead(notificationIds: string[]) {
    if (!notificationIds || notificationIds.length === 0) {
      return { success: true, error: null };
    }
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ is_read: true })
        .in('id', notificationIds);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const notificationsRepository = new NotificationsRepository();
