import { BaseRepository } from '../BaseRepository';
import type { Notification } from '../../types/operations';

class NotificationsRepository extends BaseRepository<Notification> {
  constructor() {
    super('notifications');
  }
}

export const notificationsRepository = new NotificationsRepository();
