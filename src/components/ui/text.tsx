import { Text as RNText, TextProps as RNTextProps } from 'react-native';

/** VM0 Text — 字阶与默认字重镜像 Figma「Text Styles」页 / theme/theme.ts 的 type ramp。 */

const SIZE = {
  largeTitle: 'text-large-title',
  title1: 'text-title1',
  title2: 'text-title2',
  title3: 'text-title3',
  headline: 'text-headline',
  body: 'text-body',
  callout: 'text-callout',
  subhead: 'text-subhead',
  footnote: 'text-footnote',
  caption1: 'text-caption1',
  caption2: 'text-caption2',
  mono: 'text-mono',
} as const;

const WEIGHT = {
  regular: 'font-sans',
  medium: 'font-sans-medium',
  semibold: 'font-sans-semibold',
  bold: 'font-sans-bold',
} as const;

/** 每个字阶的默认字重(与 Figma Text Styles 一致) */
const DEFAULT_WEIGHT: Record<TextVariant, TextWeight> = {
  largeTitle: 'bold',
  title1: 'bold',
  title2: 'bold',
  title3: 'semibold',
  headline: 'semibold',
  body: 'regular',
  callout: 'regular',
  subhead: 'regular',
  footnote: 'regular',
  caption1: 'regular',
  caption2: 'regular',
  mono: 'regular',
};

const COLOR = {
  primary: 'text-label',
  secondary: 'text-label-secondary',
  tertiary: 'text-label-tertiary',
  quaternary: 'text-label-quaternary',
  tint: 'text-tint',
  onTint: 'text-on-tint',
  success: 'text-success',
  destructive: 'text-destructive',
  warning: 'text-warning',
  link: 'text-link',
  done: 'text-done',
} as const;

export type TextVariant = keyof typeof SIZE;
export type TextWeight = keyof typeof WEIGHT;
export type TextColor = keyof typeof COLOR;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  className?: string;
}

export function Text({
  variant = 'body',
  weight,
  color = 'primary',
  className = '',
  ...rest
}: TextProps) {
  const font =
    variant === 'mono' && !weight ? 'font-mono' : WEIGHT[weight ?? DEFAULT_WEIGHT[variant]];
  return <RNText className={`${SIZE[variant]} ${font} ${COLOR[color]} ${className}`} {...rest} />;
}
