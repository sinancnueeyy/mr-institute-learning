import { BaseRepository } from '../BaseRepository';
import { type NoticeContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class NoticesRepository extends BaseRepository<NoticeContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_NOTICES);
  }
}

export const noticesRepository = new NoticesRepository();
