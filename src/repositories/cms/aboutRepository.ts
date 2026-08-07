import { BaseRepository } from '../BaseRepository';
import { type AboutContent } from '../../types/cms';

class AboutRepository extends BaseRepository<AboutContent> {
  constructor() {
    super('cms_aboutcontent');
  }
}

export const aboutRepository = new AboutRepository();
