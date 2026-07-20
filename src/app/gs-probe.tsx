import { IconCheck, IconPointFilled } from '@tabler/icons-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { Button, ButtonText } from '@/components/gluestack/button';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/gluestack/checkbox';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/gluestack/radio';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@/components/gluestack/slider';
import { Text } from '@/components/ui';

/** 临时探针:gluestack 组件套 VM0 token(flat 控件)。验完删除。 */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text variant="caption1" color="tertiary" className="font-mono uppercase tracking-wide">
        {label}
      </Text>
      {children}
    </View>
  );
}

export default function GsProbe() {
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [radio, setRadio] = useState('week');
  const [slider, setSlider] = useState(40);

  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerClassName="gap-7 p-5 pt-16">
          <View className="flex-row items-center justify-between">
            <Text variant="title2">gluestack × VM0 tokens</Text>
            <Button variant="ghost" size="sm" onPress={() => router.back()}>
              <ButtonText>关闭</ButtonText>
            </Button>
          </View>

          <Section label="button · variant">
            <View className="flex-row flex-wrap items-center gap-3">
              <Button variant="default">
                <ButtonText>Default</ButtonText>
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
            </View>
          </Section>

          <Section label="checkbox">
            <Checkbox value="a" isChecked={checkA} onChange={setCheckA}>
              <CheckboxIndicator>
                <CheckboxIcon as={IconCheck} />
              </CheckboxIndicator>
              <CheckboxLabel>推送通知</CheckboxLabel>
            </Checkbox>
            <Checkbox value="b" isChecked={checkB} onChange={setCheckB}>
              <CheckboxIndicator>
                <CheckboxIcon as={IconCheck} />
              </CheckboxIndicator>
              <CheckboxLabel>自动同步</CheckboxLabel>
            </Checkbox>
          </Section>

          <Section label="radio">
            <RadioGroup value={radio} onChange={setRadio}>
              <View className="gap-3">
                {['day', 'week', 'month'].map((v) => (
                  <Radio key={v} value={v}>
                    <RadioIndicator>
                      <RadioIcon as={IconPointFilled} />
                    </RadioIndicator>
                    <RadioLabel className="capitalize">{v}</RadioLabel>
                  </Radio>
                ))}
              </View>
            </RadioGroup>
          </Section>

          <Section label="slider">
            <Slider value={slider} onChange={setSlider} minValue={0} maxValue={100}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text variant="footnote" color="secondary" className="font-mono">
              {Math.round(slider)}
            </Text>
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
