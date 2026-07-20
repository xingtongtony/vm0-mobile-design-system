import {
  IconArrowRight,
  IconBell,
  IconCreditCard,
  IconPlus,
  IconShieldCheck,
  IconSparkles,
  IconTrash,
  IconUser,
} from '@tabler/icons-react-native';
import { useState } from 'react';
import { Text as RNText, View } from 'react-native';

import { GroupLabel, reveal, Screen, Section } from '@/components/showcase';
import {
  Badge,
  Button,
  Icon,
  ListGroup,
  ListRow,
  SearchField,
  Segmented,
  Text,
  TextField,
  Toggle,
  type TablerIcon,
} from '@/components/ui';

function IconTile({ icon, bg }: { icon: TablerIcon; bg: string }) {
  return (
    <View className={`h-[30px] w-[30px] items-center justify-center rounded-md ${bg}`}>
      <Icon icon={icon} size={17} color="onTint" />
    </View>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <View className="h-1.5 overflow-hidden rounded-full bg-fill-3">
      <View
        style={{ width: `${value}%` }}
        className="h-full rounded-full bg-tint transition-all duration-700"
      />
    </View>
  );
}

export default function ComponentsScreen() {
  const [push, setPush] = useState(true);
  const [sync, setSync] = useState(false);
  const [range, setRange] = useState(1);
  const [email, setEmail] = useState('tony@vm0.ai');

  return (
    <Screen>
      <View className={`gap-3 ${reveal(0)}`}>
        <RNText className="font-mono text-caption1 tracking-[4px] text-tint">
          COMPONENT LIBRARY
        </RNText>
        <RNText className="font-sans-bold text-[42px] leading-[48px] tracking-tight text-label">
          真组件,不是 demo
        </RNText>
        <RNText className="max-w-[560px] font-sans text-body leading-6 text-label-secondary">
          src/components/ui — API 与 Figma 组件变体 1:1 镜像,尺寸与色彩契约直接读自组件的绑定变量。
        </RNText>
      </View>

      {/* 01 Button */}
      <Section
        step="01 · BUTTON"
        title="Button"
        desc="variant = Figma Style(prominent/bordered/borderless),size = 50/34/28,destructive 与禁用态同源。"
        order={1}>
        <View className="gap-5">
          <View className="gap-2.5">
            <GroupLabel>Variants</GroupLabel>
            <View className="flex-row flex-wrap items-center gap-3">
              <Button variant="prominent" title="Continue" icon={IconArrowRight} />
              <Button variant="bordered" title="Options" />
              <Button variant="borderless" title="Not now" />
            </View>
          </View>
          <View className="gap-2.5">
            <GroupLabel>Sizes · Icon only</GroupLabel>
            <View className="flex-row flex-wrap items-center gap-3">
              <Button variant="prominent" size="lg" title="Get started" />
              <Button variant="bordered" size="md" title="Medium" />
              <Button variant="bordered" size="sm" title="Small" />
              <Button variant="bordered" icon={IconPlus} />
              <Button variant="prominent" size="lg" icon={IconPlus} />
            </View>
          </View>
          <View className="gap-2.5">
            <GroupLabel>Destructive · Disabled</GroupLabel>
            <View className="flex-row flex-wrap items-center gap-3">
              <Button variant="prominent" destructive title="Delete" icon={IconTrash} />
              <Button variant="bordered" destructive title="Remove" />
              <Button variant="prominent" disabled title="Disabled" />
              <Button variant="bordered" disabled title="Disabled" />
            </View>
          </View>
        </View>
      </Section>

      {/* 02 Badge */}
      <Section
        step="02 · BADGE"
        title="Badge"
        desc="VM0 扩展件(kit 无对应物,已标记缺口待回填 Figma)。"
        order={2}>
        <View className="flex-row flex-wrap items-center gap-2.5">
          <Badge label="Active" status="success" dot />
          <Badge label="Pending" status="warning" dot />
          <Badge label="Failed" status="destructive" dot />
          <Badge label="Beta" status="link" />
          <Badge label="Shipped" status="done" />
          <Badge label="Pro" status="tint" />
          <Badge label="Neutral" />
        </View>
      </Section>

      {/* 03 Controls */}
      <Section
        step="03 · CONTROLS"
        title="Toggle & Segmented"
        desc="Toggle 64×28(On=success,契约来自 kit 绑定变量);Segmented 胶囊 50/32。"
        order={3}>
        <View className="gap-5 rounded-card bg-bg-secondary p-5">
          <View className="flex-row items-center justify-between">
            <Text>推送通知</Text>
            <Toggle value={push} onValueChange={setPush} />
          </View>
          <View className="h-px bg-separator-hairline" />
          <View className="flex-row items-center justify-between">
            <Text>自动同步</Text>
            <Toggle value={sync} onValueChange={setSync} />
          </View>
          <View className="flex-row items-center justify-between">
            <Text color="tertiary">禁用态</Text>
            <Toggle value disabled />
          </View>
          <View className="h-px bg-separator-hairline" />
          <Segmented options={['Day', 'Week', 'Month']} selectedIndex={range} onChange={setRange} />
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text variant="footnote" color="secondary">
                Storage
              </Text>
              <Text variant="footnote" color="secondary" className="font-mono">
                68%
              </Text>
            </View>
            <Progress value={68} />
          </View>
        </View>
      </Section>

      {/* 04 Inputs */}
      <Section
        step="04 · INPUT"
        title="TextField & SearchField"
        desc="真输入框:standalone 描边 44,grouped 行内 52(=Figma Text Field),search 带清除。"
        order={4}>
        <View className="gap-4">
          <SearchField />
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            helper="用于接收账单与安全通知"
            keyboardType="email-address"
          />
          <ListGroup header="Grouped 变体">
            <TextField variant="grouped" placeholder="Server URL" />
            <TextField variant="grouped" placeholder="API Key" secureTextEntry />
          </ListGroup>
        </View>
      </Section>

      {/* 05 List */}
      <Section
        step="05 · LIST"
        title="List"
        desc="inset grouped;Row 52/68,分隔线左缩进;role=button/destructive 对应 Row - Button 变体。"
        order={5}>
        <View className="gap-6">
          <ListGroup header="Settings" footer="value + disclosure 对应 kit 的 _Trailing 类型。">
            <ListRow
              title="Account"
              value="Tony"
              disclosure
              onPress={() => {}}
              leading={<IconTile icon={IconUser} bg="bg-tint" />}
            />
            <ListRow
              title="Notifications"
              value={push ? 'On' : 'Off'}
              disclosure
              onPress={() => {}}
              leading={<IconTile icon={IconBell} bg="bg-link" />}
            />
            <ListRow
              title="Privacy"
              subtitle="Face ID · 数据加密"
              height="tall"
              disclosure
              onPress={() => {}}
              leading={<IconTile icon={IconShieldCheck} bg="bg-success" />}
            />
            <ListRow
              title="Billing"
              value="Pro"
              disclosure
              onPress={() => {}}
              leading={<IconTile icon={IconCreditCard} bg="bg-done" />}
            />
          </ListGroup>
          <ListGroup>
            <ListRow title="Sign out" role="button" onPress={() => {}} />
            <ListRow title="Delete account" role="destructive" onPress={() => {}} />
          </ListGroup>
        </View>
      </Section>

      {/* 06 Glass */}
      <Section
        step="06 · GLASS"
        title="Liquid Glass"
        desc="镜像 kit 的 Button - Liquid Glass(Glass / Glass Prominent)。玻璃只有浮在内容上才可见 — 白底上它本来就是隐形的;iOS 26+ 走 expo-glass-effect 真玻璃,web 用 backdrop-blur 近似。"
        order={5}>
        <View className="relative overflow-hidden rounded-card border border-separator-hairline">
          {/* 彩色内容层:玻璃的折射对象 */}
          <View className="absolute inset-0 bg-bg-secondary" />
          <View className="absolute -left-10 -top-14 h-44 w-44 rounded-full bg-tint opacity-90" />
          <View className="absolute left-28 top-12 h-32 w-32 rounded-full bg-link opacity-80" />
          <View className="absolute -top-8 right-6 h-40 w-40 rounded-full bg-warning opacity-80" />
          <View className="absolute -bottom-14 right-28 h-44 w-44 rounded-full bg-done opacity-80" />
          <View className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-success opacity-70" />

          <View className="items-center gap-4 px-6 py-10">
            <View className="flex-row flex-wrap items-center justify-center gap-3">
              <Button variant="glass" size="lg" title="Glass" />
              <Button variant="glassProminent" size="lg" title="Prominent" />
            </View>
            <View className="flex-row items-center justify-center gap-3">
              <Button variant="glass" size="lg" icon={IconPlus} />
              <Button variant="glass" icon={IconBell} />
              <Button variant="glassProminent" icon={IconArrowRight} />
              <Button variant="glass" size="sm" title="Small" />
            </View>
          </View>
        </View>
      </Section>

      {/* 07 Composition */}
      <Section
        step="07 · COMPOSITION"
        title="组合示例"
        desc="Card 由 token + 上面的组件拼装 — 没有一个手写色值。"
        order={5}>
        <View className="overflow-hidden rounded-card border border-separator-hairline bg-bg-elevated">
          <View className="h-32 items-center justify-center bg-tint-subtle">
            <Icon icon={IconSparkles} size={44} color="tint" />
          </View>
          <View className="gap-1.5 p-5">
            <View className="flex-row items-center justify-between">
              <Text variant="headline">升级到 VM0 Pro</Text>
              <Badge label="限时" status="tint" />
            </View>
            <Text variant="subhead" color="secondary" className="leading-5">
              解锁全部模型与更高的并发额度,随时取消。
            </Text>
            <View className="mt-3 flex-row gap-2.5">
              <Button variant="prominent" size="sm" title="Learn more" />
              <Button variant="borderless" size="sm" title="Dismiss" />
            </View>
          </View>
        </View>
      </Section>
    </Screen>
  );
}
