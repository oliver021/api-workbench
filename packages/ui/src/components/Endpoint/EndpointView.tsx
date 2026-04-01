import { ParameterForm } from '@/components/RequestBuilder/ParameterForm';
import { RequestBodyForm } from '@/components/RequestBuilder/RequestBodyForm';
import { SendButton } from '@/components/RequestBuilder/SendButton';
import { ResponseViewer } from '@/components/Response/ResponseViewer';
import { MethodBadge, BackButton } from '@/components/MethodBadge';
import type { NormalizedEndpoint } from '@api-workbench/core';

interface EndpointViewProps {
  endpoint: NormalizedEndpoint;
  serverUrl: string;
}

export function EndpointView({ endpoint, serverUrl }: EndpointViewProps) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MethodBadge method={endpoint.method} size="lg" />
          <code className="text-lg font-mono font-medium">{endpoint.path}</code>
        </div>

        {endpoint.deprecated && (
          <span className="inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 mb-2">
            Deprecated
          </span>
        )}

        {endpoint.summary && (
          <h1 className="text-xl font-semibold mb-2">{endpoint.summary}</h1>
        )}

        {endpoint.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {endpoint.description}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {endpoint.parameters.length > 0 && (
          <ParameterForm parameters={endpoint.parameters} />
        )}

        {endpoint.requestBody && (
          <RequestBodyForm requestBody={endpoint.requestBody} />
        )}

        <SendButton endpoint={endpoint} serverUrl={serverUrl} />

        <ResponseViewer />
      </div>
    </div>
  );
}
