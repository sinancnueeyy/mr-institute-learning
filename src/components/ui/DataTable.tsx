import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { EmptyState } from './EmptyState';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  
  // Selection
  selectedIds?: string[];
  onSelectRows?: (ids: string[]) => void;
  
  // Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
  };
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading,
  emptyMessage = 'No data available',
  selectedIds,
  onSelectRows,
  pagination,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <div className="h-10 w-full animate-shimmer rounded bg-secondary" />
        <div className="h-20 w-full animate-shimmer rounded bg-secondary" />
        <div className="h-20 w-full animate-shimmer rounded bg-secondary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 border border-border rounded-lg bg-background">
        <EmptyState title={emptyMessage} />
      </div>
    );
  }

  const allSelected = data.length > 0 && selectedIds?.length === data.length;
  
  const toggleSelectAll = () => {
    if (!onSelectRows) return;
    if (allSelected) {
      onSelectRows([]);
    } else {
      onSelectRows(data.map(keyExtractor));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (!onSelectRows || !selectedIds) return;
    if (selectedIds.includes(id)) {
      onSelectRows(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectRows([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectRows && (
              <TableHead className="w-12">
                <button 
                  onClick={toggleSelectAll}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  {allSelected ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5" />}
                </button>
              </TableHead>
            )}
            {columns.map((col, i) => (
              <TableHead key={i}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const id = keyExtractor(item);
            const isSelected = selectedIds?.includes(id);
            
            return (
              <TableRow 
                key={id}
                className={isSelected ? 'bg-primary/5' : ''}
              >
                {onSelectRows && (
                  <TableCell>
                    <button 
                      onClick={() => toggleSelectRow(id)}
                      className="text-text-muted hover:text-primary transition-colors"
                    >
                      {isSelected ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5" />}
                    </button>
                  </TableCell>
                )}
                {columns.map((col, i) => (
                  <TableCell key={i}>
                    {col.cell
                      ? col.cell(item)
                      : (item[col.accessorKey as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-sm text-text-secondary">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={pagination.prevPage}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={pagination.nextPage}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
