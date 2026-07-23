import SwiftUI
import UIKit

// ============================================================================
// VM0 组件库(单一真源)
// 所有页面共用的原生组件都定义在这里 —— 改这一处,ChatView / ThreadsDrawer 等所有
// 引用处自动更新。新组件也加到这里,不要在各页面里重复造。
// 原则:原生 SwiftUI 基座 + 只做 token 的 font/color/icon 定制。
// ============================================================================

// MARK: - VMIcon
// 我们的图标库(Tabler PNG,模板着色)。图标已按 alpha 居中。
struct VMIcon: View {
    let name: String
    var size: CGFloat = 22
    var color: Color = .vm.label

    var body: some View {
        Group {
            if let path = Bundle.main.path(forResource: name, ofType: "png"),
               let ui = UIImage(contentsOfFile: path) {
                Image(uiImage: ui).renderingMode(.template).resizable().scaledToFit()
            } else {
                Image(systemName: "questionmark").resizable().scaledToFit()
            }
        }
        .frame(width: size, height: size)
        .foregroundStyle(color)
    }
}

// MARK: - VMImage
// 彩色原图(不做 template 着色)—— 用于 connector / 品牌图标等需要保留原色的图。
struct VMImage: View {
    let name: String
    var size: CGFloat = 28

    var body: some View {
        Group {
            if let path = Bundle.main.path(forResource: name, ofType: "png"),
               let ui = UIImage(contentsOfFile: path) {
                Image(uiImage: ui).resizable().scaledToFit()
            } else {
                RoundedRectangle(cornerRadius: 6, style: .continuous).fill(Color.vm.fill3)
            }
        }
        .frame(width: size, height: size)
    }
}

// MARK: - AgentAvatar
// vm0 官方 agent 插画,无背景、无裁切;缺图回退首字母圆片。
struct AgentAvatar: View {
    let agent: Agent
    var size: CGFloat = 40

    var body: some View {
        Group {
            if let path = Bundle.main.path(forResource: agent.avatar, ofType: "png"),
               let ui = UIImage(contentsOfFile: path) {
                Image(uiImage: ui).resizable().scaledToFit()
            } else {
                Circle()
                    .fill(Color.vm.fill3)
                    .overlay(
                        Text(agent.initial)
                            .font(.system(size: size * 0.42, weight: .semibold))
                            .foregroundStyle(Color.vm.labelSecondary)
                    )
            }
        }
        .frame(width: size, height: size)
    }
}

// MARK: - RunningDot
// 运行中指示点(品牌橙)。
struct RunningDot: View {
    var size: CGFloat = 7
    var body: some View { Circle().fill(Color.vm.tint).frame(width: size, height: size) }
}

// MARK: - GlassCircleButton
// 顶栏圆形玻璃图标钮(iOS 26 Liquid Glass)。图标默认中性 label 色。
struct GlassCircleButton: View {
    let icon: String
    var size: CGFloat = 40
    var iconSize: CGFloat = 19
    var color: Color = .vm.label
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            VMIcon(name: icon, size: iconSize, color: color)
                .frame(width: size, height: size)
                .glassEffect(.regular.interactive(), in: .circle)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - VMMenuIcon
// 把 bundle 里的 PNG 变成"带内边距的原色 UIImage",交给原生 Menu 的 Label。
// 原生菜单会把图标缩到固定槽位;满图铺满会显得偏大,加内边距(pad)让它像正常菜单图标。
enum VMMenuIcon {
    static func image(_ name: String, pad: CGFloat = 0.18) -> Image {
        guard let path = Bundle.main.path(forResource: name, ofType: "png"),
              let ui = UIImage(contentsOfFile: path) else {
            return Image(systemName: "cpu")
        }
        let canvas = CGSize(width: 32, height: 32)
        let inset = canvas.width * pad
        let rect = CGRect(x: inset, y: inset,
                          width: canvas.width - inset * 2,
                          height: canvas.height - inset * 2)
        let out = UIGraphicsImageRenderer(size: canvas).image { _ in
            ui.draw(in: rect)
        }.withRenderingMode(.alwaysOriginal)
        return Image(uiImage: out)
    }
}

// MARK: - VMPickerMenu
// 通用"带图标 + 选中打勾"的原生 Menu(单一真源)。模型切换 / agent 切换共用。
// items 给 id/标题/图标名(bundle png);trigger 是自定义触发器外观。
struct VMMenuItem: Identifiable {
    let id: String
    var title: String
    var icon: String
}

struct VMPickerMenu<Trigger: View>: View {
    let items: [VMMenuItem]
    @Binding var selection: String
    @ViewBuilder var trigger: () -> Trigger

