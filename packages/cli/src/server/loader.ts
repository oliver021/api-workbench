import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface LoaderResult {
  raw: unknown;
  format: 'json' | 'yaml';
  path: string;
}

export function loadSpec(filePath: string): LoaderResult {
  if (!fs.existsSync(filePath)) {
    throw new Error(`OpenAPI file not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf-8');

  if (ext === '.json') {
    return { raw: JSON.parse(content), format: 'json', path: filePath };
  }

  if (ext === '.yaml' || ext === '.yml') {
    return { raw: yaml.load(content), format: 'yaml', path: filePath };
  }

  try {
    return { raw: JSON.parse(content), format: 'json', path: filePath };
  } catch {
    return { raw: yaml.load(content), format: 'yaml', path: filePath };
  }
}
