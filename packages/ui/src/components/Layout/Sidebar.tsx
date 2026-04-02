import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Pin, PinOff } from 'lucide-react';
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

interface EndpointRowProps {
  endpoint: NormalizedEndpoint;
  isSelected: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onNavigate: () => void;
}

function EndpointRow({ endpoint, isSelected, isPinned, onTogglePin, onNavigate }: EndpointRowProps) {
  return (
    <div
      className={cn(
        'w-full flex items-center gap-1 px-2 py-1 rounded text-left text-xs group',
        'hover:bg-accent transition-colors',
        isSelected && 'bg-primary/10 text-primary font-medium'
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin();
        }}
        className={cn(
          'p-0.5 rounded flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity',
          'hover:bg-accent/80',
          isPinned && 'opacity-100'
        )}
        title={isPinned ? 'Unpin endpoint' : 'Pin endpoint'}
      >
        {isPinned ? (
          <Pin className="w-3 h-3 text-primary fill-primary" />
        ) : (
          <PinOff className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      <button
        onClick={onNavigate}
        className="flex items-center gap-2 flex-1 min-w-0"
      >
        <span
          className="text-[10px] font-bold flex-shrink-0"
          style={{ color: METHOD_COLORS[endpoint.method] }}
        >
          {endpoint.method}
        </span>
        {endpoint.summary && (
          <span className="truncate text-muted-foreground">{endpoint.summary}</span>
        )}
      </button>
    </div>
  );
}

export function Sidebar({ endpoints }: SidebarProps) {
  const navigate = useNavigate();
  const { expandedPaths, togglePathExpanded, selectedEndpoint, pinnedEndpoints, togglePinnedEndpoint, isEndpointPinned } = useAppStore();

  const currentEndpointId = selectedEndpoint?.id || '';

  const treeData = useMemo(() => {
    const tagMap = new Map<string, Map<string, PathGroup>>();

    for (const endpoint of endpoints) {
      const tag = endpoint.tags[0] || '__untagged__';
      const pathKey = endpoint.path;

      if (!tagMap.has(tag)) tagMap.set(tag, new Map());

      const tagData = tagMap.get(tag)!;
      if (!tagData.has(pathKey)) {
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

    return tagMap;
  }, [endpoints]);

  const pinnedEndpointList = useMemo(() => {
    return pinnedEndpoints
      .map((p) => endpoints.find((e) => e.id === p.id))
      .filter((e): e is NormalizedEndpoint => e !== undefined);
  }, [pinnedEndpoints, endpoints]);

  return (
    <aside className="w-56 h-full border-r bg-card flex flex-col overflow-hidden">
      <div className="p-3 border-b">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Endpoints
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {pinnedEndpointList.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
              <Pin className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Pinned ({pinnedEndpointList.length})
              </span>
            </div>
            {pinnedEndpointList.map((endpoint) => (
              <EndpointRow
                key={endpoint.id}
                endpoint={endpoint}
                isSelected={currentEndpointId === endpoint.id}
                isPinned={true}
                onTogglePin={() => togglePinnedEndpoint(endpoint)}
                onNavigate={() => navigate(`/e/${endpoint.method}${endpoint.path}`)}
              />
            ))}
            <div className="border-b border-border/50 my-2" />
          </div>
        )}

        {[...treeData.entries()]
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
                            <EndpointRow
                              key={endpoint.id}
                              endpoint={endpoint}
                              isSelected={currentEndpointId === endpoint.id}
                              isPinned={isEndpointPinned(endpoint.id)}
                              onTogglePin={() => togglePinnedEndpoint(endpoint)}
                              onNavigate={() => navigate(`/e/${endpoint.method}${endpoint.path}`)}
                            />
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
