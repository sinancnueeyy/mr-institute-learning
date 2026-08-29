import { BaseRepository } from '../BaseRepository';
import { type FormSchema } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class FormsRepository extends BaseRepository<FormSchema> {
  constructor() {
    super(SUPABASE_TABLES.CMS_FORMS);
  }
}

export const formsRepository = new FormsRepository();
