import { ReactNode } from 'react';

export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <svg className="animate-spin h-8 w-8 text-ocean" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-sm text-dim-grey">{text}</p>
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="text-4xl text-dim-grey">{icon}</div>
      <h3 className="text-lg font-semibold text-carbon">{title}</h3>
      {description && <p className="text-sm text-dim-grey max-w-md">{description}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="text-4xl">⚠️</div>
      <h3 className="text-lg font-semibold text-red">Something went wrong</h3>
      <p className="text-sm text-dim-grey">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-2">
          Try Again
        </button>
      )}
    </div>
  );
}
