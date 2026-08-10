import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils';
import { SlideIn } from '../animations/SlideIn';
import { Button } from './Button';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, title, message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[type];

  const typeStyles = {
    success: 'border-success text-success bg-success/10',
    error: 'border-error text-error bg-error/10',
    warning: 'border-warning text-warning bg-warning/10',
    info: 'border-info text-info bg-info/10',
  }[type];

  return (
    <SlideIn direction="left" duration={0.3} className="pointer-events-auto w-full max-w-sm">
      <div className={cn('flex items-start rounded-lg border p-4 shadow-floating bg-surface', typeStyles)}>
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
        </div>
        <div className="ml-4 flex shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onClose(id)} className="h-6 w-6 rounded-full inline-flex text-current hover:bg-black/5 dark:hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </SlideIn>
  );
}
