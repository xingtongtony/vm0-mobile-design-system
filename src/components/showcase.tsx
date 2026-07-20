import { ReactNode, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ---------- 入场动效(web:CSS stagger;native:直接显示) ---------- */

const REVEAL = [
  'animate-fade-up',
  'animate-fade-up-1',
  'animate-fade-up-2',
  'animate-fade-up-3',
  'animate-fade-up-4',
  'animate-fade-up-5',
] as const;

export function reveal(order = 0) {
  if (Platform.OS !== 'web') return '';
  return REVEAL[Math.min(order, REVEAL.length - 1)];
}

/* ---------- 页面骨架 ---------- */

export function Screen({ children }: { children: ReactNode }) {
  const topPad = Platform.OS === 'web' ? 'pt-24' : 'pt-4';
  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName={`w-full max-w-[720px] self-center gap-12 px-5 pb-32 ${topPad}`}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------- 区块(Geist 式:编号 eyebrow + 标题 + 说明) ---------- */

export function Section({
  step,
  title,
  desc,
  order = 0,
  children,
}: {
  step: string;
  title: string;
  desc?: string;
  order?: number;
  children: ReactNode;
}) {
  return (
    <View className={`gap-6 ${reveal(order)}`}>
      <View className="gap-1.5 border-t border-separator-hairline pt-8">
        <Text className="font-mono text-caption1 tracking-[3px] text-tint">{step}</Text>
        <Text className="font-sans-bold text-title2 text-label">{title}</Text>
        {desc ? (
          <Text className="max-w-[560px] font-sans text-subhead leading-5 text-label-secondary">
            {desc}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="font-sans-semibold text-caption1 uppercase tracking-[1.5px] text-label-tertiary">
      {children}
    </Text>
  );
}

export function MetaChip({ children }: { children: ReactNode }) {
  return (
    <View className="rounded-full border border-separator-hairline bg-bg-secondary px-3 py-1.5">
      <Text className="font-mono text-caption1 text-label-secondary">{children}</Text>
    </View>
  );
}

/* ---------- Token 行(Geist/Polaris 式:swatch + 名称 + 值,点击复制类名) ---------- */

export function TokenRow({
  name,
  cls,
  value,
  swatch,
  last = false,
}: {
  name: string;
  cls: string;
  value: string;
  swatch: string;
  last?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(cls);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    }
  };

  return (
    <Pressable
      onPress={copy}
      className={`flex-row items-center gap-3.5 py-2.5 active:opacity-60 ${
        last ? '' : 'border-b border-separator-hairline'
      }`}>
      <View className={`h-11 w-11 rounded-lg border border-separator-hairline ${swatch}`} />
      <Text className="flex-1 font-sans-medium text-subhead text-label">{name}</Text>
      <Text className={`font-mono text-caption1 ${copied ? 'text-tint' : 'text-label-tertiary'}`}>
        {copied ? 'copied ✓' : value}
      </Text>
    </Pressable>
  );
}
