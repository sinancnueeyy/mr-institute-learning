import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-text-on-primary hover:bg-brand-primary-hover shadow-sm hover:shadow-md border border-transparent hover:border-brand-secondary/30',
        secondary: 'bg-surface text-brand-primary hover:bg-surface-muted border border-border-strong hover:border-brand-secondary/50',
        accent: 'bg-brand-secondary text-text-primary hover:bg-brand-secondary-hover shadow-sm hover:shadow-md border border-transparent hover:border-brand-primary/30',
        outline: 'border border-border bg-transparent hover:bg-surface-muted text-text-primary hover:border-brand-primary/50',
        ghost: 'hover:bg-brand-primary/5 hover:text-brand-primary text-text-secondary',
        danger: 'bg-error/10 text-error hover:bg-error hover:text-white border border-transparent',
        link: 'text-brand-primary underline-offset-4 hover:underline font-medium',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  }
);
Button.displayName = 'Button';
