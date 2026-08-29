import { BaseRepository } from '../BaseRepository';
import { type TestimonialContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class TestimonialsRepository extends BaseRepository<TestimonialContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_TESTIMONIALS);
  }

  override async create(data: Omit<TestimonialContent, 'id'>, customId?: string) {
    const payload: any = { ...data };
    if ('order' in payload && !('orderIndex' in payload)) {
      payload.order_index = payload.order;
      delete payload.order;
    }
    return super.create(payload, customId);
  }

  override async update(id: string, data: Partial<TestimonialContent>) {
    const payload: any = { ...data };
    if ('order' in payload && !('orderIndex' in payload)) {
      payload.order_index = payload.order;
      delete payload.order;
    }
    return super.update(id, payload);
  }
}

export const testimonialsRepository = new TestimonialsRepository();
