import { useState, useMemo } from 'react';

type FilterValue = string | number | boolean | null | undefined;

export function useFilters<T>(items: T[], searchableFields: (keyof T)[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [sortBy, setSortBy] = useState<{ field: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Apply specific filters
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => item[key as keyof T] === value);
      }
    });

    // Apply global search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => {
        return searchableFields.some(field => {
          const val = item[field];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        });
      });
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const valA = a[sortBy.field];
        const valB = b[sortBy.field];
        
        if (valA === valB) return 0;
        
        const isAsc = sortBy.direction === 'asc';
        
        if (valA === null || valA === undefined) return isAsc ? 1 : -1;
        if (valB === null || valB === undefined) return isAsc ? -1 : 1;
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        
        return isAsc ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
      });
    }

    return result;
  }, [items, searchTerm, filters, sortBy, searchableFields]);

  const updateFilter = (key: string, value: FilterValue) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleSort = (field: keyof T) => {
    setSortBy(prev => {
      if (prev?.field === field) {
        return prev.direction === 'asc'
          ? { field, direction: 'desc' }
          : null; // Toggle off if already desc
      }
      return { field, direction: 'asc' };
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    handleSort,
    filteredItems: filteredAndSortedItems
  };
}
