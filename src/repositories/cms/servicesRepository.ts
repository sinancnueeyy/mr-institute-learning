import { BaseRepository } from '../BaseRepository';
import { type ServiceContent } from '../../types/cms';

class ServicesRepository extends BaseRepository<ServiceContent> {
  constructor() {
    super('cms_servicecontent');
  }
}

export const servicesRepository = new ServicesRepository();
