import { useState, useRef, useEffect } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { THEMES, getTheme } from '@/themes';
import { applyTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const { theme: themeId, setTheme } = useAppStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTheme = getTheme(themeId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleSelectTheme = (id: string) => {
    const theme = getTheme(id);
    applyTheme(theme);
    setTheme(id);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm',
          'hover:bg-accent transition-colors border',
          'border-transparent hover:border-border'
        )}
        title="Change theme"
      >
        <Palette className="w-4 h-4 text-muted-foreground" />
        <span className="hidden sm:inline">{currentTheme.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-medium">Theme</span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-2 max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    theme.id === themeId
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:border-border hover:bg-accent'
                  )}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: theme.css.background }}
                    />
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: theme.css.primary }}
                    />
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: theme.css.accent }}
                    />
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: theme.css.success }}
                    />
                  </div>
                  <span className="text-xs font-medium">{theme.name}</span>
                  {theme.id === themeId && (
                    <Check className="w-3 h-3 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
