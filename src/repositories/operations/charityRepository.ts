import { BaseRepository } from '../BaseRepository';
import type { CharityApplication } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';

export class CharityApplicationsRepository extends BaseRepository<CharityApplication> {
  constructor() {
    super(SUPABASE_TABLES.CHARITY_APPLICATIONS);
  }
}

export const charityRepository = new CharityApplicationsRepository();
export const charityApplicationsRepository = charityRepository;
