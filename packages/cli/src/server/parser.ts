import SwaggerParser from '@apidevtools/swagger-parser';

export interface ParsedSpec {
  api: unknown;
  resolved: unknown;
}

export async function parseSpec(raw: unknown): Promise<ParsedSpec> {
  const resolved = await SwaggerParser.resolve(raw as Parameters<typeof SwaggerParser.resolve>[0]);
  const dereferenced = await SwaggerParser.dereference(raw as Parameters<typeof SwaggerParser.dereference>[0]);

  return {
    api: dereferenced,
    resolved,
  };
}
