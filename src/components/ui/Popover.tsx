import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils';
import { FadeIn } from '../animations/FadeIn';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Popover({ trigger, content, align = 'center', className }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <FadeIn
          duration={0.15}
          className={cn(
            'absolute z-50 mt-2 w-64 rounded-md border border-border bg-background p-4 shadow-floating',
            {
              'left-0': align === 'start',
              'left-1/2 -translate-x-1/2': align === 'center',
              'right-0': align === 'end',
            },
            className
          )}
        >
          {content}
        </FadeIn>
      )}
    </div>
  );
}
