import { BaseRepository } from '../BaseRepository';
import type { FollowUpRecord } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';

export class FollowUpsRepository extends BaseRepository<FollowUpRecord> {
  constructor() {
    super(SUPABASE_TABLES.FOLLOW_UPS);
  }
}

export const followUpsRepository = new FollowUpsRepository();
