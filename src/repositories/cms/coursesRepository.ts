import { BaseRepository } from '../BaseRepository';
import { type CourseContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class CoursesRepository extends BaseRepository<CourseContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_COURSES);
  }
}

export const coursesRepository = new CoursesRepository();
