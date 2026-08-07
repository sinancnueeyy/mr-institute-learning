import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from './Button';
import { SlideIn } from '../animations/SlideIn';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export function Drawer({ isOpen, onClose, title, children, position = 'right', className }: DrawerProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div className={cn("fixed inset-y-0 z-50 flex", position === 'right' ? 'right-0' : 'left-0')}>
        <SlideIn direction={position === 'right' ? 'left' : 'right'} className="h-full flex">
          <div
            role="dialog"
            aria-modal="true"
            className={cn(
              'w-full max-w-sm h-full bg-background shadow-modal border-border flex flex-col',
              position === 'right' ? 'border-l' : 'border-r',
              className
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full ml-auto">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="relative flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </div>
        </SlideIn>
      </div>
    </div>
  );
}
