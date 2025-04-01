import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleNavigateHome = (): void => {
    window.location.href = '/';
  };

  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
          <div className="w-full max-w-md">
            <Alert variant="destructive" className="mb-6">
              <AlertTitle className="text-xl font-semibold mb-2">Something went wrong</AlertTitle>
              <AlertDescription>
                <p className="mb-4">
                  We're sorry, but something unexpected happened. The issue has been logged and we're working on it.
                </p>
                {error && (
                  <div className="bg-destructive/10 p-3 rounded text-sm font-mono mb-4 max-h-32 overflow-auto">
                    {error.toString()}
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3">
              <Button onClick={this.handleReload} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button variant="outline" onClick={this.handleNavigateHome} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary; 