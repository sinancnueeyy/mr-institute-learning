import React, { useEffect } from 'react';
import { cn } from '../../utils';
import { ScaleIn } from '../animations/ScaleIn';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, footer, className }: DialogProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <ScaleIn className="z-50 flex w-full justify-center px-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'w-full max-w-md rounded-xl bg-background p-6 shadow-modal border border-border',
            className
          )}
        >
          <div className="flex flex-col mb-4">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
          </div>
          {children && (
            <div className="relative py-2">
              {children}
            </div>
          )}
          {footer && (
            <div className="mt-6 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </ScaleIn>
    </div>
  );
}
