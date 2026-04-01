export interface MonacoThemeDefinition {
  base: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
  inherit: boolean;
  rules: { token: string; foreground?: string; fontStyle?: string }[];
  colors: Record<string, string>;
}

export const MONACO_THEMES: Record<string, MonacoThemeDefinition> = {
  'tokyo-night': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'c0caf5' },
      { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'bb9af7' },
      { token: 'string', foreground: '9ece6a' },
      { token: 'number', foreground: 'ff9e64' },
      { token: 'type', foreground: '7aa2f7' },
      { token: 'function', foreground: '7aa2f7' },
      { token: 'variable', foreground: 'c0caf5' },
      { token: 'constant', foreground: 'ff9e64' },
      { token: 'property', foreground: '73daca' },
      { token: 'operator', foreground: '89ddff' },
      { token: 'delimiter', foreground: 'a9b1d6' },
      { token: 'delimiter.bracket', foreground: '89ddff' },
    ],
    colors: {
      'editor.background': '#1a1b26',
      'editor.foreground': '#c0caf5',
      'editor.lineHighlightBackground': '#1f2335',
      'editor.selectionBackground': '#3b426180',
      'editorCursor.foreground': '#c0caf5',
      'editorLineNumber.foreground': '#3b4261',
      'editorLineNumber.activeForeground': '#7aa2f7',
      'editor.inactiveSelectionBackground': '#3b426140',
    },
  },
  'dracula': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'f8f8f2' },
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'type', foreground: '8be9fd' },
      { token: 'function', foreground: '50fa7b' },
      { token: 'variable', foreground: 'f8f8f2' },
      { token: 'constant', foreground: 'bd93f9' },
      { token: 'property', foreground: '66d9ef' },
      { token: 'operator', foreground: 'ff79c6' },
      { token: 'delimiter', foreground: 'f8f8f2' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#44475a',
      'editor.selectionBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#6272a4',
      'editorLineNumber.activeForeground': '#f8f8f2',
    },
  },
  'one-dark-pro': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'abb2bf' },
      { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c678dd' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'type', foreground: 'e5c07b' },
      { token: 'function', foreground: '61afef' },
      { token: 'variable', foreground: 'e06c75' },
      { token: 'constant', foreground: 'd19a66' },
      { token: 'property', foreground: '56b6c2' },
      { token: 'operator', foreground: '56b6c2' },
      { token: 'delimiter', foreground: 'abb2bf' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editor.lineHighlightBackground': '#2c313c',
      'editor.selectionBackground': '#3e4451',
      'editorCursor.foreground': '#528bff',
      'editorLineNumber.foreground': '#4b5263',
      'editorLineNumber.activeForeground': '#abb2bf',
    },
  },
  'catppuccin-mocha': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'cdd6f4' },
      { token: 'comment', foreground: '6c7086', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'cba6f7' },
      { token: 'string', foreground: 'a6e3a1' },
      { token: 'number', foreground: 'fab387' },
      { token: 'type', foreground: '89b4fa' },
      { token: 'function', foreground: '89b4fa' },
      { token: 'variable', foreground: 'cdd6f4' },
      { token: 'constant', foreground: 'fab387' },
      { token: 'property', foreground: '94e2d5' },
      { token: 'operator', foreground: '89dceb' },
      { token: 'delimiter', foreground: 'cdd6f4' },
    ],
    colors: {
      'editor.background': '#1e1e2e',
      'editor.foreground': '#cdd6f4',
      'editor.lineHighlightBackground': '#313244',
      'editor.selectionBackground': '#45475a',
      'editorCursor.foreground': '#cdd6f4',
      'editorLineNumber.foreground': '#45475a',
      'editorLineNumber.activeForeground': '#cdd6f4',
    },
  },
  'nord': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'eceff4' },
      { token: 'comment', foreground: '4c566a', fontStyle: 'italic' },
      { token: 'keyword', foreground: '81a1c1' },
      { token: 'string', foreground: 'a3be8c' },
      { token: 'number', foreground: 'ebcb8b' },
      { token: 'type', foreground: '8fbcbb' },
      { token: 'function', foreground: '88c0d0' },
      { token: 'variable', foreground: 'd8dee9' },
      { token: 'constant', foreground: 'ebcb8b' },
      { token: 'property', foreground: '8fbcbb' },
      { token: 'operator', foreground: '81a1c1' },
      { token: 'delimiter', foreground: 'eceff4' },
    ],
    colors: {
      'editor.background': '#2e3440',
      'editor.foreground': '#eceff4',
      'editor.lineHighlightBackground': '#3b4252',
      'editor.selectionBackground': '#434c5e',
      'editorCursor.foreground': '#d8dee9',
      'editorLineNumber.foreground': '#4c566a',
      'editorLineNumber.activeForeground': '#eceff4',
    },
  },
  'monokai': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'f8f8f2' },
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'type', foreground: '66d9ef' },
      { token: 'function', foreground: 'a6e22e' },
      { token: 'variable', foreground: 'f8f8f2' },
      { token: 'constant', foreground: 'ae81ff' },
      { token: 'property', foreground: '66d9ef' },
      { token: 'operator', foreground: 'f92672' },
      { token: 'delimiter', foreground: 'f8f8f2' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#3e3d32',
      'editor.selectionBackground': '#49483e',
      'editorCursor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#75715e',
      'editorLineNumber.activeForeground': '#f8f8f2',
    },
  },
};

let themesRegistered = false;

export async function registerMonacoThemes(): Promise<void> {
  if (themesRegistered) return;

  const { loader } = await import('@monaco-editor/react');
  await loader.init();

  const monaco = (window as unknown as { monaco?: { editor: { defineTheme: (name: string, def: MonacoThemeDefinition) => void } } }).monaco;

  if (monaco) {
    for (const [name, def] of Object.entries(MONACO_THEMES)) {
      monaco.editor.defineTheme(name, def);
    }
    themesRegistered = true;
  }
}
