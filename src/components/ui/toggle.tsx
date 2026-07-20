import { Pressable, View } from 'react-native';

/** VM0 Toggle — kit-exact 手写(全平台统一):
 *  Figma「Toggle - Switch」= 64×28 胶囊轨道 + 38×24 胶囊形 knob(iOS 27 风格,
 *  knob 不是圆!),行程 22;On=success(kit 绑 Accents/Green),Off=label-tertiary。
 *  注:iOS 26 系统 UISwitch 是旧样式(51×31 圆 knob),与 kit 的 27 风格不符,
 *  所以此件不走系统实现;按压拉伸态属 P2。 */

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
        style={{ transform: [{ translateX: value ? 22 : 0 }] }}
        className="h-6 w-[38px] rounded-full bg-white shadow-sm transition-transform duration-200"
      />
    </Pressable>
  );
}
