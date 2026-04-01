export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface SchemaObject {
  type?: string;
  format?: string;
  description?: string;
  example?: unknown;
  default?: unknown;
  enum?: unknown[];
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  additionalProperties?: SchemaObject | boolean;
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  allOf?: SchemaObject[];
  $ref?: string;
  nullable?: boolean;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  discriminator?: { propertyName: string; mapping?: Record<string, string> };
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required: boolean;
  schema: SchemaObject;
  description?: string;
  example?: unknown;
  deprecated?: boolean;
}

export interface MediaType {
  schema?: SchemaObject;
  example?: unknown;
  examples?: Record<string, { value?: unknown; summary?: string }>;
}

export interface RequestBody {
  required: boolean;
  description?: string;
  content: Record<string, MediaType>;
}

export interface ResponseEntry {
  description?: string;
  content?: Record<string, MediaType>;
  headers?: Record<string, { schema?: SchemaObject; description?: string }>;
}

export interface SecurityRequirement {
  [name: string]: string[];
}

export interface NormalizedEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary?: string;
  description?: string;
  operationId?: string;
  deprecated: boolean;
  tags: string[];
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: ResponseMap;
  security?: SecurityRequirement[];
  servers?: { url: string; description?: string }[];
  _sourceRef?: string;
}

export type ResponseMap = Record<string, ResponseEntry>;

export interface Tag {
  name: string;
  description?: string;
}

export interface NormalizedSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    contact?: { name?: string; url?: string; email?: string };
    license?: { name: string; url?: string };
  };
  servers: { url: string; description?: string }[];
  endpoints: NormalizedEndpoint[];
  tags: Tag[];
  components: {
    schemas?: Record<string, SchemaObject>;
    securitySchemes?: Record<string, unknown>;
  };
  _raw?: unknown;
}

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  PATCH: '#50e3c2',
  DELETE: '#f93e3e',
  HEAD: '#9012fe',
  OPTIONS: '#0d5aa7',
};
export const DEFAULT_SERVER_PORT = 3001;
export const DEFAULT_SERVERS = ['http://localhost:3001'];
