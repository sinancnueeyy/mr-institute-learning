import { BaseRepository } from '../BaseRepository';
import type { Student } from '../../types/operations';

class StudentsRepository extends BaseRepository<Student> {
  constructor() {
    super('students');
  }
}

export const studentsRepository = new StudentsRepository();
