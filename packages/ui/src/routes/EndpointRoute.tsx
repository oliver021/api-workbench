import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSpec } from '@/hooks/useSpec';
import { useAppStore } from '@/stores/appStore';
import { EndpointView } from '@/components/Endpoint/EndpointView';
import type { NormalizedEndpoint } from '@api-workbench/core';

export function EndpointRoute() {
  const { method, '*': path } = useParams<{ method: string; '*': string }>();
  const { data: spec } = useSpec();
  const { setSelectedEndpoint } = useAppStore();

  const fullPath = path ? `/${path}` : '';
  const endpointId = `${method?.toUpperCase()} ${fullPath}`;

  const endpoint = spec?.endpoints.find((e: NormalizedEndpoint) => e.id === endpointId);

  useEffect(() => {
    if (endpoint) {
      setSelectedEndpoint(endpoint);
    }
    return () => setSelectedEndpoint(null);
  }, [endpoint, setSelectedEndpoint]);

  if (!spec) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-lg font-semibold text-destructive">Endpoint not found</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {method?.toUpperCase()} {fullPath} does not exist in this spec.
        </p>
      </div>
    );
  }

  const serverUrl = spec.servers[0]?.url || 'http://localhost:3000';

  return <EndpointView endpoint={endpoint} serverUrl={serverUrl} />;
}
