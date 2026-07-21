# VM0 SwiftUI POC

纯 SwiftUI 原生 iOS app 概念验证 —— VM0 移动设计系统的原生落地。
无 React Native / Expo。iOS 26.5,`swiftc` 直编(暂无 Xcode 工程)。

## 内容
- `VM0App.swift` — app 入口
- `ChatView.swift` — 聊天页(原生 Picker segmented、Liquid Glass、Tabler 图标、VM0 token 色)
- `makeicons.swift` — Tabler SVG → 模板 PNG 图标管线(亮度转 alpha + 固定窗口居中裁剪)
- `*.png` — Tabler 图标(bundle 资源)
- `COMPONENTS.md` — 组件清单与 native-first 决策记录

## 构建 & 跑模拟器(无 Xcode 工程)
先在 Simulator.app 里 boot 一台设备,然后:
```bash
./build.sh
```
`build.sh` 做了:编译 → 打包 `VM0Chat.app`(含 `Info.plist`,**没有它会报 `Missing bundle ID`**)→ `simctl install` + `launch`。

手动等价命令:
```bash
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
SDK=$(xcrun --sdk iphonesimulator --show-sdk-path)
xcrun --sdk iphonesimulator swiftc -target arm64-apple-ios26.0-simulator -sdk "$SDK" \
  VM0App.swift VMTheme.swift ChatView.swift -o VM0Chat
mkdir -p VM0Chat.app && cp VM0Chat *.png Info.plist VM0Chat.app/
xcrun simctl install booted VM0Chat.app && xcrun simctl launch booted ai.vm0.chatpoc
```
> 深色模式验证:Simulator 菜单 **Features > Toggle Appearance**(⇧⌘A)。

## 状态
POC。待正式立项:Xcode 工程 + `VMTheme`(全套 token + 明暗)+ Noto Sans 打包 + 图标升级为 asset catalog/SF Symbol。
