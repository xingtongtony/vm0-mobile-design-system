import { IconDeviceDesktop, IconMoon, IconSunHigh } from '@tabler/icons-react-native';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';

import { ThemePref, useThemePref } from '@/hooks/use-theme-pref';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Foundations</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Components</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} className="active:opacity-70">
      <View className={`rounded-full px-3 py-1.5 ${isFocused ? 'bg-fill-3' : ''}`}>
        <Text
          className={`text-footnote ${
            isFocused ? 'font-sans-semibold text-label' : 'font-sans-medium text-label-secondary'
          }`}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

const PREFS: { key: ThemePref; Icon: typeof IconSunHigh }[] = [
  { key: 'system', Icon: IconDeviceDesktop },
  { key: 'light', Icon: IconSunHigh },
  { key: 'dark', Icon: IconMoon },
];

function ThemeToggle() {
  const [pref, setPref] = useThemePref();
  return (
    <View className="flex-row rounded-full bg-fill-3 p-[3px]">
      {PREFS.map(({ key, Icon }) => (
        <Pressable
          key={key}
          onPress={() => setPref(key)}
          className={`h-7 w-7 items-center justify-center rounded-full ${
            pref === key ? 'bg-bg-elevated shadow-sm' : ''
          }`}>
          <Icon
            size={14}
            color={pref === key ? ('var(--label)' as never) : ('var(--label-tertiary)' as never)}
          />
        </Pressable>
      ))}
    </View>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View
      {...props}
      className="absolute w-full flex-row items-center justify-center p-4"
      style={{ pointerEvents: 'box-none' } as never}>
      <View
        className="w-full max-w-[720px] flex-row items-center gap-1 rounded-full border border-separator-hairline px-3 py-2"
        style={
          {
            backgroundColor: 'color-mix(in srgb, var(--bg) 78%, transparent)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          } as never
        }>
        <View className="mr-auto flex-row items-center gap-2 pl-1">
          <View className="h-2.5 w-2.5 rounded-full bg-tint" />
          <Text className="hidden font-sans-bold text-footnote tracking-tight text-label min-[440px]:flex">VM0</Text>
        </View>

        {props.children}

        <View className="ml-1">
          <ThemeToggle />
        </View>
      </View>
    </View>
  );
}
