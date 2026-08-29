import { BaseRepository } from '../BaseRepository';
import { type AboutContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class AboutRepository extends BaseRepository<AboutContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_ABOUT);
  }
}

export const aboutRepository = new AboutRepository();
