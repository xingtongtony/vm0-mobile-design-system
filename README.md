# VM0 Mobile Design System

VM0 移动端(React Native + Apple 原生组件)设计系统的**本地管理中心**。
以后关于 VM0 mobile 的脚本、文档、素材统一放这里。

## 目录

- `docs/` — 文档
  - `tokens-spec.md` — 合并后的完整 token 规范(颜色/字体/圆角/间距 + RN theme TS)
- `scripts/` — Figma 自动化脚本(`use_figma` 用的 JS 片段,可复跑)
- `assets/` — 素材(图标导出、截图等)

## Figma 源文件

- **fileKey**: `Ens34au82o2S3M5BYyrUXO`(VM0 team,Pro 套餐,Dark mode 可写)
- **连接器**: 用 `tongx@vm0.ai` 授权的那个 Figma MCP(不是 extendcip 那个)
- 由 Apple「iOS and iPadOS 27」社区 kit fork 而来,已就地 rebrand 成 VM0

## 合并要点(已完成)

| 层 | 内容 |
|---|---|
| `Colors`(Apple 原集合) | 63 变量重接到 VM0:tint 橙、冷灰分层、VM0 状态色,Light+Dark |
| `VM0 Primitives` | 58 变量:primary/gray 阶、status 明暗、dataviz |
| `VM0 Semantic` | 8 变量:link、tint pressed/subtle、状态 subtle BG(Light/Dark) |
| `VM0 Layout` | 19 变量:圆角 4→999、8pt 间距、44pt 触控 / 16pt 边距 |
| Text Styles ×34 | SF Pro → Noto Sans(字号/行高/Dynamic Type 保留) |

## 决策记录

- 字体:打包 **Noto Sans**(不用 SF Pro,求品牌统一);等宽 JetBrains Mono
- 灰阶:VM0 冷灰色相 + Apple 分层结构
- 状态色:全用 VM0 自己的
- 暗色背景:VM0 冷黑(`#0C0E12` 起底),非 OLED 纯黑
- 系统级组件页已加 `[System]` 前缀(参考、不碰):Keyboards / Alerts / Action Sheets /
  Activity Views / Face ID / Notifications / Color Pickers / Date & Time Pickers /
  Contextual Menus / Status Bars / Widgets / Windows / App Icons

## 待办

- [ ] 🟡 边界组件定夺(Sheets / Menus / Popovers / Sidebars / Toolbars 哪些自建)
- [ ] iPhone-first:标记 iPad-only 组件暂缓
- [ ] Publish 成 Figma Library
- [ ] (可选)落成 RN token 包 + 组件库 + Storybook
