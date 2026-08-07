import { BaseRepository } from '../BaseRepository';
import { type SiteSettings } from '../../types/cms';

class SettingsRepository extends BaseRepository<SiteSettings> {
  constructor() {
    super('cms_settings');
  }
}

export const settingsRepository = new SettingsRepository();
