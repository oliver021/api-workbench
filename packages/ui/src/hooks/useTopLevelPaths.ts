import { useMemo } from 'react';
import type { NormalizedEndpoint } from '@api-workbench/core';

export interface PathGroup {
  path: string;
  method: string;
  endpoint: NormalizedEndpoint;
}

export function useTopLevelPaths(endpoints: NormalizedEndpoint[]) {
  return useMemo(() => {
    const groups = new Map<string, PathGroup[]>();

    for (const endpoint of endpoints) {
      const parts = endpoint.path.replace(/^\//, '').split('/');
      const topLevel = `/${parts[0] || ''}`;

      if (!groups.has(topLevel)) {
        groups.set(topLevel, []);
      }
      groups.get(topLevel)!.push({
        path: topLevel,
        method: endpoint.method,
        endpoint,
      });
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, items]) => ({
        path,
        methods: [...new Set(items.map((i) => i.method))],
        endpoints: items,
        total: items.length,
      }));
  }, [endpoints]);
}
