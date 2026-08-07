import { BaseRepository } from '../BaseRepository';
import { type NoticeContent } from '../../types/cms';

class NoticesRepository extends BaseRepository<NoticeContent> {
  constructor() {
    super('cms_notices');
  }
}

export const noticesRepository = new NoticesRepository();
