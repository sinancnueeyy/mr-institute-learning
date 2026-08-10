import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Clock, MonitorPlay } from 'lucide-react';
import { SlideIn } from '../animations/SlideIn';
import { Link } from 'react-router-dom';
import type { CourseInitial } from '../../data/initialData';

export interface CourseCardProps {
  course: CourseInitial;
  delay?: number;
}

export function CourseCard({ course, delay = 0 }: CourseCardProps) {
  return (
    <SlideIn delay={delay} duration={0.4} direction="up" className="h-full">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-floating transition-all duration-300 border-border/50 group hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.image} 
            alt={course.title} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-brand-primary font-semibold">
              {course.category}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-6 pb-4">
          <h3 className="text-xl font-bold text-text-primary line-clamp-2 min-h-[3.5rem]">
            {course.title}
          </h3>
        </CardHeader>
        
        <CardContent className="p-6 pt-0 flex-grow">
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MonitorPlay className="w-4 h-4 text-brand-primary" />
              <span>{course.mode}</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm line-clamp-3">
            {course.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full" variant="outline">
            <Link to={`/courses/${course.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </SlideIn>
  );
}
