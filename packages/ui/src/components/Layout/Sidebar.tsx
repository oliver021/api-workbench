import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import type { NormalizedEndpoint, HttpMethod } from '@api-workbench/core';
import { METHOD_COLORS } from '@api-workbench/core';
import { cn } from '@/lib/utils';

interface SidebarProps {
  endpoints: NormalizedEndpoint[];
}

interface PathGroup {
  path: string;
  methods: HttpMethod[];
  endpointIds: string[];
}

export function Sidebar({ endpoints }: SidebarProps) {
  const navigate = useNavigate();
  const { expandedPaths, togglePathExpanded, selectedEndpoint } = useAppStore();

  const currentEndpointId = selectedEndpoint?.id || '';

  const treeData = useMemo(() => {
    const tagMap = new Map<string, Map<string, PathGroup>>();
    const pathIdMap = new Map<string, string>();

    for (const endpoint of endpoints) {
      const tag = endpoint.tags[0] || '__untagged__';
      const pathKey = endpoint.path;

      if (!tagMap.has(tag)) tagMap.set(tag, new Map());

      const tagData = tagMap.get(tag)!;
      if (!tagData.has(pathKey)) {
        const pathId = `path-${tag}-${pathKey.replace(/[^a-zA-Z0-9]/g, '_')}`;
        pathIdMap.set(pathKey, pathId);
        tagData.set(pathKey, {
          path: pathKey,
          methods: [endpoint.method],
          endpointIds: [endpoint.id],
        });
      } else {
        const group = tagData.get(pathKey)!;
        group.methods.push(endpoint.method);
        group.endpointIds.push(endpoint.id);
      }
    }

    return { tagMap, pathIdMap };
  }, [endpoints]);

  return (
    <aside className="w-56 h-full border-r bg-card flex flex-col overflow-hidden">
      <div className="p-3 border-b">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Endpoints
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {[...treeData.tagMap.entries()]
          .sort(([a], [b]) => {
            if (a === '__untagged__') return 1;
            if (b === '__untagged__') return -1;
            return a.localeCompare(b);
          })
          .map(([tag, pathMap]) => (
            <div key={tag} className="mb-2">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {tag}
              </div>
              {[...pathMap.values()].map((group) => {
                const isExpanded = expandedPaths.has(group.path);

                return (
                  <div key={group.path}>
                    <button
                      onClick={() => togglePathExpanded(group.path)}
                      className={cn(
                        'w-full flex items-center gap-1 px-2 py-1 rounded text-left',
                        'hover:bg-accent transition-colors text-xs'
                      )}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
                      )}
                      <code className="font-mono truncate flex-1">{group.path}</code>
                    </button>

                    {isExpanded && (
                      <div className="ml-4">
                        {endpoints
                          .filter((e) => group.endpointIds.includes(e.id))
                          .map((endpoint) => (
                            <button
                              key={endpoint.id}
                              onClick={() =>
                                navigate(`/e/${endpoint.method}${endpoint.path}`)
                              }
                              className={cn(
                                'w-full flex items-center gap-2 px-2 py-1 rounded text-left text-xs',
                                'hover:bg-accent transition-colors',
                                currentEndpointId === endpoint.id && 'bg-primary/10 text-primary font-medium'
                              )}
                            >
                              <span
                                className="text-[10px] font-bold flex-shrink-0"
                                style={{
                                  color: METHOD_COLORS[endpoint.method],
                                }}
                              >
                                {endpoint.method}
                              </span>
                              {endpoint.summary && (
                                <span className="truncate text-muted-foreground">
                                  {endpoint.summary}
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
          ))}
      </div>
    </aside>
  );
}
