import React from 'react';

interface PreviewErrorBoundaryProps {
  resetKey: string;
  onResetCode: () => void;
  children: React.ReactNode;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export default class PreviewErrorBoundary extends React.Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Errore di esecuzione nel componente.',
    };
  }

  componentDidUpdate(prevProps: PreviewErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, message: '' });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md rounded-xl border border-rose-200 bg-rose-50 p-5 text-left">
          <h4 className="text-sm font-semibold text-rose-900">
            Errore nell&apos;anteprima del componente
          </h4>
          <p className="mt-1.5 font-mono text-xs text-rose-800 break-words">
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, message: '' });
              this.props.onResetCode();
            }}
            className="mt-4 rounded-lg bg-rose-700 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-rose-800 cursor-pointer"
          >
            Ripristina codice originale
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
