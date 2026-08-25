import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught component error in boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 text-center selection:bg-amber-500 selection:text-black">
          <div className="max-w-md w-full bg-stone-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                {this.props.fallbackTitle || 'Display Recovery Mode'}
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                The interface encountered a momentary rendering issue. Click reload to refresh the state or return to the storefront.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-left overflow-hidden">
                <p className="text-[11px] font-mono text-rose-400 truncate">
                  {this.state.error.message || 'Component render exception'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
