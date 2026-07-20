import { Pressable, Text as RNText, View } from 'react-native';

import { GlassSurface } from './glass';
import { Icon, TablerIcon } from './icon';

/** VM0 TabBar — 镜像 Figma「Tab Bar - iPhone」(iOS 26 浮动玻璃胶囊):
 *  容器 62 高玻璃胶囊,tab 项 54 高(图标区 28 + 标签 fs10);
 *  选中项:Vibrant 填充胶囊(≈fill-2)+ tint 图标/标签,未选中 = 次级灰。
 *  仅实现 Type=Default;Search Role / Minimized 属 P2。 */

export interface TabBarItem {
  label: string;
  icon: TablerIcon;
}

export interface TabBarProps {
  items: TabBarItem[];
  selectedIndex: number;
  onChange?: (index: number) => void;
}

export function TabBar({ items, selectedIndex, onChange }: TabBarProps) {
  return (
    <View className="relative h-[62px] flex-row items-center self-center overflow-hidden rounded-full p-1">
      <GlassSurface />
      {items.map((it, i) => {
        const sel = i === selectedIndex;
        return (
          <Pressable
            key={it.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: sel }}
            onPress={() => onChange?.(i)}
            className="relative h-[54px] min-w-[72px] items-center justify-center gap-[3px] rounded-full px-2.5">
            {sel ? <View className="absolute inset-0 rounded-full bg-fill-2" /> : null}
            <View className="relative">
              <Icon icon={it.icon} size={24} color={sel ? 'tint' : 'secondary'} />
            </View>
            <RNText
              className={`font-sans-medium text-[10px] leading-[12px] ${
                sel ? 'text-tint' : 'text-label-secondary'
              }`}>
              {it.label}
            </RNText>
          </Pressable>
        );
      })}
    </View>
  );
}
