import {
  IconArrowRight,
  IconBell,
  IconChevronLeft,
  IconCreditCard,
  IconFolder,
  IconHome,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconTrash,
  IconUser,
} from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Text as RNText, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '../../../theme/theme';

import { GroupLabel, reveal, Screen, Section } from '@/components/showcase';
import {
  Badge,
  Button,
  Icon,
  ListGroup,
  ListRow,
  NavBar,
  NavBarButton,
  SearchField,
  Segmented,
  Sheet,
  TabBar,
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

/** Apple 式 glass 展示壁纸 — 连续柔和渐变(SwiftUI 文档同款思路),
 *  色相取自 theme token(demo 艺术层,非 UI 元素)。 */
function GlassWallpaper() {
  const c = colors.light;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 720 300" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="wp-base" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#f7dcc9" />
          <Stop offset="0.45" stopColor="#eee3ee" />
          <Stop offset="1" stopColor="#ccdff5" />
        </LinearGradient>
        <RadialGradient id="wp-tint" cx="0.16" cy="0.18" r="0.55">
          <Stop offset="0" stopColor={c.tint} stopOpacity="0.75" />
          <Stop offset="1" stopColor={c.tint} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="wp-link" cx="0.42" cy="0.95" r="0.6">
          <Stop offset="0" stopColor={c.link} stopOpacity="0.65" />
          <Stop offset="1" stopColor={c.link} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="wp-done" cx="0.85" cy="0.75" r="0.55">
          <Stop offset="0" stopColor={c.done} stopOpacity="0.6" />
          <Stop offset="1" stopColor={c.done} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="wp-warm" cx="0.72" cy="0.08" r="0.45">
          <Stop offset="0" stopColor={c.warning} stopOpacity="0.55" />
          <Stop offset="1" stopColor={c.warning} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width="720" height="300" fill="url(#wp-base)" />
      <Rect width="720" height="300" fill="url(#wp-tint)" />
      <Rect width="720" height="300" fill="url(#wp-link)" />
      <Rect width="720" height="300" fill="url(#wp-done)" />
      <Rect width="720" height="300" fill="url(#wp-warm)" />
    </Svg>
  );
}

export default function ComponentsScreen() {
  const [push, setPush] = useState(true);
  const [sync, setSync] = useState(false);
  const [range, setRange] = useState(1);
  const [email, setEmail] = useState('tony@vm0.ai');
  const [tab, setTab] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

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
        desc="iOS 上是真系统控件(UISwitch / SwiftUI segmented Picker)套 VM0 token;web 为手写 fallback。"
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
          {/* 壁纸层:玻璃的折射对象(Apple 文档同款展示方式) */}
          <View className="absolute inset-0">
            <GlassWallpaper />
          </View>

          <View className="items-center gap-6 px-6 py-14">
            {/* 玻璃工具条:icon-only 集群 */}
            <View className="flex-row items-center gap-3">
              <Button variant="glass" size="lg" icon={IconPlus} />
              <Button variant="glass" size="lg" icon={IconBell} />
              <Button variant="glass" size="lg" icon={IconUser} />
            </View>
            {/* 主按钮对:secondary glass + prominent CTA */}
            <View className="flex-row flex-wrap items-center justify-center gap-3">
              <Button variant="glass" size="lg" title="Not now" />
              <Button variant="glassProminent" size="lg" title="Get started" icon={IconArrowRight} />
            </View>
          </View>
        </View>
      </Section>

      {/* 07 Navigation */}
      <Section
        step="07 · NAVIGATION"
        title="NavBar · TabBar · Sheet"
        desc="NavBar/TabBar 为 web 展示实现(真机用 expo-router 原生);Sheet 在 iOS 是真 UISheetPresentationController(detent 0.52/0.93)。"
        order={5}>
        <View className="relative overflow-hidden rounded-card border border-separator-hairline">
          <View className="absolute inset-0">
            <GlassWallpaper />
          </View>

          <View className="min-h-[440px] justify-between py-3">
            <NavBar
              variant="large"
              title="Library"
              subtitle="128 items"
              leading={<NavBarButton icon={IconChevronLeft} />}
              trailing={
                <>
                  <NavBarButton icon={IconSearch} />
                  <NavBarButton icon={IconPlus} />
                </>
              }
            />

            <View className="items-center">
              <Button
                variant="glassProminent"
                title="Open sheet"
                onPress={() =>
                  Platform.OS === 'web' ? setSheetOpen(true) : router.push('/sheet-demo')
                }
              />
            </View>

            <TabBar
              items={[
                { label: 'Home', icon: IconHome },
                { label: 'Search', icon: IconSearch },
                { label: 'Library', icon: IconFolder },
                { label: 'Profile', icon: IconUser },
              ]}
              selectedIndex={tab}
              onChange={setTab}
            />
          </View>
        </View>

        <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)} detent="medium">
          <View className="gap-4 px-4">
            <View className="items-center">
              <Text variant="headline">分享到</Text>
            </View>
            <ListGroup>
              <ListRow
                title="信息"
                disclosure
                onPress={() => {}}
                leading={<IconTile icon={IconUser} bg="bg-success" />}
              />
              <ListRow
                title="邮件"
                disclosure
                onPress={() => {}}
                leading={<IconTile icon={IconBell} bg="bg-link" />}
              />
              <ListRow
                title="拷贝链接"
                role="button"
                onPress={() => setSheetOpen(false)}
                leading={<IconTile icon={IconPlus} bg="bg-tint" />}
              />
            </ListGroup>
            <Button variant="bordered" title="Cancel" onPress={() => setSheetOpen(false)} />
          </View>
        </Sheet>
      </Section>

      {/* 08 Composition */}
      <Section
        step="08 · COMPOSITION"
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
