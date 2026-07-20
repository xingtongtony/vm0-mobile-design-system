import { Host, Picker, Text as SwiftUIText } from '@expo/ui/swift-ui';
import { pickerStyle, tag, tint } from '@expo/ui/swift-ui/modifiers';

import { useIconColors } from '@/hooks/use-tokens';

/** VM0 Segmented — iOS 端:真 SwiftUI segmented Picker 套 VM0 tint。
 *  尺寸/材质/动效全部由系统渲染;web/Android 走 segmented.tsx 的手写实现。 */

export interface SegmentedProps {
  options: string[];
  selectedIndex: number;
  onChange?: (index: number) => void;
  size?: 'lg' | 'sm';
  disabled?: boolean;
}

export function Segmented({ options, selectedIndex, onChange, disabled = false }: SegmentedProps) {
  const c = useIconColors();
  return (
    <Host matchContents style={{ alignSelf: 'stretch', opacity: disabled ? 0.4 : 1 }}>
      <Picker
        selection={selectedIndex}
        onSelectionChange={(s) => {
          if (!disabled) onChange?.(Number(s));
        }}
        modifiers={[pickerStyle('segmented'), tint(c.tint)]}>
        {options.map((label, i) => (
          <SwiftUIText key={label} modifiers={[tag(i)]}>
            {label}
          </SwiftUIText>
        ))}
      </Picker>
    </Host>
  );
}
