import { BaseRepository } from '../BaseRepository';
import { type HomepageContent } from '../../types/cms';

class HomepageRepository extends BaseRepository<HomepageContent> {
  constructor() {
    super('cms_homepagecontent');
  }
}

export const homepageRepository = new HomepageRepository();
