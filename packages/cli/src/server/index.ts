import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { loadSpec } from './loader.js';
import { parseSpec } from './parser.js';
import { normalizeSpec } from './normalizer.js';
import type { NormalizedSpec } from './types.js';
import { DEFAULT_SERVER_PORT } from './types.js';

export interface ServerState {
  source: string;
  sourceType: 'file' | 'url';
  spec: NormalizedSpec;
}

export interface ServeOptions {
  port?: number;
  host?: string;
  source: string;
  uiDistPath?: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    serverState: ServerState;
  }
}

export class ApiWorkbenchServer {
  private fastify: ReturnType<typeof Fastify>;
  private state: ServerState | null = null;
  private readonly options: ServeOptions;

  constructor(options: ServeOptions) {
    this.options = options;
    this.fastify = Fastify({ logger: false });
  }

  async start(): Promise<void> {
    const { port = DEFAULT_SERVER_PORT, host = '127.0.0.1', source, uiDistPath } = this.options;

    await this.fastify.register(cors, { origin: true });
    await this.fastify.register(websocket);

    const sourceType = this.detectSourceType(source);
    this.state = await this.loadSource(source, sourceType);
    this.fastify.decorate('serverState', this.state);

    await this.registerApiRoutes();
    await this.registerProxyRoutes();

    if (uiDistPath && fs.existsSync(uiDistPath)) {
      await this.serveStaticFiles(uiDistPath);
    }

    await this.fastify.listen({ port, host });

    console.log(pc.green(`\n  API Workbench running`));
    console.log(`  Source:  ${pc.cyan(source)} (${sourceType})`);
    console.log(`  API:     ${pc.cyan(`http://${host}:${port}`)}`);
    if (uiDistPath) {
      console.log(`  UI:      ${pc.cyan(`http://${host}:${port}`)}`);
    }
    console.log('');
  }

  private detectSourceType(source: string): 'file' | 'url' {
    return source.startsWith('http://') || source.startsWith('https://') ? 'url' : 'file';
  }

  private async loadSource(source: string, type: 'file' | 'url'): Promise<ServerState> {
    let raw: unknown;

    if (type === 'url') {
      console.log(pc.dim(`  Fetching remote spec...`));
      const res = await fetch(source);
      if (!res.ok) {
        throw new Error(`Failed to fetch spec: ${res.status} ${res.statusText}`);
      }
      raw = await res.json();
    } else {
      const { raw: fileRaw } = loadSpec(source);
      raw = fileRaw;
    }

    const { api } = await parseSpec(raw);
    const spec = normalizeSpec(api);

    console.log(pc.dim(`  Loaded: ${spec.info.title} v${spec.info.version} (${spec.endpoints.length} endpoints)`));

    return { source, sourceType: type, spec };
  }

  private async serveStaticFiles(distPath: string): Promise<void> {
    this.fastify.get('*', async (request: FastifyRequest, reply: FastifyReply) => {
      const urlPath = request.url.split('?')[0];

      const staticFile = path.join(distPath, urlPath);
      if (fs.existsSync(staticFile) && fs.statSync(staticFile).isFile()) {
        const ext = path.extname(staticFile);
        const mimeTypes: Record<string, string> = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.svg': 'image/svg+xml',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.json': 'application/json',
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        const content = fs.readFileSync(staticFile);
        return reply.header('Content-Type', contentType).send(content);
      }

      const indexHtml = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        const content = fs.readFileSync(indexHtml);
        return reply.header('Content-Type', 'text/html').send(content);
      }

      return reply.status(404).send('Not found');
    });
  }

  private async registerApiRoutes(): Promise<void> {
    const { apiRoutes } = await import('./routes/api.js');
    await this.fastify.register(apiRoutes);
  }

  private async registerProxyRoutes(): Promise<void> {
    const { proxyRoutes } = await import('./routes/proxy.js');
    await this.fastify.register(proxyRoutes);
  }

  async stop(): Promise<void> {
    await this.fastify.close();
  }

  getState(): ServerState | null {
    return this.state;
  }

  updateSpec(spec: NormalizedSpec): void {
    if (this.state) {
      this.state.spec = spec;
      this.fastify.decorate('serverState', this.state);
    }
  }

  async refresh(): Promise<{ title: string; endpointCount: number }> {
    if (!this.state) throw new Error('Server not started');

    const { source, sourceType } = this.state;
    const newState = await this.loadSource(source, sourceType);
    this.state = newState;
    this.fastify.decorate('serverState', this.state);

    return {
      title: newState.spec.info.title,
      endpointCount: newState.spec.endpoints.length,
    };
  }
}
