import {
  IconArrowRight,
  IconBell,
  IconChevronRight,
  IconCreditCard,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconUser,
} from '@tabler/icons-react-native';
import { ReactNode, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { GroupLabel, reveal, Screen, Section } from '@/components/showcase';
import { useIconColors } from '@/hooks/use-tokens';

/* ---------------- Button ---------------- */

const BTN_VARIANT = {
  primary: { box: 'bg-tint active:bg-tint-pressed', text: 'text-on-tint' },
  secondary: { box: 'bg-fill-3 active:bg-fill-2', text: 'text-label' },
  tinted: { box: 'bg-tint-subtle active:opacity-70', text: 'text-tint' },
  destructive: { box: 'bg-subtle-destructive active:opacity-70', text: 'text-destructive' },
} as const;

const BTN_SIZE = {
  lg: { box: 'h-[50px] px-7', text: 'font-sans-semibold text-body' },
  md: { box: 'h-11 px-5', text: 'font-sans-semibold text-subhead' },
  sm: { box: 'h-8 px-3.5', text: 'font-sans-medium text-footnote' },
} as const;

function DemoButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
}: {
  children: ReactNode;
  variant?: keyof typeof BTN_VARIANT;
  size?: keyof typeof BTN_SIZE;
  icon?: ReactNode;
}) {
  const v = BTN_VARIANT[variant];
  const s = BTN_SIZE[size];
  return (
    <Pressable
      className={`flex-row items-center justify-center gap-1.5 rounded-full ${v.box} ${s.box}`}>
      <Text className={`${s.text} ${v.text}`}>{children}</Text>
      {icon}
    </Pressable>
  );
}

/* ---------------- Switch(CSS transition) ---------------- */

function DemoSwitch({ initial = false }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <Pressable
      onPress={() => setOn(!on)}
      className={`w-[54px] rounded-full p-[2px] ${on ? 'bg-tint' : 'bg-fill-1'}`}>
      <View
        style={{ transform: [{ translateX: on ? 22 : 0 }] }}
        className="h-[27px] w-[27px] rounded-full bg-white shadow-sm transition-transform duration-200"
      />
    </Pressable>
  );
}

/* ---------------- Segmented ---------------- */

