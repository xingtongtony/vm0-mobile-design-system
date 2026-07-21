import SwiftUI
import UIKit

// VM0 图标 —— 加载 bundle 里的 Tabler PNG,模板着色(= 我们自己的图标库)
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

struct ChatView: View {
    @State private var mode = 0
    @State private var input = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                userBubble("这个 workspace 的 bug 帮我看下")
                assistantLine("好的,我先检查一下工作区状态。")
                userBubble("继续")
                assistantBlock
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
        }
        .defaultScrollAnchor(.bottom)  // 聊天默认停在最新消息 —— 内容自然垫到玻璃条下
        // 内容滚到玻璃条底下(原生 nav bar 模式)—— 玻璃折射滚过的内容
        .safeAreaInset(edge: .top) { topBar }
        .safeAreaInset(edge: .bottom) { inputBar }
        .background(Color.vm.bgGrouped.ignoresSafeArea())  // 纯色底,保持简洁
    }

    // 顶栏:玻璃圆钮 · 原生 Segmented · 玻璃圆钮
    private var topBar: some View {
        HStack {
            glassCircle("user")
            Spacer()
            // 原生 SwiftUI segmented(不定制;自带滑动动画,高度用系统默认)
            Picker("", selection: $mode) {
                Text("Agent").tag(0)
                Text("Task").tag(1)
            }
            .pickerStyle(.segmented)
            .frame(width: 200)
            Spacer()
            glassCircle("pin")
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    // header button = 真 Liquid Glass(iOS 26 .glassEffect)
    private func glassCircle(_ icon: String) -> some View {
        VMIcon(name: icon, size: 19, color: .vm.label)
            .frame(width: 40, height: 40)
            .glassEffect(.regular.interactive(), in: .circle)
    }

    private func userBubble(_ text: String) -> some View {
        HStack {
            Spacer()
            Text(text)
                .font(.vm.body)
                .foregroundStyle(Color.vm.label)
                .padding(.horizontal, 16)
                .padding(.vertical, 9)
                .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        }
    }

    private func assistantLine(_ text: String) -> some View {
        HStack {
            Text(text)
                .font(.vm.body)
                .foregroundStyle(Color.vm.label)
            Spacer()
        }
    }

    private var assistantBlock: some View {
        VStack(alignment: .leading, spacing: 16) {
            RoundedRectangle(cornerRadius: 11, style: .continuous)
                .fill(Color.vm.tint)
                .frame(width: 40, height: 40)
                .overlay(VMIcon(name: "mood-smile", size: 22, color: .white))

            Group {
                Text("The workspace was wiped between turns — I need to re-clone and re-apply the changes.")
                Text("Now I'll re-apply the changes — the JSX edit and the CSS rule.")
                Text("Now I'll regenerate firewalls and run lint, type-check, and the affected tests.")
                Text("Pushed to PR #11357. Changes:")
            }
            .font(.vm.body)
            .foregroundStyle(Color.vm.label)
            .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 10) {
                chip("zero-stack-card")
                chip("mobile-stack-list.tsx")
            }

            HStack(spacing: 20) {
                VMIcon(name: "list", size: 20, color: .vm.labelTertiary)
                VMIcon(name: "copy", size: 20, color: .vm.labelTertiary)
            }
            .padding(.top, 2)

            Text("Delivered at May 11, 10:26 AM")
                .font(.vm.footnote)
                .italic()
                .foregroundStyle(Color.vm.labelTertiary)
        }
    }

    private func chip(_ text: String) -> some View {
        Text(text)
            .font(.vm.monoBody)
            .foregroundStyle(Color.vm.label)
            .lineLimit(1)
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(Color.vm.fill2, in: RoundedRectangle(cornerRadius: 8, style: .continuous))
    }

    // chatbox = 真 Liquid Glass
    private var inputBar: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(input.isEmpty ? "How can I help you?" : input)
                .font(.vm.body)
                .foregroundStyle(Color.vm.labelTertiary)

            HStack(spacing: 22) {
                VMIcon(name: "plus", size: 22, color: .vm.label)
                VMIcon(name: "paperclip", size: 22, color: .vm.label)
                VMIcon(name: "plug", size: 22, color: .vm.label)
                Spacer()
                VMIcon(name: "sparkles", size: 22, color: .vm.tint)
                Circle()
                    .fill(Color.vm.tint)
                    .frame(width: 38, height: 38)
                    .overlay(VMIcon(name: "microphone", size: 18, color: .white))
            }
        }
        .padding(18)
        .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
        .padding(.horizontal, 12)
        .padding(.bottom, 8)
    }
}