    var body: some View {
        Menu {
            ForEach(items) { it in
                Button { selection = it.id } label: {
                    if it.id == selection {
                        Label { Text("✓  " + it.title) } icon: { VMMenuIcon.image(it.icon) }
                    } else {
                        Label { Text(it.title) } icon: { VMMenuIcon.image(it.icon) }
                    }
                }
            }
        } label: {
            trigger()
        }
    }
}

// MARK: - CircleIconButton
// 圆形灰底图标钮(composer 的 + / skill 等)。默认 38,与发送钮同尺寸。
struct CircleIconButton: View {
    let icon: String
    var size: CGFloat = 38
    var iconSize: CGFloat = 20
    var color: Color = .vm.label
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            VMIcon(name: icon, size: iconSize, color: color)
                .frame(width: size, height: size)
                .background(Circle().fill(Color.vm.fill3))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - GlassPill
// 玻璃胶囊按钮(如 agent 切换 pill)。label 内容自定义。
struct GlassPill<Label: View>: View {
    var height: CGFloat = 40
    var action: () -> Void
    @ViewBuilder var label: () -> Label

    var body: some View {
        Button(action: action) {
            label()
                .padding(.leading, 6)
                .padding(.trailing, 12)
                .frame(height: height)
                .glassEffect(.regular.interactive(), in: Capsule())
        }
        .buttonStyle(.plain)
    }
}

// MARK: - ConnectorStack
// 已连接工具的叠加头像(白圈环绕,重叠排列)—— 对话框里代替单个 plug 图标。
struct ConnectorStack: View {
    var connectors: [Connector]
    var size: CGFloat = 26

    var body: some View {
        HStack(spacing: -size * 0.34) {
            ForEach(connectors) { c in
                VMImage(name: c.icon, size: size * 0.6)
                    .frame(width: size, height: size)
                    .background(Circle().fill(Color.vm.bgElevated))
                    .overlay(Circle().strokeBorder(Color.vm.separatorHairline, lineWidth: 1))
            }
        }
    }
}

// MARK: - VMSheetChrome
// bottom sheet 原生头部 —— 用系统 NavigationStack + .toolbar(真原生导航栏)。
// 关闭键在 .topBarLeading,标题在 .principal(文字仍走我们的 Noto Sans)。
// 用法:  <sheet 内容>.vmSheetChrome(title: "Connectors", onClose: ...)
struct VMSheetChrome: ViewModifier {
    let title: String
    var onClose: () -> Void

    func body(content: Content) -> some View {
        NavigationStack {
            content
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarLeading) {
                        Button { onClose() } label: {
                            VMIcon(name: "x", size: 18, color: .vm.label)
                        }
                    }
                    ToolbarItem(placement: .principal) {
                        Text(title).font(.vm.headline).foregroundStyle(Color.vm.label)
                    }
                }
        }
    }
}

extension View {
    func vmSheetChrome(title: String, onClose: @escaping () -> Void) -> some View {
        modifier(VMSheetChrome(title: title, onClose: onClose))
    }
}

// MARK: - SideDrawer
// 左侧滑出抽屉(不是 bottom sheet)。scrim 点击关闭,内容从左边缘 move 进出。
struct SideDrawer<Content: View>: View {
    @Binding var isOpen: Bool
    var width: CGFloat = 320
    @ViewBuilder var content: () -> Content

    var body: some View {
        ZStack(alignment: .leading) {
            if isOpen {
                Color.black.opacity(0.25)
                    .ignoresSafeArea()
                    .transition(.opacity)
                    .onTapGesture { isOpen = false }
                content()
                    .frame(width: width)
                    .frame(maxHeight: .infinity, alignment: .top)
                    .background(Color.vm.bg)
                    .transition(.move(edge: .leading))
            }
        }
        .animation(.easeOut(duration: 0.22), value: isOpen)
    }
}
