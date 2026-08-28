import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can log to an external logging service here
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-8">
          <div className="max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">An unexpected error occurred</h2>
            <p className="text-sm text-muted-foreground mb-4">We captured details and are working on a fix.</p>
            <pre className="text-xs text-left bg-muted/10 p-4 rounded overflow-auto">{this.state.error?.stack}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactNode;
  }
}
