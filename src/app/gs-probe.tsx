import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ButtonText } from '@/components/gluestack/button';
import { Text } from '@/components/ui';

/** 临时探针:验证 gluestack 组件套 VM0 token 的渲染(web + iOS)。验完删除。 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text variant="caption1" color="tertiary" className="font-mono uppercase tracking-wide">
        {label}
      </Text>
      <View className="flex-row flex-wrap items-center gap-3">{children}</View>
    </View>
  );
}

export default function GsProbe() {
  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerClassName="gap-6 p-5 pt-16">
          <Text variant="title2">gluestack × VM0 tokens</Text>

          <Row label="variant">
            <Button variant="default">
              <ButtonText>Default</ButtonText>
            </Button>
            <Button variant="secondary">
              <ButtonText>Secondary</ButtonText>
            </Button>
            <Button variant="tinted">
              <ButtonText>Tinted</ButtonText>
            </Button>
            <Button variant="outline">
              <ButtonText>Outline</ButtonText>
            </Button>
            <Button variant="destructive">
              <ButtonText>Delete</ButtonText>
            </Button>
            <Button variant="ghost">
              <ButtonText>Ghost</ButtonText>
            </Button>
          </Row>

          <Row label="size · 50 / 34 / 28">
            <Button size="lg" variant="default">
              <ButtonText>Large</ButtonText>
            </Button>
            <Button size="default" variant="default">
              <ButtonText>Medium</ButtonText>
            </Button>
            <Button size="sm" variant="default">
              <ButtonText>Small</ButtonText>
            </Button>
          </Row>

          <Row label="state">
            <Button variant="default" isDisabled>
              <ButtonText>Disabled</ButtonText>
            </Button>
            <Button variant="tinted" isDisabled>
              <ButtonText>Disabled</ButtonText>
            </Button>
          </Row>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
