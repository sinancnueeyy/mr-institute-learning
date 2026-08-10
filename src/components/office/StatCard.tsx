import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300", 
        onClick ? "cursor-pointer hover:shadow-md hover:border-brand-primary/20" : "",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-brand-primary/5 text-brand-primary flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-4">
          <h2 className="text-3xl font-bold text-text-primary">{value}</h2>
          
          {trend && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              trend.isPositive ? "text-success" : "text-error"
            )}>
              {trend.isPositive ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {trend.value}%
              <span className="text-text-muted ml-1 text-xs">{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
