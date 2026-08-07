import { BaseRepository } from '../BaseRepository';
import type { CharityApplication } from '../../types/operations';

class CharityRepository extends BaseRepository<CharityApplication> {
  constructor() {
    super('charityApplications');
  }
}

export const charityRepository = new CharityRepository();
