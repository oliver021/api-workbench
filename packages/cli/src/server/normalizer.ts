import type {
  NormalizedSpec,
  NormalizedEndpoint,
  HttpMethod,
  Tag,
  Parameter,
  RequestBody,
  ResponseMap,
  ResponseEntry,
  SchemaObject,
} from './types.js';
import { HTTP_METHODS } from './types.js';

interface RawSpec {
  openapi?: string;
  swagger?: string;
  info: { title?: string; version?: string; description?: string };
  servers?: { url: string; description?: string }[];
  paths?: Record<string, Record<string, RawOperation>>;
  tags?: Tag[];
  components?: { schemas?: Record<string, SchemaObject>; securitySchemes?: Record<string, unknown> };
}

interface RawOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  deprecated?: boolean;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: Record<string, ResponseEntry>;
  security?: { [name: string]: string[] }[];
  servers?: { url: string; description?: string }[];
}

export function normalizeSpec(raw: unknown): NormalizedSpec {
  const spec = raw as RawSpec;

  const openapi = spec.openapi || spec.swagger || '3.0.0';
  const info = spec.info || { title: 'API', version: '1.0.0' };
  const servers = spec.servers || [{ url: '/', description: 'Default server' }];
  const tags = spec.tags || [];
  const components = spec.components || {};

  const endpoints: NormalizedEndpoint[] = [];
  const paths = spec.paths || {};

  for (const [pathTemplate, pathItem] of Object.entries(paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method.toLowerCase() as keyof typeof pathItem] as RawOperation | undefined;
      if (!operation) continue;

      const parameters = normalizeParameters(
        pathItem.parameters as Parameter[] | undefined,
        operation.parameters
      );

      endpoints.push({
        id: `${method.toUpperCase()} ${pathTemplate}`,
        method: method,
        path: pathTemplate,
        summary: operation.summary,
        description: operation.description,
        operationId: operation.operationId,
        deprecated: operation.deprecated || false,
        tags: operation.tags || [],
        parameters,
        requestBody: operation.requestBody,
        responses: normalizeResponses(operation.responses || {}),
        security: operation.security,
        servers: operation.servers || servers,
      });
    }
  }

  return {
    openapi,
    info: {
      title: info.title || 'API',
      version: info.version || '1.0.0',
      description: info.description,
    },
    servers: servers as { url: string; description?: string }[],
    endpoints,
    tags,
    components,
    _raw: raw,
  };
}

function normalizeParameters(
  pathParams?: Parameter[],
  operationParams?: Parameter[]
): Parameter[] {
  const params: Parameter[] = [];

  if (pathParams) {
    for (const p of pathParams) {
      params.push({ ...p, in: p.in || 'path' });
    }
  }

  if (operationParams) {
    for (const p of operationParams) {
      const existing = params.findIndex((x) => x.name === p.name && x.in === p.in);
      if (existing === -1) {
        params.push({ ...p, in: p.in || 'query' });
      }
    }
  }

  return params;
}

function normalizeResponses(responses: Record<string, ResponseEntry>): ResponseMap {
  const result: ResponseMap = {};

  for (const [code, response] of Object.entries(responses)) {
    result[code] = {
      description: response.description,
      content: response.content,
      headers: response.headers as ResponseMap[string]['headers'],
    };
  }

  return result;
}
