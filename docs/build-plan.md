# VM0 Mobile App — 搭建计划(Step by Step)

**技术栈:** Expo + Expo Router + NativeWind v4 + gluestack-ui v2 + @tabler/icons-react-native
**核心原则:** Figma 变量 = 唯一真源 → 导成代码 token → NativeWind theme → gluestack 组件 → 页面。设计和代码共用一套 token。

图例:🤖 = 我(Claude)能生成/代做 · 🧑 = 你来跑命令/真机验收

---

## Phase 0 — Token 桥(地基)🤖
把 Figma 里的 VM0 变量导成代码 token,这是设计↔代码的单一来源。
- [ ] 导出颜色:所有语义色(bg / label / fill / separator / status / tint)的 Light + Dark
- [ ] 导出排版:Noto Sans ramp(largeTitle→caption2)的字号/字重/行高
- [ ] 导出圆角、间距(8pt 栅格)、规则(44 触控 / 16 边距)
- [ ] 导出 dataviz 色板
- **产物:** `theme.ts`(带类型的 token)+ `tailwind.config.js` + `tokens.json`

## Phase 1 — 项目初始化 🧑(我给命令 + 配置)
- [ ] `npx create-expo-app@latest vm0-app`(TypeScript + Expo Router 模板)
- [ ] 装依赖:
  - `nativewind` `tailwindcss`
  - gluestack-ui v2(CLI 初始化)
  - `react-native-reanimated` `react-native-gesture-handler` `react-native-safe-area-context` `react-native-screens`
  - `expo-blur` `expo-font` `expo-image` `expo-haptics`
  - `@tabler/icons-react-native`
- [ ] 配置 babel / metro(nativewind + reanimated 插件)、`tailwind.config`(塞入 Phase 0 的 token)、`global.css`
- [ ] 字体:把 Noto Sans / Noto Sans SC / JetBrains Mono 放进 assets,用 `expo-font` 在根 layout 加载

## Phase 2 — 代码里的 theme 层 🤖
- [ ] `ThemeProvider` + `useTheme`(Light/Dark:`useColorScheme` + 手动切换)
- [ ] 颜色 token 用 CSS 变量做明暗(NativeWind 支持 `:root` 变量),组件只用语义类名(`bg-background` `text-label` `border-separator`…)
- [ ] 排版组件:`<Text variant="body|headline|title2|…">`,映射到 ramp;接 Dynamic Type 缩放(`allowFontScaling` + clamp)
- [ ] 圆角 / 间距工具

## Phase 3 — 核心组件(把设计系统落成代码)🤖 生成 · 🧑 审
按"用得最多"的优先级建,每个都对齐 Figma 组件 + VM0 token:
- [ ] **基础**:Text/Typography、Icon(Tabler 封装,图标名与 Figma 一致)、Surface/Card
- [ ] **控件**:Button(variant/size)、TextField/Input、Toggle/Switch、SegmentedControl、Checkbox、Slider、Stepper
- [ ] **结构**:List + Cell/Row、TabBar、NavBar/Header、Sheet/BottomSheet、Alert/ActionSheet、Badge/Tag
- 每个组件:props 对齐 Figma 变体;颜色/圆角/字体全走 token;做 Light+Dark;截图和 Figma 对比

## Phase 4 — App 骨架 🤖
- [ ] Expo Router 结构(tabs + stacks)
- [ ] `Screen` 原语(安全区、背景、滚动)
- [ ] 导航外壳(原生感 tab bar、header)用核心组件搭
- [ ] 材质:`expo-blur` 做半透明导航/tab/sheet

## Phase 5 — 搭真实页面 🤖 生成 · 🧑 指方向
- [ ] 挑第一批流程(如 onboarding / home / settings)
- [ ] 用核心组件拼页面
- [ ] 和 Figma 并排验收、切暗色、上真机看

## Phase 6 — 打磨 & 验收 🧑 为主
- [ ] 真机测试(原生保真度、手势、毛玻璃)
- [ ] 暗色模式全过一遍
- [ ] Dynamic Type / 无障碍(触控 44、对比度)
- [ ] 性能

---

## ⭐ 建议的第一个里程碑(别一次全做)
先打通"**一条竖切**"证明管线通:
> Phase 0(token)→ Phase 1(项目起来)→ Phase 2(theme)→ Phase 3 只做 **Button + Text + Icon** → Phase 5 搭 **1 个页面**。

这条竖切跑通、真机上和 Figma 一致、暗色正常 —— 就证明"Figma token → NativeWind → gluestack → 页面"整条链路成立。之后再横向铺开其余组件和页面,风险最低。

## 日常工作流(建立后)
- **改 token**:改 Figma 变量 → 重新导出 theme → 代码同步(或直接改 `theme.ts` 并保持 Figma 同步)
- **加组件**:代码里按 Figma 搭 → 加进组件库
- **定位**:Figma = 视觉规范;代码 = 实现;token = 桥
