import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });

    // A deployment can leave an open tab with an old lazy chunk name while the
    // service worker has already cached the new shell. Recover once instead of
    // trapping the user on the error screen forever.
    const message = String(error?.message || error || '');
    const isStaleChunk = /dynamically imported module|Loading chunk|ChunkLoadError/i.test(message);
    if (isStaleChunk && !sessionStorage.getItem('techboy_chunk_recovery')) {
      sessionStorage.setItem('techboy_chunk_recovery', '1');
      Promise.all([
        'serviceWorker' in navigator
          ? navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
          : Promise.resolve(),
        'caches' in window
          ? caches.keys().then(names => Promise.all(names.map(name => caches.delete(name))))
          : Promise.resolve()
      ]).finally(() => window.location.reload());
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#111', color: '#ff3333', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Something went wrong.</h2>
          <div style={{ whiteSpace: 'pre-wrap', marginTop: '10px', padding: '10px', background: '#222', border: '1px solid #444', color: '#ffaaaa' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </div>
          <button 
            onClick={() => {
              sessionStorage.removeItem('techboy_chunk_recovery');
              window.location.reload();
            }}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#ff3333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
