import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { HttpMethod } from '../types.js';

interface ProxyParams {
  method: string;
  path: string;
}

interface ProxyBody {
  url?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: unknown;
}

const VALID_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export async function proxyRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.all<{ Params: ProxyParams; Body: ProxyBody }>(
    '/proxy/:method/*',
    async (request, reply) => {
      const { method, path } = request.params;
      const upperMethod = method.toUpperCase() as HttpMethod;

      if (!VALID_METHODS.includes(upperMethod)) {
        return reply.status(400).send({ error: `Invalid method: ${method}` });
      }

      const { url, headers = {}, params = {}, body } = request.body || {};

      if (!url) {
        return reply.status(400).send({ error: 'url is required in body' });
      }

      const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const targetPath = path ? `/${path}` : '';
      const targetUrl = `${baseUrl}${targetPath}`;

      const queryString = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') {
          queryString.append(key, String(value));
        }
      }

      const finalUrl = queryString.toString() ? `${targetUrl}?${queryString}` : targetUrl;

      const mergedHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      };

      const startTime = Date.now();

      try {
        const response = await fetch(finalUrl, {
          method: upperMethod,
          headers: mergedHeaders,
          body: ['POST', 'PUT', 'PATCH'].includes(upperMethod) && body !== undefined
            ? JSON.stringify(body)
            : undefined,
        });

        const timing = Date.now() - startTime;

        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        let responseBody: unknown;
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          try {
            responseBody = await response.json();
          } catch {
            responseBody = await response.text();
          }
        } else {
          responseBody = await response.text();
        }

        return reply.send({
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          body: responseBody,
          timing,
        });
      } catch (err) {
        const timing = Date.now() - startTime;
        const error = err instanceof Error ? err.message : 'Request failed';

        return reply.status(502).send({
          status: 502,
          statusText: 'Bad Gateway',
          headers: {},
          body: null,
          timing,
          error,
        });
      }
    }
  );
}
