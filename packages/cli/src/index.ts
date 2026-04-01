import { Command } from 'commander';
import pc from 'picocolors';
import { devCommand } from './commands/dev.js';
import { serveCommand } from './commands/serve.js';
import { buildCommand } from './commands/build.js';

const program = new Command();

program
  .name('api-workbench')
  .description('Interactive OpenAPI explorer and tester')
  .version('0.1.0');

serveCommand(program);
devCommand(program);
buildCommand(program);

program.parseAsync(process.argv).catch((err) => {
  console.error(pc.red('\n  Error:'), err.message);
  process.exit(1);
});
