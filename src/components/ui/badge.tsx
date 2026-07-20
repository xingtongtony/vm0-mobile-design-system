import { View } from 'react-native';

import { Text } from './text';

/** VM0 Badge — VM0 扩展组件(Figma kit 无 Tag/Badge 对应物,属系统缺口,
 *  待回填 Figma;样式契约:subtle 底 + 同族前景色 + 可选圆点)。 */

const STATUS = {
  neutral: { pill: 'bg-fill-3', dot: 'bg-label-secondary', text: 'secondary' },
  success: { pill: 'bg-subtle-success', dot: 'bg-success', text: 'success' },
  warning: { pill: 'bg-subtle-warning', dot: 'bg-warning', text: 'warning' },
  destructive: { pill: 'bg-subtle-destructive', dot: 'bg-destructive', text: 'destructive' },
  link: { pill: 'bg-subtle-link', dot: 'bg-link', text: 'link' },
  done: { pill: 'bg-subtle-done', dot: 'bg-done', text: 'done' },
  tint: { pill: 'bg-tint-subtle', dot: 'bg-tint', text: 'tint' },
} as const;

export type BadgeStatus = keyof typeof STATUS;

export interface BadgeProps {
  label: string;
  status?: BadgeStatus;
  dot?: boolean;
  className?: string;
}

export function Badge({ label, status = 'neutral', dot = false, className = '' }: BadgeProps) {
  const s = STATUS[status];
  return (
    <View
      className={`flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5 ${s.pill} ${className}`}>
      {dot ? <View className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> : null}
      <Text variant="caption1" weight="medium" color={s.text}>
        {label}
      </Text>
    </View>
  );
}
