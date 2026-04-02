import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { getMonaco } from '@/lib/monacoThemes';
import { useAppStore } from '@/stores/appStore';
import { getTheme } from '@/themes';
import { cn } from '@/lib/utils';

interface JsonViewerProps {
  value: unknown;
  className?: string;
}

export function JsonViewer({ value, className }: JsonViewerProps) {
  const { theme: themeId } = useAppStore();
  const [monacoReady, setMonacoReady] = useState(false);
  const jsonString = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

  const currentTheme = getTheme(themeId);
  const monoTheme = currentTheme.mono === 'vs' || currentTheme.id === 'light' ? 'vs' : currentTheme.mono;

  useEffect(() => {
    getMonaco().then(() => setMonacoReady(true));
  }, []);

  if (!monacoReady) {
    return (
      <pre className={cn('text-sm font-mono overflow-x-auto p-3 bg-card rounded border', className)}>
        {jsonString}
      </pre>
    );
  }

  return (
    <div className={cn('rounded border overflow-hidden', className)}>
      <Editor
        height="400px"
        defaultLanguage="json"
        value={jsonString}
        theme={monoTheme}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          lineNumbers: 'off',
          folding: true,
          wordWrap: 'off',
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { vertical: 'auto', horizontal: 'auto' },
        }}
      />
    </div>
  );
}
