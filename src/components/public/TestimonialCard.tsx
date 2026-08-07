import { Card, CardContent } from '../ui/Card';
import { SlideIn } from '../animations/SlideIn';
import { Quote } from 'lucide-react';
import type { TestimonialInitial } from '../../data/initialData';

export interface TestimonialCardProps {
  testimonial: TestimonialInitial;
  delay?: number;
}

export function TestimonialCard({ testimonial, delay = 0 }: TestimonialCardProps) {
  return (
    <SlideIn delay={delay} duration={0.5} direction="up" className="h-full">
      <Card className="h-full bg-surface border-border/50 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-8 flex flex-col h-full relative">
          <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
          
          <div className="flex-grow">
            <p className="text-text-secondary text-lg leading-relaxed italic mb-8 relative z-10">
              "{testimonial.content}"
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-auto relative z-10">
            <img loading="lazy" 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
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
