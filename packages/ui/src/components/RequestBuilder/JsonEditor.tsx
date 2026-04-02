import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { getMonaco } from '@/lib/monacoThemes';
import { useAppStore } from '@/stores/appStore';
import { getTheme } from '@/themes';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function JsonEditor({ value, onChange, className }: JsonEditorProps) {
  const { theme: themeId } = useAppStore();
  const [monacoReady, setMonacoReady] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentTheme = getTheme(themeId);
  const monoTheme = currentTheme.type === 'light' ? 'vs' : currentTheme.mono;

  const validate = useCallback((json: string) => {
    if (!json.trim()) {
      setValid(null);
      setErrorMsg(null);
      return;
    }
    try {
      JSON.parse(json);
      setValid(true);
      setErrorMsg(null);
    } catch (e) {
      setValid(false);
      setErrorMsg(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, []);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
      setValid(true);
      setErrorMsg(null);
    } catch {
      // Can't format invalid JSON
    }
  }, [value, onChange]);

  if (!monacoReady) {
    return (
      <pre className="text-sm font-mono overflow-x-auto p-3 bg-card rounded border min-h-[300px]">
        {value}
      </pre>
    );
  }

  return (
    <div className={cn('rounded border overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          {valid === true && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Valid JSON
            </span>
          )}
          {valid === false && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </span>
          )}
        </div>
        <button
          onClick={handleFormat}
          className="text-xs px-2 py-1 rounded bg-accent hover:bg-accent/80 transition-colors"
        >
          Format
        </button>
      </div>
      <Editor
        height="350px"
        defaultLanguage="json"
        value={value}
        theme={monoTheme}
        onChange={(val) => {
          const newValue = val || '';
          onChange(newValue);
          validate(newValue);
        }}
        onMount={() => {
          getMonaco().then(() => setMonacoReady(true));
          validate(value);
        }}
        options={{
          readOnly: false,
          minimap: { enabled: false },
          lineNumbers: 'on',
          folding: true,
          wordWrap: 'off',
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: 'all',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { vertical: 'auto', horizontal: 'auto' },
          tabSize: 2,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
