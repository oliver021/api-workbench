import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: number;
  statusText?: string;
}

export function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const isSuccess = status >= 200 && status < 300;
  const isRedirect = status >= 300 && status < 400;
  const isClientError = status >= 400 && status < 500;
  const isServerError = status >= 500;

  const colorClass = isSuccess
    ? 'bg-green-100 text-green-800'
    : isRedirect
    ? 'bg-blue-100 text-blue-800'
    : isClientError
    ? 'bg-yellow-100 text-yellow-800'
    : isServerError
    ? 'bg-red-100 text-red-800'
    : 'bg-muted text-muted-foreground';

  return (
    <span className={cn('inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-sm font-medium', colorClass)}>
      {status}
      {statusText && <span className="text-xs opacity-75">{statusText}</span>}
    </span>
  );
}
