import { BaseRepository } from '../BaseRepository';
import type { Student } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';

export class StudentsRepository extends BaseRepository<Student> {
  constructor() {
    super(SUPABASE_TABLES.STUDENTS);
  }
}

export const studentsRepository = new StudentsRepository();
