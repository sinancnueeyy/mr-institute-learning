import { BaseRepository } from '../BaseRepository';
import type { Application } from '../../types/operations';

class ApplicationsRepository extends BaseRepository<Application> {
  constructor() {
    super('applications');
  }
}

export const applicationsRepository = new ApplicationsRepository();
