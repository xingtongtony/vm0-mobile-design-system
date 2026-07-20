import { Switch } from 'react-native';

import { useIconColors } from '@/hooks/use-tokens';

/** VM0 Toggle — native 端:真系统控件(iOS UISwitch / Android Material Switch)
 *  套 VM0 token:On=success(kit「Toggle - Switch」绑 Accents/Green 的契约),
 *  Off 底 = label-tertiary。web 端走 toggle.tsx 的手写实现。 */

export interface ToggleProps {
  value: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onValueChange, disabled = false }: ToggleProps) {
  const c = useIconColors();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ true: c.success, false: c.labelTertiary }}
      ios_backgroundColor={c.labelTertiary}
      thumbColor="#ffffff"
    />
  );
}
