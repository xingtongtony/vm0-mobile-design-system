import { useIconColors } from '@/hooks/use-tokens';

/** VM0 Icon — Tabler 图标包装。图标以组件引用传入(利于 tree-shaking),
 *  尺寸档 + 语义色与 Text 对齐。用法:<Icon icon={IconSearch} size="sm" color="tertiary" /> */

export type TablerIcon = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

const SIZE = { xs: 14, sm: 16, md: 20, lg: 24, xl: 28 } as const;

export type IconSize = keyof typeof SIZE | number;
export type IconColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'tint'
  | 'onTint'
  | 'success'
  | 'destructive'
  | 'warning'
  | 'link'
  | 'done';

export interface IconProps {
  icon: TablerIcon;
  size?: IconSize;
  color?: IconColor;
  strokeWidth?: number;
}

export function Icon({ icon: I, size = 'md', color = 'primary', strokeWidth = 2 }: IconProps) {
  const c = useIconColors();
  const value: Record<IconColor, string> = {
    primary: c.label,
    secondary: c.labelSecondary,
    tertiary: c.labelTertiary,
    tint: c.tint,
    onTint: c.onTint,
    success: c.success,
    destructive: c.destructive,
    warning: c.warning,
    link: c.link,
    done: c.done,
  };
  return (
    <I size={typeof size === 'number' ? size : SIZE[size]} color={value[color]} strokeWidth={strokeWidth} />
  );
}
