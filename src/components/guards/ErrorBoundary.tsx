import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError = 
        this.state.error?.message.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message.includes('Importing a module script failed') ||
        this.state.error?.name === 'ChunkLoadError';

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-surface">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-border text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              {isChunkError ? 'Application Update Available' : 'Something went wrong'}
            </h2>
            <p className="text-text-secondary mb-8">
              {isChunkError 
                ? 'A new version of the application has been deployed. Please reload the page to apply the updates.' 
                : 'An unexpected error occurred while rendering the page. We have been notified and are looking into it.'}
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> 
                {isChunkError ? 'Apply Update & Reload' : 'Reload Application'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full"
              >
                Return to Homepage
              </Button>
            </div>
            {import.meta.env.DEV && !isChunkError && (
              <div className="mt-8 p-4 bg-error/5 rounded text-left overflow-auto text-xs text-error font-mono">
                {this.state.error?.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
