import { Moon, Sun } from 'lucide-react';
import { useUnikitTheme } from '@unikit-bridge/ui';

/** 라이트/다크 토글 — UnikitThemeProvider(storageKey="unikit-theme") 기준.
 * rustra 사이트의 site-theme.tsx와 같은 역할의 포털 버전. */
export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useUnikitTheme();
  const isDark = colorScheme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleColorScheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      aria-pressed={isDark}
      className="site-focusable inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
