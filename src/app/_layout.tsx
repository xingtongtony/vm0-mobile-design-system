import '../global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import {
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
} from '@expo-google-fonts/noto-sans';
import {
  NotoSansSC_400Regular,
  NotoSansSC_500Medium,
  NotoSansSC_700Bold,
} from '@expo-google-fonts/noto-sans-sc';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // family 名与 tailwind.config fontFamily 对齐
  const [fontsLoaded] = useFonts({
    'Noto Sans': NotoSans_400Regular,
    'Noto Sans Medium': NotoSans_500Medium,
    'Noto Sans SemiBold': NotoSans_600SemiBold,
    'Noto Sans Bold': NotoSans_700Bold,
    'Noto Sans SC': NotoSansSC_400Regular,
    'Noto Sans SC Medium': NotoSansSC_500Medium,
    'Noto Sans SC Bold': NotoSansSC_700Bold,
    'JetBrains Mono': JetBrainsMono_400Regular,
    'JetBrains Mono Medium': JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // web:主题切换的柔和过渡 + 字体平滑 + 滚动溢出跟随主题底色
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const style = document.createElement('style');
    style.textContent = [
      'html,body{background:var(--bg)}',
      'body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}',
      '*,*::before,*::after{transition:background-color .25s ease,color .2s ease,border-color .25s ease}',
    ].join('\n');
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/* 原生 Sheet:真 UISheetPresentationController(detent 0.52/0.93 = kit Medium/Large) */}
        <Stack.Screen
          name="sheet-demo"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.52, 0.93],
            sheetGrabberVisible: true,
            sheetCornerRadius: 34,
            gestureEnabled: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
