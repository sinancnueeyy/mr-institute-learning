import { BaseRepository } from '../BaseRepository';
import { type CharityContent } from '../../types/cms';

class CharityRepository extends BaseRepository<CharityContent> {
  constructor() {
    super('cms_charitycontent');
  }
}

export const charityRepository = new CharityRepository();
