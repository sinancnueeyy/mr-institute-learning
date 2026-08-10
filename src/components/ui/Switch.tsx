import React from 'react';
import { cn } from '../../utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const reactId = React.useId();
    const generatedId = id || reactId;
    return (
      <div className="flex items-center">
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            id={generatedId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-border appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-5 checked:border-brand-primary",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            style={{ top: '2px', left: '2px' }}
            {...props}
          />
          <label
            htmlFor={generatedId}
            className={cn(
              "toggle-label block overflow-hidden h-6 rounded-full bg-border cursor-pointer transition-colors duration-200 ease-in-out",
              props.checked && "bg-brand-primary",
              disabled && "cursor-not-allowed opacity-50"
            )}
          ></label>
        </div>
        {label && (
          <label htmlFor={generatedId} className={cn("text-sm font-medium text-text-primary cursor-pointer", disabled && "cursor-not-allowed opacity-50")}>
            {label}
          </label>
        )}
      </div>
    );
  }
);
Switch.displayName = 'Switch';
