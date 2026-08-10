import { Loader2 } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { Container } from './Container';

export function PageLoader() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-brand-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

export function SectionLoader() {
  return (
    <div className="py-24 bg-surface">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-16 w-3/4 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-12 w-1/3 rounded-lg" />
          </div>
          <Skeleton className="h-96 w-full rounded-md" />
        </div>
      </Container>
    </div>
  );
}

export function TableLoader() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-1/4 rounded-md" />
        <Skeleton className="h-10 w-1/6 rounded-md" />
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-border bg-surface/50">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-border">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormLoader() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-md border border-border shadow-sm">
      <Skeleton className="h-8 w-1/2 mb-8" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="pt-4 flex justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function ButtonLoader() {
  return <Loader2 className="w-5 h-5 animate-spin" />;
}
