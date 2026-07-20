import { Pressable, PressableProps } from 'react-native';

import { Icon, TablerIcon } from './icon';
import { Text } from './text';

/** VM0 Button — 镜像 Figma「Button - Content Area」组件:
 *  Style=[Bordered - Prominent|Bordered|Borderless] → variant=[prominent|bordered|borderless]
 *  Size=[Large|Medium|Small] → size=[lg|md|sm](高 50/34/28,胶囊)
 *  Destructive / Is Enabled → destructive / disabled
 *  色彩契约(来自 Figma 绑定变量):prominent=tint 底白字;bordered=fill-3 底 tint 字;
 *  borderless=无底 tint 字;destructive 用 destructive 色;禁用字色 label-tertiary。 */

const SIZE = {
  lg: { box: 'h-[50px] px-5 gap-1.5', iconOnly: 'w-[50px]', text: 'body', weight: 'semibold', icon: 20 },
  md: { box: 'h-[34px] px-3.5 gap-1', iconOnly: 'w-[34px]', text: 'subhead', weight: 'semibold', icon: 16 },
  sm: { box: 'h-7 px-2.5 gap-1', iconOnly: 'w-7', text: 'subhead', weight: 'medium', icon: 14 },
} as const;

export type ButtonVariant = 'prominent' | 'bordered' | 'borderless';
export type ButtonSize = keyof typeof SIZE;

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  title?: string;
  icon?: TablerIcon;
  variant?: ButtonVariant;
  size?: ButtonSize;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  title,
  icon,
  variant = 'bordered',
  size = 'md',
  destructive = false,
  disabled = false,
  className = '',
  ...rest
}: ButtonProps) {
  const s = SIZE[size];
  const iconOnly = !!icon && !title;

  let box = '';
  let fg: 'onTint' | 'tint' | 'destructive' | 'tertiary';
  if (variant === 'prominent') {
    box = disabled
      ? 'bg-fill-2'
      : destructive
        ? 'bg-destructive active:opacity-85'
        : 'bg-tint active:bg-tint-pressed';
    fg = disabled ? 'tertiary' : 'onTint';
  } else {
    if (variant === 'bordered') box = disabled ? 'bg-fill-3' : 'bg-fill-3 active:bg-fill-2';
    else box = disabled ? '' : 'active:opacity-60';
    fg = disabled ? 'tertiary' : destructive ? 'destructive' : 'tint';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      className={`flex-row items-center justify-center rounded-full ${s.box} ${
        iconOnly ? `${s.iconOnly} px-0` : ''
      } ${box} ${className}`}
      {...rest}>
      {icon ? <Icon icon={icon} size={s.icon} color={fg} /> : null}
      {title ? (
        <Text variant={s.text} weight={s.weight} color={fg}>
          {title}
        </Text>
      ) : null}
    </Pressable>
  );
}
