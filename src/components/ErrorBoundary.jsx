import React from 'react';
import { Button } from 'components/ui/button';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  componentDidMount() {
    this._onError = (event) => {
      console.error('[Global Error]', event);
    };
    this._onRejection = (event) => {
      console.error('[Unhandled Rejection]', event);
    };
    window.addEventListener('error', this._onError);
    window.addEventListener('unhandledrejection', this._onRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this._onError);
    window.removeEventListener('unhandledrejection', this._onRejection);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen p-6">
          <div className="flex flex-col items-center gap-4 max-w-120">
            <AlertTriangle size={48} className="text-red-500" />
            <h2 className="text-2xl font-bold text-center">Something went wrong</h2>
            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error?.message && (
              <p
                className="text-sm text-center p-3 w-full wrap-break-word text-red-400"
                style={{
                  backgroundColor: "var(--status-error-bg)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                {this.state.error.message}
              </p>
            )}
            <Button
              onClick={() => window.location.reload()}
              size="lg"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
