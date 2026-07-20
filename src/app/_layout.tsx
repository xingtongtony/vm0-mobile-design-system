import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

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
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
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

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
