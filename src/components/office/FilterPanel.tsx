import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Search, Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  searchPlaceholder?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions = [],
  searchPlaceholder = 'Search...'
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-md border border-border shadow-sm mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {statusOptions.length > 0 && onStatusChange && (
        <div className="w-full sm:w-48 flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted shrink-0" />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
};
