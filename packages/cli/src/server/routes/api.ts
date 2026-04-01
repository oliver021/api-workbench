import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { NormalizedEndpoint, Tag } from '../types.js';

interface EndpointParams {
  id: string;
}

interface TagParams {
  name: string;
}

interface RefreshResult {
  title: string;
  endpointCount: number;
}

function decodeId(id: string): { method: string; path: string } | null {
  const spaceIdx = id.indexOf(' ');
  if (spaceIdx === -1) return null;
  return {
    method: id.substring(0, spaceIdx),
    path: id.substring(spaceIdx + 1),
  };
}

export async function apiRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/spec', async (_request: FastifyRequest, reply: FastifyReply) => {
    const { endpoints, ...specWithoutEndpoints } = fastify.serverState.spec;
    return reply.send(specWithoutEndpoints);
  });

  fastify.get('/api/spec/full', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(fastify.serverState.spec);
  });

  fastify.get('/api/source', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      source: fastify.serverState.source,
      sourceType: fastify.serverState.sourceType,
    });
  });

  fastify.post<{ Body: Record<string, never> }>(
    '/api/refresh',
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const { ApiWorkbenchServer } = await import('../index.js');
      const server = (fastify as unknown as { server?: { _serverInstance?: InstanceType<typeof ApiWorkbenchServer> } }).server?._serverInstance;

      if (!server) {
        return reply.status(500).send({ error: 'Server reference not available' });
      }

      try {
        const result = await server.refresh();
        return reply.send(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Refresh failed';
        return reply.status(500).send({ error: message });
      }
    }
  );

  fastify.get('/api/endpoints', async (request: FastifyRequest<{ Querystring: { tag?: string; search?: string } }>, reply: FastifyReply) => {
    let endpoints = fastify.serverState.spec.endpoints;

    if (request.query.tag) {
      endpoints = endpoints.filter((e) => e.tags.includes(request.query.tag!));
    }

    if (request.query.search) {
      const q = request.query.search.toLowerCase();
      endpoints = endpoints.filter(
        (e: NormalizedEndpoint) =>
          e.path.toLowerCase().includes(q) ||
          e.method.toLowerCase().includes(q) ||
          (e.summary && e.summary.toLowerCase().includes(q)) ||
          e.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    return reply.send(endpoints);
  });

  fastify.get<{ Params: EndpointParams }>(
    '/api/endpoints/:id',
    async (request, reply) => {
      const decoded = decodeId(decodeURIComponent(request.params.id));
      if (!decoded) {
        return reply.status(400).send({ error: 'Invalid endpoint id' });
      }

      const endpoint = fastify.serverState.spec.endpoints.find(
        (e: NormalizedEndpoint) =>
          e.method.toUpperCase() === decoded.method.toUpperCase() &&
          e.path === decoded.path
      );

      if (!endpoint) {
        return reply.status(404).send({ error: 'Endpoint not found' });
      }

      return reply.send(endpoint);
    }
  );

  fastify.get('/api/tags', async (_request: FastifyRequest, reply: FastifyReply) => {
    const tagCounts = new Map<string, number>();

    for (const endpoint of fastify.serverState.spec.endpoints) {
      for (const tag of endpoint.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    const tags = fastify.serverState.spec.tags.map((t: Tag) => ({
      name: t.name,
      description: t.description,
      count: tagCounts.get(t.name) || 0,
    }));

    for (const [name, count] of tagCounts) {
      if (!tags.find((t) => t.name === name)) {
        tags.push({ name, count, description: undefined });
      }
    }

    return reply.send(tags);
  });

  fastify.get<{ Params: TagParams }>(
    '/api/schemas/:name',
    async (request, reply) => {
      const name = request.params.name;
      const schema = fastify.serverState.spec.components.schemas?.[name];

      if (!schema) {
        return reply.status(404).send({ error: `Schema '${name}' not found` });
      }

      return reply.send(schema);
    }
  );
}
