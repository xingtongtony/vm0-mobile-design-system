import { Pressable, View } from 'react-native';

import { Text } from './text';

/** VM0 Segmented — 镜像 Figma「Segmented Control」:胶囊容器,
 *  Size=[Large|Small] → lg(50)/sm(32),选中项 bg-elevated + 阴影。 */

const SIZE = {
  lg: { box: 'h-[50px]', option: 'h-[44px]' },
  sm: { box: 'h-8', option: 'h-[26px]' },
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
      className={`flex-row items-center rounded-full bg-fill-3 p-[3px] ${s.box} ${
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
