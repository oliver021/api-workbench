import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '@api-workbench/core';
import { METHOD_COLORS } from '@api-workbench/core';
import { cn } from '@/lib/utils';

interface SearchAutocompleteProps {
  results: SearchResult[];
  onSelect: () => void;
}

export function SearchAutocomplete({ results, onSelect }: SearchAutocompleteProps) {
  const navigate = useNavigate();

  if (results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-lg overflow-hidden z-50">
      {results.map((result) => (
        <button
          key={result.id}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 text-left',
            'hover:bg-accent transition-colors',
            'border-b last:border-b-0 border-border/50'
          )}
          onClick={() => {
            navigate(`/e/${result.method}${result.path}`);
            onSelect();
          }}
        >
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
            style={{
              color: METHOD_COLORS[result.method],
              backgroundColor: `${METHOD_COLORS[result.method]}20`,
            }}
          >
            {result.method}
          </span>
          <span className="font-mono text-sm text-foreground flex-1 truncate">
            {result.path}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {result.tag}
          </span>
        </button>
      ))}
    </div>
  );
}
