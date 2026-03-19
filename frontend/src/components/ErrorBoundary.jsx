import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-20 h-20 mb-6 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center border border-red-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
          <p className="text-dark-300 mb-8 max-w-md">
            We encountered an unexpected error. Please try refreshing the page or navigating back to the home screen.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-dark-950 font-semibold rounded-full transition-colors w-full sm:w-auto"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-full border border-dark-700 transition-colors w-full sm:w-auto"
            >
              Go to Homepage
            </button>
          </div>
          
          {import.meta.env.MODE === 'development' && this.state.error && (
            <div className="mt-10 p-4 bg-dark-800 rounded-xl text-left overflow-auto max-w-2xl w-full border border-dark-700">
              <p className="text-red-400 font-mono text-sm mb-2">{this.state.error.toString()}</p>
              <pre className="text-dark-400 text-xs font-mono break-words whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
