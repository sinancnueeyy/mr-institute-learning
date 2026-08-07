import React, { useState } from 'react';
import { cn } from '../../utils';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, tabs, defaultTab, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="flex space-x-1 border-b border-border bg-background p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-t-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                activeTab === tab.id
                  ? 'bg-surface text-primary border-b-2 border-primary'
                  : 'text-text-muted hover:text-text-primary hover:bg-secondary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';
