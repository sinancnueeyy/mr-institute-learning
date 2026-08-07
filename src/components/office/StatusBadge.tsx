import React from 'react';
import { cn } from '../../utils';
import { CheckCircle2, Clock, XCircle, AlertCircle, HelpCircle, FileSearch, ShieldCheck } from 'lucide-react';

export type StatusType = 
  | 'New' | 'Under Review' | 'Documents Pending' | 'Verified' | 'Approved' | 'Rejected'
  | 'Contacted' | 'Follow-up' | 'Interested' | 'Converted' | 'Closed' | 'Hold' | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  // Admissions & General
  'New': { color: 'bg-info/10 text-info border-info/20', icon: <AlertCircle className="w-3 h-3 mr-1" /> },
  'Under Review': { color: 'bg-warning/10 text-warning border-warning/20', icon: <FileSearch className="w-3 h-3 mr-1" /> },
  'Documents Pending': { color: 'bg-warning/10 text-warning border-warning/20', icon: <Clock className="w-3 h-3 mr-1" /> },
  'Verified': { color: 'bg-success/10 text-success border-success/20', icon: <ShieldCheck className="w-3 h-3 mr-1" /> },
  'Approved': { color: 'bg-success/10 text-success border-success/20', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
  'Rejected': { color: 'bg-error/10 text-error border-error/20', icon: <XCircle className="w-3 h-3 mr-1" /> },
  'Hold': { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <Clock className="w-3 h-3 mr-1" /> },
  
  // Enquiries
  'Contacted': { color: 'bg-primary/10 text-primary border-primary/20', icon: <HelpCircle className="w-3 h-3 mr-1" /> },
  'Follow-up': { color: 'bg-warning/10 text-warning border-warning/20', icon: <Clock className="w-3 h-3 mr-1" /> },
  'Interested': { color: 'bg-info/10 text-info border-info/20', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
  'Converted': { color: 'bg-success/10 text-success border-success/20', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
  'Closed': { color: 'bg-gray-100 text-gray-500 border-gray-200', icon: <XCircle className="w-3 h-3 mr-1" /> },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: null };
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.color,
      className
    )}>
      {config.icon}
      {status}
    </span>
  );
};
