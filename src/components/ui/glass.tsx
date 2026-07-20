import { Platform, StyleProp, View, ViewStyle } from 'react-native';

import { useIconColors } from '@/hooks/use-tokens';

/** Liquid Glass 面 — 镜像 Figma「Button - Liquid Glass」与 Materials 页
 *  「Liquid Glass - Regular」:
 *  · iOS 26+:expo-glass-effect 真玻璃(prominent 时加 tint 着色)
 *  · web:半透明 + backdrop-blur + 高光描边近似(Figma 的折射/GLASS 效果
 *    无法在 CSS 完全复刻,真实观感以 iOS 设备为准)
 *  · Android/旧 iOS:退化为半透明面
 *  用法:作为 absolute-fill 垫在内容底下,由父容器负责圆角裁剪。 */

let Glass: {
  GlassView: React.ComponentType<{
    glassEffectStyle?: 'regular' | 'clear';
    tintColor?: string;
    isInteractive?: boolean;
    style?: StyleProp<ViewStyle>;
  }>;
  isLiquidGlassAvailable: () => boolean;
} | null = null;
if (Platform.OS === 'ios') {
  try {
    Glass = require('expo-glass-effect');
  } catch {
    Glass = null;
  }
}

export interface GlassSurfaceProps {
  prominent?: boolean;
  /** 与父容器圆角一致,保证 blur 被正确裁剪 */
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function GlassSurface({ prominent = false, borderRadius = 999, style }: GlassSurfaceProps) {
  const c = useIconColors();

  if (Glass?.isLiquidGlassAvailable?.()) {
    const { GlassView } = Glass;
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        tintColor={prominent ? c.tint : undefined}
        style={[{ position: 'absolute', inset: 0, borderRadius } as ViewStyle, style]}
      />
    );
  }

  const fallback: ViewStyle =
    Platform.OS === 'web'
      ? ({
          backgroundColor: prominent ? 'var(--glass-tint)' : 'var(--glass-bg)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          borderWidth: 1,
          borderColor: prominent ? 'rgba(255,255,255,0.45)' : 'var(--glass-border)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        } as unknown as ViewStyle)
      : { backgroundColor: prominent ? c.tint : 'rgba(127,132,145,0.4)' };

  return (
    <View
      pointerEvents="none"
      style={[{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius }, fallback, style]}
    />
  );
}
