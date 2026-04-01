import { useAppStore } from '@/stores/appStore';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export function ResponseViewer() {
  const { requestState } = useAppStore();

  if (requestState.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Sending request...</span>
        </div>
      </div>
    );
  }

  if (requestState.error) {
    return (
      <div className="border border-destructive/50 rounded-lg p-6 bg-destructive/5">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Request Failed</span>
        </div>
        <p className="text-sm text-destructive/80 mt-2">{requestState.error}</p>
      </div>
    );
  }

  if (!requestState.response) {
    return (
      <div className="border border-dashed rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-sm">
          Send a request to see the response here
        </p>
      </div>
    );
  }

  const { response } = requestState;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
        <div className="flex items-center gap-3">
          <StatusBadge status={response.status} statusText={response.statusText} />
          <span className="text-xs text-muted-foreground font-mono">
            {response.timing}ms
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {Object.keys(response.headers || {}).length} headers
        </span>
      </div>

      {response.headers && Object.keys(response.headers).length > 0 && (
        <div className="border-b px-4 py-2 bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Headers
          </p>
          <div className="space-y-1">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-xs font-mono">
                <span className="text-primary font-medium">{key}:</span>
                <span className="text-muted-foreground truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <pre
          className={cn(
            'text-sm font-mono overflow-x-auto p-3 bg-card rounded border',
            'max-h-[500px] overflow-y-auto'
          )}
          spellCheck={false}
        >
          {typeof response.body === 'string'
            ? response.body
            : JSON.stringify(response.body, null, 2)}
        </pre>
      </div>
    </div>
  );
}
