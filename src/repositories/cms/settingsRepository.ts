import { BaseRepository } from '../BaseRepository';
import { type SiteSettings } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class SettingsRepository extends BaseRepository<SiteSettings> {
  constructor() {
    super(SUPABASE_TABLES.CMS_SETTINGS);
  }

  /**
   * Overrides create to handle singleton upsert if customId exists
   */
  async create(data: Omit<SiteSettings, 'id'>, customId?: string) {
    if (customId) {
      const existing = await this.getById(customId);
      if (existing.data) {
        return this.update(customId, data);
      }
    }
    return super.create(data, customId);
  }
}

export const settingsRepository = new SettingsRepository();
