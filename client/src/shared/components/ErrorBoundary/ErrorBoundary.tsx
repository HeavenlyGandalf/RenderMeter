import { Component, type ErrorInfo, type ReactNode } from 'react';
import i18n from '../../../i18n';
import s from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Uncaught render error:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className={s.wrap} role="alert">
        <div className={s.card}>
          <h1 className={s.title}>{i18n.t('errorBoundary.title')}</h1>
          <p className={s.message}>{i18n.t('errorBoundary.message')}</p>
          {this.state.message && <pre className={s.detail}>{this.state.message}</pre>}
          <button className="btn-primary" onClick={this.handleReload}>
            {i18n.t('errorBoundary.reload')}
          </button>
        </div>
      </div>
    );
  }
}
