import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { GlassSurface } from './glass';
import { Icon, TablerIcon } from './icon';
import { Text } from './text';

/** VM0 NavBar — 镜像 Figma「Toolbar - Top - iPhone」:
 *  Style=Default → variant="inline"(高 54 = 内容 44 + pb 10,标题 17)
 *  Style=Large Title → variant="large"(控制行 44 + 标题块 34/副标题 15)
 *  两侧控件为 44×44 玻璃圆钮(kit 的 Button Group r=296 玻璃 BG)。 */

export function NavBarButton({
  icon,
  onPress,
  disabled = false,
}: {
  icon: TablerIcon;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`relative h-11 w-11 items-center justify-center overflow-hidden rounded-full active:opacity-80 ${
        disabled ? 'opacity-50' : ''
      }`}>
      <GlassSurface />
      <View className="relative">
        <Icon icon={icon} size={20} color="primary" />
      </View>
    </Pressable>
  );
}

export interface NavBarProps {
  title: string;
  subtitle?: string;
  variant?: 'inline' | 'large';
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function NavBar({ title, subtitle, variant = 'inline', leading, trailing }: NavBarProps) {
  if (variant === 'large') {
    return (
      <View>
        <View className="h-11 flex-row items-center justify-between px-4">
          <View className="flex-row items-center gap-2">{leading}</View>
          <View className="flex-row items-center gap-2">{trailing}</View>
        </View>
        <View className="gap-0 px-4 pb-2 pt-1.5">
          <Text variant="largeTitle" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="subhead" color="secondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="h-[54px] flex-row items-center px-4 pb-2.5">
      <View className="w-[92px] flex-row items-center justify-start gap-2">{leading}</View>
      <View className="flex-1 items-center">
        <Text variant="headline" numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View className="w-[92px] flex-row items-center justify-end gap-2">{trailing}</View>
    </View>
  );
}
