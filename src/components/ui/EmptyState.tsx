import React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, actionLabel, onAction, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center p-12 text-center rounded-md border border-dashed border-border bg-surface/50 transition-all duration-300',
          className
        )}
        {...props}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary mb-6 shadow-sm">
          {icon || <FolderOpen className="h-8 w-8" />}
        </div>
        <h3 className="mt-2 text-lg font-bold text-text-primary">{title}</h3>
        {description && <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">{description}</p>}
        {actionLabel && onAction && (
          <div className="mt-6">
            <Button onClick={onAction}>{actionLabel}</Button>
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
