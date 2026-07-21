#!/bin/bash
# VM0 SwiftUI POC —— 编译 + 打包 + 装进已启动的 Simulator(无 Xcode 工程)
# 用法:./build.sh   (先在 Simulator.app 里 boot 一台设备)
set -euo pipefail

APP=VM0Chat
BUNDLE_ID=ai.vm0.chatpoc

export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
SDK=$(xcrun --sdk iphonesimulator --show-sdk-path)

echo "▸ compiling…"
# 编译除 makeicons.swift(macOS 工具,import AppKit)外的所有 app 源文件 —— 新增文件自动纳入
SOURCES=$(ls *.swift | grep -v '^makeicons.swift$' | tr '\n' ' ')
xcrun --sdk iphonesimulator swiftc -target arm64-apple-ios26.0-simulator -sdk "$SDK" \
  $SOURCES -o "$APP"

echo "▸ packaging $APP.app…"
rm -rf "$APP.app"
mkdir -p "$APP.app"
cp "$APP" *.png "$APP.app/"
cp Info.plist "$APP.app/"        # ← 关键:没有 Info.plist 就 "Missing bundle ID"
# 若已把字体 ttf 放进仓库,一并打包:
cp -f *.ttf "$APP.app/" 2>/dev/null || true

echo "▸ installing + launching…"
xcrun simctl install booted "$APP.app"
xcrun simctl launch booted "$BUNDLE_ID"
echo "✓ done — 切深色: Simulator 菜单 Features > Toggle Appearance (⇧⌘A)"
