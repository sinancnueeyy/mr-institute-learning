import React from 'react';
import { cn } from '../../utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'surface' | 'primary' | 'secondary';
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = 'md', background = 'transparent', ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          {
            'py-0': spacing === 'none',
            'py-8 sm:py-12': spacing === 'sm',
            'py-12 sm:py-16 lg:py-20': spacing === 'md',
            'py-16 sm:py-24 lg:py-32': spacing === 'lg',
            'py-24 sm:py-32 lg:py-40': spacing === 'xl',
            'bg-transparent': background === 'transparent',
            'bg-surface': background === 'surface',
            'bg-brand-primary text-text-on-primary': background === 'primary',
            'bg-brand-secondary text-brand-secondary-foreground': background === 'secondary',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';
