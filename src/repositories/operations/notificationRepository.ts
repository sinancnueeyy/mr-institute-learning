import { collection, query, orderBy, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import { BaseRepository } from '../BaseRepository';
import type { Notification } from '../../types/operations';

class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super('notifications');
  }

  async getUserNotifications(_userId?: string) {
    // If we had user-specific notifications, we'd filter by _userId.
    // For now, this just gets all notifications, or we can filter by role in the future.
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)),
        error: null
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async markAsRead(notificationIds: string[]) {
    try {
      const batch = writeBatch(db);
      notificationIds.forEach(id => {
        const ref = doc(db, this.collectionName, id);
        batch.update(ref, { isRead: true });
      });
      await batch.commit();
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const notificationRepository = new NotificationRepository();
