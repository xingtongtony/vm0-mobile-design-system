import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** VM0 Token 验证屏 — 全部用 NativeWind className 消费语义 token,验证 Figma→代码 链路
 *  切换系统深浅色可看 bg/label/tint 等自动翻转。 */

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <View className="items-center gap-1">
      <View className={`h-14 w-14 rounded-md border border-separator-hairline ${className}`} />
      <Text className="font-mono text-caption2 text-label-secondary">{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="font-sans-semibold text-footnote uppercase tracking-wide text-label-secondary">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-bg">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerClassName="gap-8 p-5 pb-24">
          {/* Header */}
          <View className="gap-1">
            <Text className="font-sans-bold text-large-title text-label">VM0 Design Tokens</Text>
            <Text className="font-sans text-body text-label-secondary">
              Noto Sans · NativeWind · 语义变量随明暗自动翻转
            </Text>
          </View>

          {/* 品牌 / 背景 */}
          <Section title="Brand & Background">
            <View className="flex-row flex-wrap gap-4">
              <Swatch label="tint" className="bg-tint" />
              <Swatch label="tint-pressed" className="bg-tint-pressed" />
              <Swatch label="tint-subtle" className="bg-tint-subtle" />
              <Swatch label="bg-grouped" className="bg-bg-grouped" />
              <Swatch label="bg-secondary" className="bg-bg-secondary" />
              <Swatch label="fill-1" className="bg-fill-1" />
            </View>
          </Section>

          {/* 状态色 */}
          <Section title="Status">
            <View className="flex-row flex-wrap gap-4">
              <Swatch label="success" className="bg-success" />
              <Swatch label="destructive" className="bg-destructive" />
              <Swatch label="done" className="bg-done" />
              <Swatch label="link" className="bg-link" />
              <Swatch label="warning" className="bg-warning" />
            </View>
            <View className="flex-row flex-wrap gap-2">
              <View className="rounded-full bg-subtle-success px-3 py-1">
                <Text className="font-sans-medium text-caption1 text-success">Success</Text>
              </View>
              <View className="rounded-full bg-subtle-destructive px-3 py-1">
                <Text className="font-sans-medium text-caption1 text-destructive">Error</Text>
              </View>
              <View className="rounded-full bg-subtle-warning px-3 py-1">
                <Text className="font-sans-medium text-caption1 text-warning">Warning</Text>
              </View>
              <View className="rounded-full bg-subtle-link px-3 py-1">
                <Text className="font-sans-medium text-caption1 text-link">Link</Text>
              </View>
            </View>
          </Section>

          {/* 字号阶梯 */}
          <Section title="Type Ramp">
            <View className="gap-2 rounded-card bg-bg-secondary p-4">
              <Text className="font-sans-bold text-large-title text-label">Large Title 34</Text>
              <Text className="font-sans-bold text-title1 text-label">Title 1 · 28</Text>
              <Text className="font-sans-semibold text-title2 text-label">Title 2 · 22</Text>
              <Text className="font-sans-semibold text-title3 text-label">Title 3 · 20</Text>
              <Text className="font-sans text-body text-label">Body · 17 正文中文字体</Text>
              <Text className="font-sans text-subhead text-label-secondary">Subhead · 15</Text>
              <Text className="font-sans text-footnote text-label-tertiary">Footnote · 13</Text>
              <Text className="font-mono text-mono text-link">mono · JetBrains 14</Text>
            </View>
          </Section>

          {/* 卡片 + 圆角 */}
          <Section title="Card & Radius">
            <View className="gap-3 rounded-card border border-separator-hairline bg-bg-elevated p-4">
              <View className="flex-row items-center justify-between">
                <Text className="font-sans-semibold text-headline text-label">余额</Text>
                <View className="rounded-full bg-tint px-3 py-1">
                  <Text className="font-sans-medium text-caption1 text-on-tint">VM0</Text>
                </View>
              </View>
              <Text className="font-sans-bold text-title1 text-label">$12,480.00</Text>
              <View className="h-px bg-separator" />
              <Text className="font-sans text-subhead text-label-secondary">
                border-separator · rounded-card(16) · bg-elevated
              </Text>
            </View>
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
