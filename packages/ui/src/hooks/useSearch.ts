import { useState, useMemo } from 'react';
import type { NormalizedEndpoint, SearchResult } from '@api-workbench/core';

export function useSearch(endpoints: NormalizedEndpoint[]) {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return endpoints
      .filter((e) => {
        return (
          e.path.toLowerCase().includes(q) ||
          e.method.toLowerCase().includes(q) ||
          (e.summary && e.summary.toLowerCase().includes(q)) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.operationId && e.operationId.toLowerCase().includes(q))
        );
      })
      .slice(0, 8)
      .map((e) => ({
        id: e.id,
        method: e.method,
        path: e.path,
        tag: e.tags[0] || 'Other',
        summary: e.summary,
      }));
  }, [query, endpoints]);

  return { query, setQuery, results };
}
