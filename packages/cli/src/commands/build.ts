import { Command } from 'commander';
import pc from 'picocolors';

interface BuildOptions {
  output?: string;
  format?: string;
}

export function buildCommand(program: Command): void {
  program
    .command('build <spec-file>')
    .description('Export OpenAPI spec as static files (future feature)')
    .option('-o, --output <dir>', 'Output directory', './dist')
    .option('--format <format>', 'Output format (json, yaml, html)', 'html')
    .action(async (specFile: string, options: BuildOptions) => {
      console.log(pc.yellow('\n  Build command is not yet implemented.'));
      console.log(`  ${pc.dim('spec-file')}: ${specFile}`);
      console.log(`  ${pc.dim('output')}: ${options.output}`);
      console.log(`  ${pc.dim('format')}: ${options.format}`);
      console.log('');
      console.log(pc.dim('  Coming in Phase 4 of the roadmap.\n'));
    });
}
