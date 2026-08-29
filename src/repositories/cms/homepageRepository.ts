import { BaseRepository } from '../BaseRepository';
import { type HomepageContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class HomepageRepository extends BaseRepository<HomepageContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_HOMEPAGE);
  }
}

export const homepageRepository = new HomepageRepository();
