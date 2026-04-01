import { useRef, useEffect } from 'react';
import { useSpec } from '@/hooks/useSpec';
import { useSearch } from '@/hooks/useSearch';
import { useTopLevelPaths } from '@/hooks/useTopLevelPaths';
import { SearchBar } from '@/components/Search/SearchBar';
import { SearchAutocomplete } from '@/components/Search/SearchAutocomplete';
import { RecentEndpoints } from '@/components/Search/RecentEndpoints';
import { TopLevelPaths } from '@/components/Search/TopLevelPaths';

export function SearchLanding() {
  const { data: spec } = useSpec();
  const endpoints = spec?.endpoints || [];
  const { query, setQuery, results } = useSearch(endpoints);
  const topLevelPaths = useTopLevelPaths(endpoints);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setQuery]);

  return (
    <div className="max-w-4xl mx-auto p-8" ref={containerRef}>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          {spec?.info.title || 'API Explorer'}
        </h1>
        {spec?.info.description && (
          <p className="text-muted-foreground">{spec.info.description}</p>
        )}
      </div>

      <div className="relative mb-12">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search endpoints by path, method, or tag..."
          autoFocus
        />
        {query && <SearchAutocomplete results={results} onSelect={() => setQuery('')} />}
      </div>

      <div className="space-y-12">
        <RecentEndpoints />
        <TopLevelPaths endpoints={topLevelPaths} />
      </div>
    </div>
  );
}
