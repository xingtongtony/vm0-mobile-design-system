import { IconChevronRight } from '@tabler/icons-react-native';
import { Children, ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';

/** VM0 List — 镜像 Figma「Lists」页:
 *  Row Height=[Regular|Tall] → 52/68,px-16;inset grouped 容器 rounded-card;
 *  分隔线 hairline 左缩进;_Trailing 的 Disclosure/Default 映射 disclosure/value。
 *  Row - Button(Default|Destructive)→ role="button"|"destructive"。 */

export interface ListGroupProps {
  header?: string;
  footer?: string;
  children: ReactNode;
  className?: string;
}

export function ListGroup({ header, footer, children, className = '' }: ListGroupProps) {
  const items = Children.toArray(children);
  return (
    <View className={className}>
      {header ? (
        <Text variant="footnote" color="secondary" className="px-4 pb-1.5 uppercase">
          {header}
        </Text>
      ) : null}
      <View className="overflow-hidden rounded-card bg-bg-secondary">
        {items.map((child, i) => (
          <View key={i}>
            {child}
            {i < items.length - 1 ? <View className="ml-4 h-px bg-separator-hairline" /> : null}
          </View>
        ))}
      </View>
      {footer ? (
        <Text variant="footnote" color="tertiary" className="px-4 pt-1.5">
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

export interface ListRowProps {
  title: string;
  subtitle?: string;
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  disclosure?: boolean;
  height?: 'regular' | 'tall';
  role?: 'default' | 'button' | 'destructive';
  disabled?: boolean;
  onPress?: () => void;
}

export function ListRow({
  title,
  subtitle,
  value,
  leading,
  trailing,
  disclosure = false,
  height = 'regular',
  role = 'default',
  disabled = false,
  onPress,
}: ListRowProps) {
  const titleColor = disabled
    ? 'tertiary'
    : role === 'destructive'
      ? 'destructive'
      : role === 'button'
        ? 'tint'
        : 'primary';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={disabled || !onPress}
      onPress={onPress}
      className={`flex-row items-center gap-3 px-4 ${height === 'tall' ? 'h-[68px]' : 'h-[52px]'} ${
        onPress && !disabled ? 'active:bg-fill-4' : ''
      }`}>
      {leading}
      <View className="flex-1">
        <Text variant="body" color={titleColor} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="footnote" color="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="body" color="secondary" numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {trailing}
      {disclosure ? <Icon icon={IconChevronRight} size="sm" color="tertiary" /> : null}
    </Pressable>
  );
}
