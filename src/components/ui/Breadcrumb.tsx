import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="breadcrumb" className={cn('flex', className)} {...props}>
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center">
                {isLast ? (
                  <span className="text-sm font-medium text-text-primary" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href || '#'}
                    className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
                {!isLast && <ChevronRight className="mx-2 h-4 w-4 text-text-muted" />}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';
