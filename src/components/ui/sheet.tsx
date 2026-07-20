import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Platform, Pressable, View, ViewStyle } from 'react-native';

import { useIconColors } from '@/hooks/use-tokens';

/** VM0 Sheet — 镜像 Figma「Sheet - iPhone」:
 *  Detent=[Medium|Large] → 高度 ~52% / ~93%(kit 459/874);
 *  面板左右缩进 6,圆角 [34,34,58,58],材质 = 半透明白 + 玻璃(web 用 blur 近似,
 *  native 先用 bg-elevated 实色);Overlay = kit Overlays/Default@0.2;
 *  Grabber 58×4 = Fills-Vibrant/Primary(≈fill-1)。手势拖拽属 P2。 */

const DETENT_HEIGHT = { medium: '52%', large: '93%' } as const;

export interface SheetProps {
  visible: boolean;
  onClose?: () => void;
  detent?: keyof typeof DETENT_HEIGHT;
  children?: ReactNode;
}

export function Sheet({ visible, onClose, detent = 'medium', children }: SheetProps) {
  const c = useIconColors();
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setMounted(false));
    }
  }, [visible, progress]);

  if (!mounted) return null;

  const panelMaterial: ViewStyle =
    Platform.OS === 'web'
      ? ({
          backgroundColor: 'var(--sheet-bg)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        } as unknown as ViewStyle)
      : { backgroundColor: c.bgElevated };

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      {/* Overlay */}
      <Animated.View
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: c.overlay, opacity: progress }}>
        <Pressable style={{ flex: 1 }} accessibilityLabel="Close sheet" onPress={onClose} />
      </Animated.View>

      {/* Panel */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 6,
            right: 6,
            bottom: 0,
            height: DETENT_HEIGHT[detent] as ViewStyle['height'],
            borderTopLeftRadius: 34,
            borderTopRightRadius: 34,
            borderBottomLeftRadius: 58,
            borderBottomRightRadius: 58,
            overflow: 'hidden',
            transform: [
              {
                translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [640, 0] }),
              },
            ],
          },
          panelMaterial,
        ]}>
        {/* Grabber */}
        <View className="items-center pt-[5px]">
          <View className="h-1 w-[58px] rounded-full bg-fill-1" />
        </View>
        <View className="flex-1 pt-3">{children}</View>
      </Animated.View>
    </Modal>
  );
}
