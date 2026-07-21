import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { colors } from '../../theme/theme';

/** 原生 TabBar(真 UITabBar/Liquid Glass)+ VM0 定制:
 *  系统组件开放的定制口全部接 token —— tintColor=品牌橙、iconColor/labelStyle
 *  分选中态、Noto Sans 标签、Android indicator=fill。
 *  背景/材质不设值:留给系统渲染真玻璃(设 backgroundColor 会杀掉玻璃)。 */

export default function AppTabs() {
  const scheme = useColorScheme();
  const c = colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      tintColor={c.tint}
      iconColor={c.labelSecondary}
      indicatorColor={c.fill2}
      rippleColor={c.fill2}
      labelStyle={{
        default: { fontFamily: 'Noto Sans Medium', fontSize: 10, color: c.labelSecondary },
        selected: { fontFamily: 'Noto Sans Medium', fontSize: 10, color: c.tint },
      }}
      badgeBackgroundColor={c.tint}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Foundations</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'paintpalette', selected: 'paintpalette.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Components</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
