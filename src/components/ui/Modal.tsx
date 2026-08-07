import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from './Button';
import { FadeIn } from '../animations/FadeIn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <FadeIn className="z-50 flex w-full justify-center px-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'w-full max-w-lg rounded-xl bg-background p-6 shadow-modal border border-border',
            className
          )}
        >
          <div className="flex items-center justify-between mb-4">
            {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full ml-auto">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="relative flex-auto">
            {children}
          </div>
          {footer && (
            <div className="mt-6 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
