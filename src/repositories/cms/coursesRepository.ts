import { BaseRepository } from '../BaseRepository';
import { type CourseContent } from '../../types/cms';

class CoursesRepository extends BaseRepository<CourseContent> {
  constructor() {
    super('cms_coursecontent');
  }
}

export const coursesRepository = new CoursesRepository();
