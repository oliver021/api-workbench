import { Play } from 'lucide-react';
import type { NormalizedEndpoint, ResponseData } from '@api-workbench/core';
import { executeRequest } from '@/api/client';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

interface SendButtonProps {
  endpoint: NormalizedEndpoint;
  serverUrl: string;
}

export function SendButton({ endpoint, serverUrl }: SendButtonProps) {
  const { requestState, setRequestState } = useAppStore();

  const handleSend = async () => {
    setRequestState({ loading: true, error: null, response: null });

    try {
      const result = await executeRequest({
        method: endpoint.method,
        path: endpoint.path.replace(/\{([^}]+)\}/g, ''),
        url: serverUrl,
        params: {},
        body: undefined,
      });

      setRequestState({
        loading: false,
        response: result as ResponseData,
        error: null,
      });
    } catch (err) {
      setRequestState({
        loading: false,
        response: null,
        error: err instanceof Error ? err.message : 'Request failed',
      });
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={requestState.loading}
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm',
        'bg-primary text-primary-foreground',
        'hover:opacity-90 transition-opacity',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      <Play className={cn('w-4 h-4', requestState.loading && 'animate-pulse')} />
      {requestState.loading ? 'Sending...' : 'Send Request'}
    </button>
  );
}
