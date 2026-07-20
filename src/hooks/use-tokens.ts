import { Platform } from 'react-native';
import { useColorScheme } from 'nativewind';

import { colors } from '../../theme/theme';

/** 图标等需要「真实颜色值」的场景用这个 hook。
 *  web 直接给 CSS 变量(跟随 .light/.dark 覆盖),native 按 NativeWind colorScheme 取值。 */
export function useIconColors() {
  const { colorScheme } = useColorScheme();

  if (Platform.OS === 'web') {
    return {
      label: 'var(--label)',
      labelSecondary: 'var(--label-secondary)',
      labelTertiary: 'var(--label-tertiary)',
      tint: 'var(--tint)',
      onTint: 'var(--on-tint)',
      link: 'var(--link)',
      success: 'var(--success)',
      done: 'var(--done)',
      warning: 'var(--warning)',
      destructive: 'var(--destructive)',
    };
  }

  const c = colors[colorScheme === 'dark' ? 'dark' : 'light'];
  return {
    label: c.label,
    labelSecondary: c.labelSecondary,
    labelTertiary: c.labelTertiary,
    tint: c.tint,
    onTint: c.onTint,
    link: c.link,
    success: c.success,
    done: c.done,
    warning: c.warning,
    destructive: c.destructive,
  };
}
