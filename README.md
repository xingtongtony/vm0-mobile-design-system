# VM0 SwiftUI POC

纯 SwiftUI 原生 iOS app 概念验证 —— VM0 移动设计系统的原生落地。
无 React Native / Expo。iOS 26.5,`swiftc` 直编(暂无 Xcode 工程)。

## 内容
- `VM0App.swift` — app 入口
- `VMTheme.swift` — 全套 token(明暗双模式色 + Noto Sans 字阶 + radius/space)
- `VMComponents.swift` — **组件库单一真源**(VMIcon / AgentAvatar / RunningDot / GlassCircleButton / GlassPill / SideDrawer);改这一处 = 全局更新
- `ChatModels.swift` — Agent / ChatMessage / ChatThread(POC 假数据)
- `ChatView.swift` — 聊天页(chat-first:threads 抽屉 / 新建、空态模板 tile、Menu composer、Liquid Glass、Tabler 图标、VM0 token 色)
- `ThreadsView.swift` — 左侧 threads 抽屉(原生 List/searchable/swipeActions,照桌面模型)
- `makeicons.swift` — Tabler SVG → 模板 PNG 图标管线(亮度转 alpha + 固定窗口居中裁剪)
- `*.png` — Tabler 图标(bundle 资源)
- `COMPONENTS.md` — 组件清单与 native-first 决策记录

## 构建 & 跑模拟器(无 Xcode 工程)
先在 Simulator.app 里 boot 一台设备,然后:
```bash
./build.sh
```
`build.sh` 做了:编译 → 打包 `VM0Chat.app`(含 `Info.plist`,**没有它会报 `Missing bundle ID`**)→ `simctl install` + `launch`。

手动等价命令(app 源 = 除 `makeicons.swift` 外的所有 `.swift`):
```bash
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
SDK=$(xcrun --sdk iphonesimulator --show-sdk-path)
xcrun --sdk iphonesimulator swiftc -target arm64-apple-ios26.0-simulator -sdk "$SDK" \
  VM0App.swift VMTheme.swift ChatModels.swift ChatView.swift ThreadsView.swift -o VM0Chat
mkdir -p VM0Chat.app && cp VM0Chat *.png *.ttf Info.plist VM0Chat.app/
xcrun simctl install booted VM0Chat.app && xcrun simctl launch booted ai.vm0.chatpoc
```
> 深色模式验证:Simulator 菜单 **Features > Toggle Appearance**(⇧⌘A)。

## 状态
POC。待正式立项:Xcode 工程 + `VMTheme`(全套 token + 明暗)+ Noto Sans 打包 + 图标升级为 asset catalog/SF Symbol。

## 在真机 iPhone 上测试(需要 Xcode 工程 + 签名)
Simulator 的包不能装真机。真机要设备架构编译 + 代码签名 + Xcode 部署。用 XcodeGen 一键生成工程:
```bash
brew install xcodegen        # 只需一次
xcodegen generate            # 用 project.yml 生成 VM0Chat.xcodeproj
open VM0Chat.xcodeproj
```
在 Xcode 里:
1. 选 target `VM0Chat` → **Signing & Capabilities** → 勾 *Automatically manage signing* → **Team** 选你的 Apple ID(没有就 Add Account,免费个人 team 即可)。
2. iPhone 用数据线连上;iPhone 需 **iOS 26+**(工程 min 是 iOS 26),并在 **设置 → 隐私与安全性 → 开发者模式** 打开。
3. Xcode 顶部运行目标选你的 iPhone → **Run(⌘R)**。
4. 首次运行后在 iPhone **设置 → 通用 → VPN 与设备管理** 里信任你的开发者证书,再点开 app。

> 免费个人 team:app 约 **7 天**后需重新 Run 刷新;要长期/分发给别人用 **TestFlight**(需 99$/年 Apple Developer Program:Xcode Archive → 上传 App Store Connect → TestFlight 安装)。
