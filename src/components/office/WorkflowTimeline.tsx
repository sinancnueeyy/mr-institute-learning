import React from 'react';
import { cn } from '../../utils';
import { Check, Clock, User, MessageSquare } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: 'check' | 'clock' | 'user' | 'message';
  status?: 'completed' | 'current' | 'upcoming';
}

interface WorkflowTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'check': return <Check className="w-4 h-4" />;
    case 'clock': return <Clock className="w-4 h-4" />;
    case 'user': return <User className="w-4 h-4" />;
    case 'message': return <MessageSquare className="w-4 h-4" />;
    default: return <div className="w-2 h-2 rounded-full bg-current" />;
  }
};

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ events, className }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isCompleted = event.status === 'completed';
        const isCurrent = event.status === 'current';

        return (
          <div key={event.id} className="relative flex gap-4">
            {/* Line */}
            {!isLast && (
              <div 
                className={cn(
                  "absolute left-4 top-10 bottom-0 w-[2px] -ml-px",
                  isCompleted ? "bg-brand-primary" : "bg-border"
                )} 
              />
            )}
            
            {/* Icon */}
            <div 
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                isCompleted ? "border-brand-primary text-brand-primary" : 
                isCurrent ? "border-brand-primary text-brand-primary ring-4 ring-brand-primary/10" : 
                "border-border text-text-muted"
              )}
            >
              {getIcon(event.icon)}
            </div>
            
            {/* Content */}
            <div className="flex flex-col pb-6">
              <h4 className={cn(
                "text-sm font-semibold",
                isCompleted || isCurrent ? "text-text-primary" : "text-text-secondary"
              )}>
                {event.title}
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                {new Date(event.date).toLocaleString()}
              </p>
              {event.description && (
                <p className="text-sm text-text-secondary mt-2 bg-surface p-3 rounded-lg border border-border">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
