import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { SlideIn } from '../animations/SlideIn';
import { cn } from '../../utils';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FeatureCard({ title, description, icon, delay = 0, className }: FeatureCardProps) {
  return (
    <SlideIn delay={delay} duration={0.5} direction="up" className="h-full">
      <Card className={cn("h-full hover:shadow-floating transition-all duration-300 border-border/50 hover:-translate-y-1", className)}>
        <CardContent className="p-8 flex flex-col h-full">
          <div className="h-12 w-12 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
          <p className="text-text-secondary leading-relaxed flex-grow">
            {description}
          </p>
        </CardContent>
      </Card>
    </SlideIn>
  );
}
