import { Pressable, PressableProps, View } from 'react-native';

import { GlassSurface } from './glass';
import { Icon, TablerIcon } from './icon';
import { Text } from './text';

/** VM0 Button — 镜像 Figma「Button - Content Area」组件:
 *  Style=[Bordered - Prominent|Bordered|Borderless] → variant=[prominent|bordered|borderless]
 *  Size=[Large|Medium|Small] → size=[lg|md|sm](高 50/34/28,胶囊)
 *  Destructive / Is Enabled → destructive / disabled
 *  色彩契约(来自 Figma 绑定变量):prominent=tint 底白字;bordered=fill-3 底 tint 字;
 *  borderless=无底 tint 字;destructive 用 destructive 色;禁用字色 label-tertiary。 */

const SIZE = {
  lg: { box: 'h-[50px] gap-1.5', pad: 'px-5', iconOnly: 'w-[50px]', text: 'body', weight: 'semibold', icon: 20 },
  md: { box: 'h-[34px] gap-1', pad: 'px-3.5', iconOnly: 'w-[34px]', text: 'subhead', weight: 'semibold', icon: 16 },
  sm: { box: 'h-7 gap-1', pad: 'px-2.5', iconOnly: 'w-7', text: 'subhead', weight: 'medium', icon: 14 },
} as const;

/** glass / glassProminent 镜像 Figma「Button - Liquid Glass - Text/Symbol」
 *  (Style=[Glass|Glass Prominent]);其余镜像「Button - Content Area」。 */
export type ButtonVariant = 'prominent' | 'bordered' | 'borderless' | 'glass' | 'glassProminent';
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

  if (variant === 'glass' || variant === 'glassProminent') {
    const prominentGlass = variant === 'glassProminent';
    const fgGlass = disabled ? 'tertiary' : prominentGlass ? 'onTint' : destructive ? 'destructive' : 'primary';
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        className={`relative flex-row items-center justify-center overflow-hidden rounded-full active:opacity-80 ${s.box} ${
          iconOnly ? s.iconOnly : s.pad
        } ${disabled ? 'opacity-50' : ''} ${className}`}
        {...rest}>
        <GlassSurface prominent={prominentGlass} />
        {/* RNW 中 static 的 SVG 会被 absolute 玻璃层盖住,包一层 relative 提到玻璃之上 */}
        {icon ? (
          <View className="relative">
            <Icon icon={icon} size={s.icon} color={fgGlass} />
          </View>
        ) : null}
        {title ? (
          <Text variant={s.text} weight={s.weight} color={fgGlass}>
            {title}
          </Text>
        ) : null}
      </Pressable>
    );
  }

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
        iconOnly ? s.iconOnly : s.pad
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
