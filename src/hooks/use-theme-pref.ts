import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { colorScheme as nwColorScheme } from 'nativewind';

export type ThemePref = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'vm0-theme-pref';

function applyPref(pref: ThemePref) {
  // web:直接控制 <html> 上的 .light/.dark(global.css 里的覆盖块)
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const el = document.documentElement;
    el.classList.remove('light', 'dark');
    if (pref !== 'system') el.classList.add(pref);
  }
  // native:交给 NativeWind 运行时
  nwColorScheme.set(pref);
}

export function useThemePref() {
  const [pref, setPrefState] = useState<ThemePref>('system');

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const saved = window.localStorage?.getItem(STORAGE_KEY) as ThemePref | null;
      if (saved === 'light' || saved === 'dark') {
        setPrefState(saved);
        applyPref(saved);
      }
    }
  }, []);

  const setPref = (next: ThemePref) => {
    setPrefState(next);
    applyPref(next);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage?.setItem(STORAGE_KEY, next);
    }
  };

  return [pref, setPref] as const;
}
