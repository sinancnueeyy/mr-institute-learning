import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { SlideIn } from '../animations/SlideIn';
import { cn } from '../../utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  linkTo?: string;
  className?: string;
}

export function ServiceCard({ title, description, icon, delay = 0, linkTo = '/contact', className }: ServiceCardProps) {
  return (
    <SlideIn delay={delay} duration={0.5} direction="up" className="h-full">
      <Card className={cn("h-full hover:shadow-floating hover:border-primary/50 transition-all duration-300 ease-out group border-border/50 hover:-translate-y-1", className)}>
        <CardContent className="p-8 flex flex-col h-full">
          <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
          <p className="text-text-secondary leading-relaxed flex-grow mb-6">
            {description}
          </p>
          <Link 
            to={linkTo}
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover group-hover:translate-x-1 transition-transform duration-300 w-fit"
          >
            Learn more <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </CardContent>
      </Card>
    </SlideIn>
  );
}
