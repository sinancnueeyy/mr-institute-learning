import { BaseRepository } from '../BaseRepository';
import type { FollowUpRecord } from '../../types/operations';

class FollowUpsRepository extends BaseRepository<FollowUpRecord> {
  constructor() {
    super('followUps');
  }
}

export const followUpsRepository = new FollowUpsRepository();
