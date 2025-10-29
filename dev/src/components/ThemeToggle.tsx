import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    // ローカルストレージに保存された設定がある場合はそれを使用
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    
    // 保存された設定がない場合は端末のテーマを使用
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 初回マウント時に端末のテーマを適用
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (!stored) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsDark(!isDark)}
      className="gap-2"
      aria-label="Toggle theme"
    >
      {isDark ? '🌙' : '☀️'}
      <span className="text-xs hidden sm:inline">
        {isDark ? 'ダーク' : 'ライト'}
      </span>
    </Button>
  );
}
