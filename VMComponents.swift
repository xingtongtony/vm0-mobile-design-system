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

// MARK: - VMSheetHeader
// bottom sheet 通用头:关闭键在左,标题居中(导航栏式)。关闭是原生 SwiftUI Button。
struct VMSheetHeader: View {
    let title: String
    var onClose: () -> Void
    var body: some View {
        ZStack {
            Text(title).font(.vm.title3).foregroundStyle(Color.vm.label)   // 居中,semibold 20(比之前小且细)
            HStack {
                Button { onClose() } label: {
                    VMIcon(name: "x", size: 16, color: .vm.labelSecondary)
                        .frame(width: 36, height: 36)               // 关闭键调大
                        .background(Color.vm.fill3, in: Circle())
                }
                .buttonStyle(.plain)
                Spacer()
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 18)
        .padding(.bottom, 12)
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
