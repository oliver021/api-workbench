import { useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeft, RefreshCw, Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { ThemeSelector } from './ThemeSelector';
import { THEMES, getTheme } from '@/themes';
import { applyTheme } from '@/lib/theme';
import type { NormalizedSpec } from '@api-workbench/core';
import { cn } from '@/lib/utils';

interface HeaderProps {
  spec: NormalizedSpec | null;
  sourceInfo: { source: string; sourceType: string } | null;
}

export function Header({ spec, sourceInfo }: HeaderProps) {
  const { sidebarCollapsed, toggleSidebar, theme: themeId, setTheme } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const currentTheme = getTheme(themeId);
  const isDark = currentTheme.type === 'dark';

  const toggleDarkMode = () => {
    if (isDark) {
      const lightTheme = THEMES.find((t) => t.type === 'light') || THEMES[THEMES.length - 1];
      applyTheme(lightTheme);
      setTheme(lightTheme.id);
    } else {
      const darkTheme = THEMES.find((t) => t.type === 'dark' && t.id !== 'light') || THEMES[0];
      applyTheme(darkTheme);
      setTheme(darkTheme.id);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/refresh', { method: 'POST' });
      window.location.reload();
    } catch (err) {
      console.error('Failed to refresh spec:', err);
    } finally {
      setRefreshing(false);
    }
  };

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
        {sourceInfo && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-md border border-transparent text-xs">
            <span className="text-muted-foreground font-mono max-w-[200px] truncate">
              {sourceInfo.source}
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={cn(
                'p-1 rounded hover:bg-accent transition-colors',
                refreshing && 'animate-spin'
              )}
              title="Refresh spec"
            >
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        {spec && spec.servers.length > 0 && (
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border">
            <span className="text-muted-foreground text-xs">Server:</span>
            <span className="font-mono text-xs max-w-[200px] truncate">
              {spec.servers[0]?.url}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        )}

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md hover:bg-accent transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        <ThemeSelector />
      </div>
    </header>
  );
}
