import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-2xl border border-white/5">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4 opacity-80" />
      <h3 className="text-xl font-medium text-text mb-2">Something went wrong</h3>
      <p className="text-textMuted mb-6">{message || 'Unable to load books at this time.'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-surface hover:bg-surfaceHover border border-white/10 rounded-full text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};
