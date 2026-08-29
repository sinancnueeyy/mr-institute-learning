import { BaseRepository } from '../BaseRepository';
import { type CharityContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class CharityRepository extends BaseRepository<CharityContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_CHARITY);
  }
}

export const charityRepository = new CharityRepository();
