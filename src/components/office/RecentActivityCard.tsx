import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowRight, Bell } from 'lucide-react';
import { WorkflowTimeline, type TimelineEvent } from './WorkflowTimeline';
import { Link } from 'react-router-dom';

interface RecentActivityCardProps {
  title?: string;
  activities: TimelineEvent[];
  viewAllLink?: string;
  emptyMessage?: string;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  title = 'Recent Activity',
  activities,
  viewAllLink,
  emptyMessage = 'No recent activity.'
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" />
          {title}
        </CardTitle>
        {viewAllLink && (
          <Button variant="ghost" size="sm" asChild className="text-brand-primary">
            <Link to={viewAllLink}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {activities.length > 0 ? (
          <div className="pt-4">
            <WorkflowTimeline events={activities} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text-muted py-8">
            <Bell className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
