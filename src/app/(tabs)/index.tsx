import { Text, View } from 'react-native';

import { GroupLabel, MetaChip, reveal, Screen, Section, TokenRow } from '@/components/showcase';

/* ---------------- token 数据(展示值与 theme/theme.ts 同源) ---------------- */

const BRAND = [
  { name: 'tint', cls: 'bg-tint', value: 'ED4E01 · FF6321', swatch: 'bg-tint' },
  { name: 'tint-pressed', cls: 'bg-tint-pressed', value: 'DE3F00 · FF7A45', swatch: 'bg-tint-pressed' },
  { name: 'tint-subtle', cls: 'bg-tint-subtle', value: 'FDE7DF · 16%', swatch: 'bg-tint-subtle' },
];

const SURFACE = [
  { name: 'bg', cls: 'bg-bg', value: 'FFFFFF · 0C0E12', swatch: 'bg-bg' },
  { name: 'bg-elevated', cls: 'bg-bg-elevated', value: 'FFFFFF · 1A1E26', swatch: 'bg-bg-elevated' },
  { name: 'bg-grouped', cls: 'bg-bg-grouped', value: 'F3F5F8 · 0C0E12', swatch: 'bg-bg-grouped' },
  { name: 'bg-tertiary', cls: 'bg-bg-tertiary', value: 'FFFFFF · 22262F', swatch: 'bg-bg-tertiary' },
];

const LABELS = [
  { name: 'label', cls: 'text-label', value: '14171D · F3F5F8', swatch: 'bg-label' },
  { name: 'label-secondary', cls: 'text-label-secondary', value: '60% · 70%', swatch: 'bg-label-secondary' },
  { name: 'label-tertiary', cls: 'text-label-tertiary', value: '30% · 30%', swatch: 'bg-label-tertiary' },
  { name: 'fill-1', cls: 'bg-fill-1', value: '20% · 36%', swatch: 'bg-fill-1' },
  { name: 'fill-3', cls: 'bg-fill-3', value: '12% · 24%', swatch: 'bg-fill-3' },
  { name: 'separator', cls: 'border-separator', value: 'C5CBD5 · 333944', swatch: 'bg-separator' },
];

const STATUS = [
  { name: 'success', text: 'Success', box: 'bg-success', pill: 'bg-subtle-success', pillText: 'text-success', value: '2A7A4B · 34B368' },
  { name: 'destructive', text: 'Error', box: 'bg-destructive', pill: 'bg-subtle-destructive', pillText: 'text-destructive', value: 'EF4444 · FF5C5C' },
  { name: 'done', text: 'Done', box: 'bg-done', pill: 'bg-subtle-done', pillText: 'text-done', value: '6A5ACD · 9A8CF0' },
  { name: 'link', text: 'Link', box: 'bg-link', pill: 'bg-subtle-link', pillText: 'text-link', value: '2E6FC2 · 5B9BF0' },
  { name: 'warning', text: 'Warning', box: 'bg-warning', pill: 'bg-subtle-warning', pillText: 'text-warning', value: 'B35A00 · E8912E' },
];

const TYPE_RAMP = [
  { label: 'Large Title', cls: 'font-sans-bold text-large-title', meta: '34/41 · 700' },
  { label: 'Title 1', cls: 'font-sans-bold text-title1', meta: '28/34 · 700' },
  { label: 'Title 2', cls: 'font-sans-semibold text-title2', meta: '22/28 · 600' },
  { label: 'Title 3', cls: 'font-sans-semibold text-title3', meta: '20/25 · 600' },
  { label: 'Headline', cls: 'font-sans-semibold text-headline', meta: '17/22 · 600' },
  { label: 'Body', cls: 'font-sans text-body', meta: '17/22 · 400' },
  { label: 'Callout', cls: 'font-sans text-callout', meta: '16/21 · 400' },
  { label: 'Subhead', cls: 'font-sans text-subhead', meta: '15/20 · 400' },
  { label: 'Footnote', cls: 'font-sans text-footnote', meta: '13/18 · 400' },
  { label: 'Caption', cls: 'font-sans text-caption1', meta: '12/16 · 400' },
];

