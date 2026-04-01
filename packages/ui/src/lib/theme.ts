import type { AppTheme } from '@/themes';
import { THEMES } from '@/themes';

export function applyTheme(theme: AppTheme): void {
  const root = document.documentElement;

  for (const [key, value] of Object.entries(theme.css)) {
    root.style.setProperty(`--${key}`, value);
  }

  if (theme.type === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function initTheme(savedThemeId: string | null): AppTheme {
  const theme = THEMES.find((t) => t.id === savedThemeId) || THEMES[0];
  applyTheme(theme);
  return theme;
}
