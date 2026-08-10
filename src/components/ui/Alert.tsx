import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-surface text-text-primary',
        destructive:
          'text-error border-error/50 bg-error/10 [&>svg]:text-error',
        success:
          'text-success border-success/50 bg-success/10 [&>svg]:text-success',
        warning:
          'text-warning border-warning/50 bg-warning/10 [&>svg]:text-warning',
        info:
          'text-info border-info/50 bg-info/10 [&>svg]:text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
  icon?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, icon = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && variant === 'destructive' && <AlertCircle className="h-5 w-5" />}
        {icon && variant === 'success' && <CheckCircle className="h-5 w-5" />}
        {icon && variant === 'warning' && <AlertTriangle className="h-5 w-5" />}
        {icon && (variant === 'info' || variant === 'default') && <Info className="h-5 w-5" />}
        
        <div className="flex flex-col gap-1">
          {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';