function DemoSegmented() {
  const opts = ['Day', 'Week', 'Month'];
  const [sel, setSel] = useState(1);
  return (
    <View className="flex-row rounded-lg bg-fill-3 p-[3px]">
      {opts.map((o, i) => (
        <Pressable
          key={o}
          onPress={() => setSel(i)}
          className={`h-8 flex-1 items-center justify-center rounded-[7px] ${
            sel === i ? 'bg-bg-elevated shadow-sm' : ''
          }`}>
          <Text
            className={`text-footnote ${
              sel === i ? 'font-sans-semibold text-label' : 'font-sans-medium text-label-secondary'
            }`}>
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/* ---------------- Progress ---------------- */

function DemoProgress({ value }: { value: number }) {
  return (
    <View className="h-1.5 overflow-hidden rounded-full bg-fill-3">
      <View
        style={{ width: `${value}%` }}
        className="h-full rounded-full bg-tint transition-all duration-700"
      />
    </View>
  );
}

/* ---------------- 页面 ---------------- */

export default function ComponentsScreen() {
  const ic = useIconColors();

  const LIST = [
    { icon: <IconUser size={17} color={ic.onTint} />, bg: 'bg-tint', title: 'Account', value: 'Tony' },
    { icon: <IconBell size={17} color={ic.onTint} />, bg: 'bg-link', title: 'Notifications', value: 'On' },
    { icon: <IconShieldCheck size={17} color={ic.onTint} />, bg: 'bg-success', title: 'Privacy', value: '' },
    { icon: <IconCreditCard size={17} color={ic.onTint} />, bg: 'bg-done', title: 'Billing', value: 'Pro' },
  ];

  return (
    <Screen>
      <View className={`gap-3 ${reveal(0)}`}>
        <Text className="font-mono text-caption1 tracking-[4px] text-tint">COMPONENT PREVIEW</Text>
        <Text className="font-sans-bold text-[42px] leading-[48px] tracking-tight text-label">
          用 token 拼出来的组件
        </Text>
        <Text className="max-w-[560px] font-sans text-body leading-6 text-label-secondary">
          每个样式都来自语义 token — 没有一个手写色值。切换明暗,它们全部自动适配。
        </Text>
      </View>

      {/* 01 Buttons */}
      <Section step="01" title="Button" desc="4 变体 × 3 尺寸,胶囊形,按压态用 tint-pressed。" order={1}>
        <View className="gap-5">
          <View className="gap-2.5">
            <GroupLabel>Variants</GroupLabel>
            <View className="flex-row flex-wrap items-center gap-3">
              <DemoButton variant="primary" icon={<IconArrowRight size={16} color={ic.onTint} />}>
                Continue
              </DemoButton>
              <DemoButton variant="secondary">Cancel</DemoButton>
              <DemoButton variant="tinted">Upgrade</DemoButton>
              <DemoButton variant="destructive">Delete</DemoButton>
            </View>
          </View>
          <View className="gap-2.5">
            <GroupLabel>Sizes — 50 / 44 / 32</GroupLabel>
            <View className="flex-row flex-wrap items-center gap-3">
              <DemoButton size="lg">Get started</DemoButton>
              <DemoButton size="md" variant="tinted">Medium</DemoButton>
              <DemoButton size="sm" variant="secondary">Small</DemoButton>
            </View>
          </View>
        </View>
      </Section>

      {/* 02 Badges */}
      <Section step="02" title="Badge & Tag" desc="subtle 底 + 同族前景色,信息层级轻。" order={2}>
        <View className="flex-row flex-wrap items-center gap-2.5">
          {[
            ['bg-subtle-success', 'bg-success', 'text-success', 'Active'],
            ['bg-subtle-warning', 'bg-warning', 'text-warning', 'Pending'],
            ['bg-subtle-destructive', 'bg-destructive', 'text-destructive', 'Failed'],
            ['bg-subtle-link', 'bg-link', 'text-link', 'Beta'],
            ['bg-subtle-done', 'bg-done', 'text-done', 'Shipped'],
          ].map(([pill, dot, txt, label]) => (
            <View key={label} className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${pill}`}>
              <View className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              <Text className={`font-sans-medium text-caption1 ${txt}`}>{label}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* 03 Controls */}
      <Section step="03" title="Controls" desc="Switch 与 Segmented 都可交互,过渡走 CSS。" order={3}>
        <View className="gap-5 rounded-card bg-bg-secondary p-5">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-label">推送通知</Text>
            <DemoSwitch initial />
          </View>
          <View className="h-px bg-separator-hairline" />
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-body text-label">自动同步</Text>
            <DemoSwitch />
          </View>
          <View className="h-px bg-separator-hairline" />
          <DemoSegmented />
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="font-sans text-footnote text-label-secondary">Storage</Text>
              <Text className="font-mono text-footnote text-label-secondary">68%</Text>
            </View>
            <DemoProgress value={68} />
          </View>
        </View>
      </Section>

      {/* 04 Inputs */}
      <Section step="04" title="Input" desc="fill 底的 search,描边的 field — 高度对齐 44。" order={4}>
        <View className="gap-4">
          <View className="h-11 flex-row items-center gap-2.5 rounded-lg bg-fill-3 px-3.5">
            <IconSearch size={17} color={ic.labelTertiary} />
            <Text className="font-sans text-body text-label-tertiary">Search</Text>
          </View>
          <View className="gap-1.5">
            <Text className="font-sans-medium text-footnote text-label-secondary">Email</Text>
            <View className="h-11 justify-center rounded-lg border border-separator bg-bg px-4">
              <Text className="font-sans text-body text-label">tony@vm0.ai</Text>
            </View>
            <Text className="font-sans text-caption1 text-label-tertiary">用于接收账单与安全通知</Text>
          </View>
        </View>
      </Section>

      {/* 05 List */}
      <Section step="05" title="List" desc="iOS inset grouped 列表,图标位用状态色块。" order={5}>
        <View className="overflow-hidden rounded-card bg-bg-secondary">
          {LIST.map((row, i) => (
            <Pressable
              key={row.title}
              className={`h-12 flex-row items-center gap-3 px-4 active:bg-fill-4 ${
                i === LIST.length - 1 ? '' : 'border-b border-separator-hairline'
              }`}>
              <View className={`h-[30px] w-[30px] items-center justify-center rounded-md ${row.bg}`}>
                {row.icon}
              </View>
              <Text className="flex-1 font-sans text-body text-label">{row.title}</Text>
              {row.value ? (
                <Text className="font-sans text-subhead text-label-secondary">{row.value}</Text>
              ) : null}
              <IconChevronRight size={16} color={ic.labelTertiary} />
            </Pressable>
          ))}
        </View>
      </Section>

      {/* 06 Card */}
      <Section step="06" title="Card" desc="elevated 面 + hairline 描边 + card 圆角。" order={5}>
        <View className="overflow-hidden rounded-card border border-separator-hairline bg-bg-elevated">
          <View className="h-32 items-center justify-center bg-tint-subtle">
            <IconSparkles size={44} color={ic.tint} />
          </View>
          <View className="gap-1.5 p-5">
            <Text className="font-sans-semibold text-headline text-label">升级到 VM0 Pro</Text>
            <Text className="font-sans text-subhead leading-5 text-label-secondary">
              解锁全部模型与更高的并发额度,随时取消。
            </Text>
            <View className="mt-3 flex-row">
              <DemoButton size="sm">Learn more</DemoButton>
            </View>
          </View>
        </View>
      </Section>
    </Screen>
  );
}
