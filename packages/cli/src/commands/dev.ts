import { Command } from 'commander';
import pc from 'picocolors';
import path from 'path';
import fs from 'fs';
import { ApiWorkbenchServer } from '../server/index.js';
import { DEFAULT_SERVER_PORT } from '../server/types.js';

export function devCommand(program: Command): void {
  program
    .command('dev <source>')
    .description('Start API Workbench dev server (alias for serve)')
    .option('-p, --port <port>', 'Server port', String(DEFAULT_SERVER_PORT))
    .option('-h, --host <host>', 'Server host', '127.0.0.1')
    .option('--ui-dist <path>', 'Path to UI dist folder')
    .action(async (source: string, options: { port: string; host: string; uiDist?: string }) => {
      console.log(pc.cyan(`\n  API Workbench`));
      console.log(`  ${pc.dim('source')} ${pc.white(source)}\n`);

      const server = new ApiWorkbenchServer({
        source,
        port: parseInt(options.port, 10),
        host: options.host,
        uiDistPath: options.uiDist || findUiDist(),
      });

      try {
        await server.start();
      } catch (err) {
        console.error(pc.red(`\n  Failed to start server:`), err);
        process.exit(1);
      }

      const shutdown = async () => {
        console.log(pc.yellow('\n\n  Shutting down...'));
        await server.stop();
        process.exit(0);
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    });
}

function findUiDist(): string | undefined {
  const candidates = [
    path.join(process.cwd(), 'dist'),
    path.join(process.cwd(), '../ui/dist'),
    path.join(process.cwd(), '../../ui/dist'),
    path.join(process.cwd(), 'packages/ui/dist'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}
