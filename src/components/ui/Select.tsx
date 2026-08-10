import React from 'react';
import { cn } from '../../utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-error focus-visible:ring-error',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-text-muted pointer-events-none" />
        {error && <span className="text-xs text-error mt-1 block">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
