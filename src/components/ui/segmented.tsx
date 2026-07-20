import { Pressable, View } from 'react-native';

import { Text } from './text';

/** VM0 Segmented — kit-exact 手写(全平台统一):
 *  Figma「Segmented Control」= 全胶囊容器(r=100,iOS 27 风格),内缩 2,
 *  Size=[Large|Small] → 容器 50/32、选项 46/28(胶囊),选中项 bg-elevated + 阴影。
 *  注:iOS 26 系统 segmented 是旧圆角矩形样式,与 kit 不符,故不走系统实现。 */

const SIZE = {
  lg: { box: 'h-[50px]', option: 'h-[46px]' },
  sm: { box: 'h-8', option: 'h-7' },
} as const;

export interface SegmentedProps {
  options: string[];
  selectedIndex: number;
  onChange?: (index: number) => void;
  size?: keyof typeof SIZE;
  disabled?: boolean;
}

export function Segmented({
  options,
  selectedIndex,
  onChange,
  size = 'sm',
  disabled = false,
}: SegmentedProps) {
  const s = SIZE[size];
  return (
    <View
      className={`flex-row items-center rounded-full bg-fill-3 p-[2px] ${s.box} ${
        disabled ? 'opacity-40' : ''
      }`}>
      {options.map((label, i) => {
        const selected = i === selectedIndex;
        return (
          <Pressable
            key={label}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange?.(i)}
            className={`flex-1 items-center justify-center rounded-full ${s.option} ${
              selected ? 'bg-bg-elevated shadow-sm' : ''
            }`}>
            <Text
              variant="footnote"
              weight={selected ? 'semibold' : 'medium'}
              color={selected ? 'primary' : 'secondary'}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
