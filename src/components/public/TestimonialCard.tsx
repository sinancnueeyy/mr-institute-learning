import { Card, CardContent } from '../ui/Card';
import { SlideIn } from '../animations/SlideIn';
import { Quote } from 'lucide-react';
import type { TestimonialInitial } from '../../data/initialData';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface TestimonialCardProps {
  testimonial: TestimonialItem | TestimonialInitial;
  delay?: number;
}

export function TestimonialCard({ testimonial, delay = 0 }: TestimonialCardProps) {
  const avatarUrl = testimonial.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80';

  return (
    <SlideIn delay={delay} duration={0.5} direction="up" className="h-full">
      <Card className="h-full bg-surface border-border/50 hover:shadow-sm transition-shadow duration-300">
        <CardContent className="p-8 flex flex-col h-full relative">
          <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-primary/10" />
          
          <div className="flex-grow">
            <p className="text-text-secondary text-lg leading-relaxed italic mb-8 relative z-10">
              "{testimonial.content}"
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-auto relative z-10">
            <img loading="lazy" 
              src={avatarUrl} 
              alt={testimonial.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary/20"
            />
            <div>
              <h4 className="font-bold text-text-primary">{testimonial.name}</h4>
              <p className="text-sm text-text-muted">{testimonial.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </SlideIn>
  );
}
