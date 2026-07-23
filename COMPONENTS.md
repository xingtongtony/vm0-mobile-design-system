# VM0 SwiftUI 组件清单(POC)

> 纯 SwiftUI 原生 app · iOS 26.5 · 单一真源 = Figma 设计系统 + `theme/theme.ts` token
> 原则:**优先系统组件 → 系统改不了的用原生 SwiftUI 原语拼 → 全部套 VM0 token**

---

## 0. 基础层 (Foundations)

### Color tokens — `VMTheme.swift`
与 `theme/theme.ts`(main 分支,Figma 导出 2026-07-20)同源,全套语义色:
tint 族 / bg 族(Apple grouped model)/ label 4 阶 / fill 4 阶 / separator / status + subtle。
**明暗双模式已实现**:每个色都是 `UIColor dynamicProvider`,跟随系统自动切换。
用法:`Color.vm.tint`、`Color.vm.bgGrouped`。radius / space / rule 常量在 `VM.radius.* / VM.space.* / VM.rule.*`。

### Typography — `VMTheme.swift`
`Font.vm.body / .headline / .title2 …` 全阶梯(同 tokens.json "type",Apple 字号)。
Noto Sans / JetBrains Mono `.ttf` 打进 bundle + `Info.plist UIAppFonts` 后自动生效;
缺字体时回退系统字(POC 当前状态)。

### Icon — `VMIcon`
- **来源**:Tabler(我们的图标库),outline SVG。
- **管线**:SVG(宽高改 240)→ qlmanage 光栅 → Swift 工具 `makeicons.swift`
  把亮度转 alpha(线条不透明/白底透明)+ **统一固定裁边 16px**(关键:保持 24 网格
  同一缩放,笔画粗细才一致)→ bundle PNG,`.renderingMode(.template)` 着色。
- **参数**:`name / size / color`(color 走 token)。
- **待办立项**:升级为 **asset catalog + SF Symbol 自定义符号**(矢量、多分辨率);
  若有从设计文件按精确尺寸导出的 outlined 版本,用那份替换 PNG 管线。

---

## 1. 组件层 (Components)

| 组件 | 原生基础 | VM0 定制 | 约束 / 备注 |
|---|---|---|---|
| **VMIcon** | `Image(uiImage:).template` | Tabler + token 着色 | 见上;笔画一致靠"统一裁边" |
| **GlassCircleButton** | `.glassEffect(.regular.interactive(), in:.circle)` | 内嵌 VMIcon | 真 Liquid Glass;**需背后有内容/渐变才显形** |
| **VMSegmented** | 原生 SwiftUI 原语(`Capsule`+`Text`+`HStack`) | 高度可控(44)、选中白胶囊+阴影、token 文字色 | ⚠️ **系统 `Picker(.segmented)` 高度锁死 ~32pt 改不了**,所以自拼;仍是纯 SwiftUI |
| **UserBubble** | `Text` + `.background(RoundedRectangle 18)` | vmFill 底、右对齐 | 自定义气泡(原生 app 标准做法) |
| **AssistantBlock** | `VStack` + `Text` + 头像方块 | tint 头像、token 正文色 | 头像 = `RoundedRectangle(.vmTint)` + VMIcon |
| **CodeChip** | `Text(.monospaced)` + `.background(RoundedRectangle 8)` | vmChip 底、`.lineLimit(1)` | |
| **InputBar (chatbox)** | `.glassEffect(.regular, in: RoundedRectangle 26)` | 真玻璃 + token 图标 | 底部;玻璃需渐变背景才显形 |
| **发送键** | `Circle().fill(.vmTint)` + VMIcon(mic) | 实色 tint(非玻璃) | 主操作用实色更醒目 |

---

## 2. 已确立的关键决策(native-first)

1. **系统组件改不了的维度(如 Segmented 高度、UISwitch 样式)→ 用原生 SwiftUI 原语自拼**,
   不硬套系统件。仍属"原生",只是不用 UIKit 那颗固定件。
2. **Liquid Glass 是原生 `.glassEffect`**,但天生微妙 —— 靠折射背后内容显形,纯色底上近乎隐形。
   浮层组件(header 钮、chatbox、TabBar、Sheet)才用玻璃;平铺控件不用。
3. **图标统一裁边** 而非各自包围盒裁 —— 否则笔画粗细不一致。
4. **验证主战场 = iOS 模拟器**(`simctl`),不是浏览器。

---

## 3. 立项待办(从 POC → 正式 app)

- [ ] 建 Xcode 工程(取代 swiftc 手搓 bundle)
- [ ] `VMTheme`(全套 token + 明暗)+ Noto Sans 字体 + `Font` 扩展
- [ ] `VMIcon` 升级 asset catalog / SF Symbol 自定义符号
- [ ] 把 POC 里的组件抽成独立可复用 View 文件
- [ ] 组件库文档随代码走(本文件迁入工程 `/Docs`)
