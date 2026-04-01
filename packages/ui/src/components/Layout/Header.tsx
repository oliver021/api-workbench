import { ChevronDown, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import type { NormalizedSpec } from '@api-workbench/core';

interface HeaderProps {
  spec: NormalizedSpec | null;
}

export function Header({ spec }: HeaderProps) {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-accent transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-4 h-4 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">API Workbench</span>
          {spec && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-sm text-muted-foreground">{spec.info.title}</span>
              <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground font-mono">
                v{spec.info.version}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {spec && spec.servers.length > 0 && (
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border">
            <span className="text-muted-foreground text-xs">Server:</span>
            <span className="font-mono text-xs max-w-[200px] truncate">
              {spec.servers[0]?.url}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
    </header>
  );
}
