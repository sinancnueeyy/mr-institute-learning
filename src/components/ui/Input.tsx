import React from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text-primary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus-visible:ring-error/20 focus-visible:border-error',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {error && <span className="text-xs text-error mt-1 block">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
