import { BaseRepository } from '../BaseRepository';
import { type GalleryContent } from '../../types/cms';

class GalleryRepository extends BaseRepository<GalleryContent> {
  constructor() {
    super('cms_gallerycontent');
  }
}

export const galleryRepository = new GalleryRepository();
