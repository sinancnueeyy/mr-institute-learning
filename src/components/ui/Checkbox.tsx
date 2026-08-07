import React from 'react';
import { cn } from '../../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const reactId = React.useId();
    const generatedId = id || reactId;
    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            id={generatedId}
            ref={ref}
            className={cn(
              'h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 transition-all',
              error && 'border-error focus:ring-error',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-2 text-sm">
            <label htmlFor={generatedId} className="font-medium text-text-primary cursor-pointer">
              {label}
            </label>
            {error && <p className="text-xs text-error mt-0.5">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
