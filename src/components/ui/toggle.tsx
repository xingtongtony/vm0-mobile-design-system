import { Pressable, View } from 'react-native';

/** VM0 Toggle — 镜像 Figma「Toggle - Switch」:64×28 胶囊,knob 24,
 *  On=success 绿(kit 绑 Accents/Green),Off=label-tertiary,禁用降透明度。 */

export interface ToggleProps {
  value: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onValueChange, disabled = false }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={() => onValueChange?.(!value)}
      className={`h-7 w-16 rounded-full p-[2px] ${value ? 'bg-success' : 'bg-label-tertiary'} ${
        disabled ? 'opacity-40' : ''
      }`}>
      <View
        style={{ transform: [{ translateX: value ? 36 : 0 }] }}
        className="h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200"
      />
    </Pressable>
  );
}
