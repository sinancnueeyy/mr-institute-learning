import { BaseRepository } from '../BaseRepository';
import type { Application } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';

export class ApplicationsRepository extends BaseRepository<Application> {
  constructor() {
    super(SUPABASE_TABLES.APPLICATIONS);
  }
}

export const applicationsRepository = new ApplicationsRepository();
