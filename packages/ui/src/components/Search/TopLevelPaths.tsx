import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { useTopLevelPaths } from '@/hooks/useTopLevelPaths';
import { METHOD_COLORS } from '@api-workbench/core';
import { cn } from '@/lib/utils';

interface TopLevelPathsProps {
  endpoints: ReturnType<typeof useTopLevelPaths>;
}

export function TopLevelPaths({ endpoints }: TopLevelPathsProps) {
  const navigate = useNavigate();
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Top-Level Paths
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {endpoints.map(({ path, methods, endpoints: pathEndpoints }) => {
          const isExpanded = expandedPaths.has(path);

          return (
            <div key={path} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => togglePath(path)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-card hover:bg-accent transition-colors"
              >
                <span className="font-mono text-sm font-medium">{path}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {methods.map((m) => (
                      <span
                        key={m}
                        className="text-[9px] font-bold px-1 py-0.5 rounded"
                        style={{
                          color: METHOD_COLORS[m as keyof typeof METHOD_COLORS],
                          backgroundColor: `${METHOD_COLORS[m as keyof typeof METHOD_COLORS]}20`,
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t bg-muted/30">
                  {pathEndpoints.map((item) => (
                    <button
                      key={item.endpoint.id}
                      onClick={() =>
                        navigate(`/e/${item.endpoint.method}${item.endpoint.path}`)
                      }
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-left',
                        'hover:bg-accent transition-colors',
                        'border-b last:border-b-0 border-border/50'
                      )}
                    >
                      <span
                        className="text-[10px] font-bold flex-shrink-0"
                        style={{
                          color: METHOD_COLORS[item.endpoint.method],
                          backgroundColor: `${METHOD_COLORS[item.endpoint.method]}20`,
                        }}
                      >
                        {item.endpoint.method}
                      </span>
                      <span className="font-mono text-xs truncate">{item.endpoint.path}</span>
                      {item.endpoint.summary && (
                        <span className="text-xs text-muted-foreground truncate ml-auto">
                          {item.endpoint.summary}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
