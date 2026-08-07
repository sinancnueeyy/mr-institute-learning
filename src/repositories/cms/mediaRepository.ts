import { BaseRepository } from '../BaseRepository';
import { type MediaAsset } from '../../types/cms';

class MediaRepository extends BaseRepository<MediaAsset> {
  constructor() {
    super('cms_mediaasset');
  }
}

export const mediaRepository = new MediaRepository();
