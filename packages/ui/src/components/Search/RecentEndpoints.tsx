import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { METHOD_COLORS } from '@api-workbench/core';
import { cn } from '@/lib/utils';

export function RecentEndpoints() {
  const navigate = useNavigate();
  const { recentEndpoints } = useAppStore();

  if (recentEndpoints.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Recent Endpoints
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentEndpoints.slice(0, 6).map((ep) => (
          <button
            key={ep.id}
            onClick={() => navigate(`/e/${ep.method}${ep.path}`)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm',
              'bg-accent hover:bg-accent/80 transition-colors',
              'border border-transparent hover:border-border'
            )}
          >
            <span
              className="text-[10px] font-bold"
              style={{ color: METHOD_COLORS[ep.method as keyof typeof METHOD_COLORS] }}
            >
              {ep.method}
            </span>
            <span className="font-mono text-xs max-w-[150px] truncate">{ep.path}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
