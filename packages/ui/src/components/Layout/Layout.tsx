import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSpec } from '@/hooks/useSpec';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SourceInfo {
  source: string;
  sourceType: string;
}

export function Layout() {
  const { data: spec, isLoading, error } = useSpec();
  const { sidebarCollapsed } = useAppStore();
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);

  useEffect(() => {
    fetch('/api/source')
      .then((r) => r.json())
      .then((data) => setSourceInfo(data))
      .catch(() => {});
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !spec) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Failed to load spec</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {error?.message || 'No spec loaded. Start the CLI server first.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header spec={spec} sourceInfo={sourceInfo} />
      <div className="flex flex-1 overflow-hidden">
        {!sidebarCollapsed && <Sidebar endpoints={spec.endpoints} />}
        <main className={cn('flex-1 overflow-y-auto', sidebarCollapsed && 'ml-0')}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
