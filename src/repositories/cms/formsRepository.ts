import { BaseRepository } from '../BaseRepository';
import { type FormSchema } from '../../types/cms';

class FormsRepository extends BaseRepository<FormSchema> {
  constructor() {
    super('cms_formschema');
  }
}

export const formsRepository = new FormsRepository();
