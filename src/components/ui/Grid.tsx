import React from 'react';
import { cn } from '../../utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          {
            'grid-cols-1': cols === 1,
            'grid-cols-1 sm:grid-cols-2': cols === 2,
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': cols === 3,
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': cols === 4,
            'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5': cols === 5,
            'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6': cols === 6,
            'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12': cols === 12,
            'gap-0': gap === 'none',
            'gap-4': gap === 'sm',
            'gap-6': gap === 'md',
            'gap-8': gap === 'lg',
            'gap-12': gap === 'xl',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Grid.displayName = 'Grid';