const RADII = [
  { cls: 'rounded-xs', label: 'xs · 4' },
  { cls: 'rounded-sm', label: 'sm · 6' },
  { cls: 'rounded-md', label: 'md · 8' },
  { cls: 'rounded-lg', label: 'lg · 12' },
  { cls: 'rounded-card', label: 'card · 16' },
  { cls: 'rounded-xl', label: 'xl · 20' },
];

const SPACES = [2, 4, 8, 12, 16, 24, 32, 48];

/* ---------------- 页面 ---------------- */

export default function FoundationsScreen() {
  return (
    <Screen>
      {/* Hero */}
      <View className={`gap-6 ${reveal(0)}`}>
        <View className="gap-3">
          <Text className="font-mono text-caption1 tracking-[4px] text-tint">
            MOBILE DESIGN SYSTEM
          </Text>
          <Text className="font-sans-bold text-[42px] leading-[48px] tracking-tight text-label">
            为 VM0 而生的{'\n'}移动设计语言
          </Text>
          <Text className="max-w-[560px] font-sans text-body leading-6 text-label-secondary">
            iOS 27 的结构骨架 × VM0 的品牌基因。Figma 变量与代码 token 单一真源,明暗双模式自动切换。
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <MetaChip>v0.1</MetaChip>
          <MetaChip>63 color tokens</MetaChip>
          <MetaChip>Noto Sans</MetaChip>
          <MetaChip>Tabler Icons</MetaChip>
          <MetaChip>NativeWind</MetaChip>
        </View>

        {/* 品牌卡 */}
        <View className="overflow-hidden rounded-xl bg-tint">
          <View className="absolute -right-14 -top-24 h-64 w-64 rounded-full border-2 border-on-tint opacity-15" />
          <View className="absolute -right-4 -top-12 h-40 w-40 rounded-full border-2 border-on-tint opacity-20" />
          <View className="absolute right-6 top-2 h-20 w-20 rounded-full border-2 border-on-tint opacity-25" />
          <View className="gap-1 p-7">
            <Text className="font-sans-bold text-[64px] leading-[68px] tracking-tight text-on-tint">
              VM0
            </Text>
            <Text className="font-mono text-caption1 tracking-[2px] text-on-tint opacity-80">
              FIGMA → TOKENS → CODE
            </Text>
          </View>
        </View>
      </View>

      {/* 01 Color */}
      <Section
        step="01 · COLOR"
        title="色彩"
        desc="语义命名,不是色值命名。每个 token 都内置明暗两套值,点击行可复制类名。"
        order={1}>
        <View className="gap-6">
          <View className="gap-1">
            <GroupLabel>Brand</GroupLabel>
            <View>
              {BRAND.map((t, i) => (
                <TokenRow key={t.name} {...t} last={i === BRAND.length - 1} />
              ))}
            </View>
          </View>

          <View className="gap-1">
            <GroupLabel>Surface</GroupLabel>
            <View>
              {SURFACE.map((t, i) => (
                <TokenRow key={t.name} {...t} last={i === SURFACE.length - 1} />
              ))}
            </View>
          </View>

          <View className="gap-1">
            <GroupLabel>Label · Fill · Separator</GroupLabel>
            <View>
              {LABELS.map((t, i) => (
                <TokenRow key={t.name} {...t} last={i === LABELS.length - 1} />
              ))}
            </View>
          </View>

          <View className="gap-1">
            <GroupLabel>Status — solid + subtle 成对出现</GroupLabel>
            <View>
              {STATUS.map((s, i) => (
                <View
                  key={s.name}
                  className={`flex-row items-center gap-3.5 py-2.5 ${
                    i === STATUS.length - 1 ? '' : 'border-b border-separator-hairline'
                  }`}>
                  <View className={`h-11 w-11 rounded-lg border border-separator-hairline ${s.box}`} />
                  <View className="flex-1 flex-row items-center gap-2.5">
                    <Text className="font-sans-medium text-subhead text-label">{s.name}</Text>
                    <View className={`rounded-full px-2.5 py-1 ${s.pill}`}>
                      <Text className={`font-sans-medium text-caption2 ${s.pillText}`}>{s.text}</Text>
                    </View>
                  </View>
                  <Text className="font-mono text-caption1 text-label-tertiary">{s.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Section>

      {/* 02 Typography */}
      <Section
        step="02 · TYPOGRAPHY"
        title="字体"
        desc="Noto Sans 承接 iOS 字阶,中英同源;等宽用 JetBrains Mono。"
        order={2}>
        <View className="gap-6">
          <View>
            {TYPE_RAMP.map((t, i) => (
              <View
                key={t.label}
                className={`flex-row items-baseline justify-between gap-4 py-2.5 ${
                  i === TYPE_RAMP.length - 1 ? '' : 'border-b border-separator-hairline'
                }`}>
                <Text numberOfLines={1} className={`${t.cls} shrink text-label`}>
                  {t.label}
                </Text>
                <Text className="font-mono text-caption1 text-label-tertiary">{t.meta}</Text>
              </View>
            ))}
          </View>

          <View className="gap-3 rounded-card bg-bg-secondary p-5">
            <GroupLabel>Weights</GroupLabel>
            <View className="flex-row flex-wrap items-baseline gap-x-6 gap-y-2">
              <Text className="font-sans text-title2 text-label">Aa 400</Text>
              <Text className="font-sans-medium text-title2 text-label">Aa 500</Text>
              <Text className="font-sans-semibold text-title2 text-label">Aa 600</Text>
              <Text className="font-sans-bold text-title2 text-label">Aa 700</Text>
            </View>
            <View className="h-px bg-separator-hairline" />
            <Text className="font-sans text-body leading-6 text-label">
              全球化产品,中英混排是常态 — The quick brown fox jumps over the lazy dog.
            </Text>
            <Text className="font-mono text-mono text-link">const tint = &apos;#ED4E01&apos; // JetBrains Mono</Text>
          </View>
        </View>
      </Section>

      {/* 03 Radius */}
      <Section
        step="03 · RADIUS"
        title="圆角"
        desc="6 档语义圆角 + full。控件用 sm–lg,卡片用 card,胶囊用 full。"
        order={3}>
        <View className="flex-row flex-wrap gap-4">
          {RADII.map((r) => (
            <View key={r.label} className="items-center gap-2">
              <View className={`h-16 w-16 border-2 border-tint bg-tint-subtle ${r.cls}`} />
              <Text className="font-mono text-caption2 text-label-tertiary">{r.label}</Text>
            </View>
          ))}
          <View className="items-center gap-2">
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-tint bg-tint-subtle" />
            <Text className="font-mono text-caption2 text-label-tertiary">full</Text>
          </View>
        </View>
      </Section>

      {/* 04 Spacing */}
      <Section
        step="04 · SPACING"
        title="间距"
        desc="8pt 栅格,Tailwind 4px 阶直接映射 — p-4 = 16,gap-2 = 8。"
        order={4}>
        <View className="gap-2.5">
          {SPACES.map((s) => (
            <View key={s} className="flex-row items-center gap-4">
              <Text className="w-8 text-right font-mono text-caption1 text-label-tertiary">{s}</Text>
              <View style={{ width: s * 7 }} className="h-3 rounded-full bg-tint" />
            </View>
          ))}
        </View>
      </Section>

      {/* Footer */}
      <View
        className={`items-center gap-2.5 border-t border-separator-hairline pt-10 ${reveal(5)}`}>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-tint" />
          <Text className="font-sans-semibold text-footnote text-label">VM0 Design System</Text>
        </View>
        <Text className="font-mono text-caption2 text-label-tertiary">
          Figma XweEZS9K… → theme/theme.ts → NativeWind
        </Text>
      </View>
    </Screen>
  );
}
