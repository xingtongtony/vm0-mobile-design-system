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

// Zero 头像 —— 官方手绘吉祥物(源自 vm0-marketing / vm0 desktop 的 zero-avatar.png)
// 透明底插画,坐在自适应的 tintSubtle 圆角底上;缺图时回退小笑脸。
struct ZeroAvatar: View {
    var size: CGFloat = 40

    var body: some View {
        Group {
            if let path = Bundle.main.path(forResource: "zero-avatar", ofType: "png"),
               let ui = UIImage(contentsOfFile: path) {
                Image(uiImage: ui).resizable().scaledToFit()
            } else {
                VMIcon(name: "mood-smile", size: size * 0.55, color: .white)
            }
        }
        .frame(width: size, height: size)
        .background(Color.vm.tintSubtle)
        .clipShape(RoundedRectangle(cornerRadius: size * 0.275, style: .continuous))
    }
}

// 运行中指示点 —— 品牌橙,thread 行 / assistant running 行共用
struct RunningDot: View {
    var size: CGFloat = 7
    var body: some View { Circle().fill(Color.vm.tint).frame(width: size, height: size) }
}

struct ChatView: View {
    @State private var messages: [ChatMessage] = ChatMessage.sampleThread
    @State private var input = ""
    @State private var showThreads = false
    @State private var threadTitle = "Workspace bug triage"

    // 空态 starter 模板(解决"用户不知道 Zero 能干嘛")
    private let templates = [
        "Summarize my inbox",
        "Triage GitHub issues",
        "Draft a standup update",
        "Review a pull request",
    ]

    var body: some View {
        ScrollView {
            if messages.isEmpty {
                emptyState
            } else {
                VStack(alignment: .leading, spacing: 22) {
                    ForEach(messages) { messageView($0) }
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
            }
        }
        .defaultScrollAnchor(.bottom)
        .safeAreaInset(edge: .top) { topBar }
        .safeAreaInset(edge: .bottom) { inputBar }
        .background(Color.vm.bgGrouped.ignoresSafeArea())
        .sheet(isPresented: $showThreads) {
            ThreadsView(
                onSelect: { t in
                    threadTitle = t.title
                    messages = ChatMessage.sampleThread   // POC:任选一条都载入同一段样例
                },
                onNew: { startNewChat() }
            )
        }
    }

    // 顶栏:threads 抽屉 · 当前标题 · 新建(照桌面:左找我的东西 / 右开新的)
    private var topBar: some View {
        HStack {
            glassCircle("list") { showThreads = true }
            Spacer()
            Text(messages.isEmpty ? "New chat" : threadTitle)
                .font(.vm.headline)
                .foregroundStyle(Color.vm.label)
                .lineLimit(1)
            Spacer()
            glassCircle("plus") { startNewChat() }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    // header button = 真 Liquid Glass(iOS 26 .glassEffect)
    private func glassCircle(_ icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VMIcon(name: icon, size: 19, color: .vm.label)
                .frame(width: 40, height: 40)
                .glassEffect(.regular.interactive(), in: .circle)
        }
        .buttonStyle(.plain)
    }

    // 空态:Zero 头像 + 招呼 + 模板 tile(点一下直接发)
    private var emptyState: some View {
        VStack(spacing: 24) {
            ZeroAvatar(size: 64)
            Text("How can I help, Tong?")
                .font(.vm.title2)
                .foregroundStyle(Color.vm.label)
            LazyVGrid(
                columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)],
                spacing: 10
            ) {
                ForEach(templates, id: \.self) { t in
                    Button { send(t) } label: {
                        Text(t)
                            .font(.vm.subhead)
                            .foregroundStyle(Color.vm.label)
                            .multilineTextAlignment(.leading)
                            .frame(maxWidth: .infinity, minHeight: 62, alignment: .topLeading)
                            .padding(14)
                            .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.lg, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 20)
        .padding(.top, 72)
    }

    @ViewBuilder private func messageView(_ m: ChatMessage) -> some View {
        switch m.role {
        case .user: userBubble(m.text)
        case .assistant: assistantBlock(m)
        }
    }

    private func userBubble(_ text: String) -> some View {
        HStack {
            Spacer(minLength: 40)
            Text(text)
                .font(.vm.body)
                .foregroundStyle(Color.vm.label)
                .padding(.horizontal, 16)
                .padding(.vertical, 9)
                .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        }
    }

    private func assistantBlock(_ m: ChatMessage) -> some View {
        HStack(alignment: .top, spacing: 12) {
            if m.groupStart {
                ZeroAvatar(size: 32)
            } else {
                Color.clear.frame(width: 32, height: 0)
            }
            VStack(alignment: .leading, spacing: 14) {
                Text(m.text)
                    .font(.vm.body)
                    .foregroundStyle(Color.vm.label)
                    .fixedSize(horizontal: false, vertical: true)

                if !m.chips.isEmpty {
                    HStack(spacing: 10) {
                        ForEach(m.chips, id: \.self) { chip($0) }
                    }
                }
                if m.running {
                    HStack(spacing: 8) {
                        RunningDot()
                        Text("Running…").font(.vm.footnote).foregroundStyle(Color.vm.tint)
                    }
                }
                if let d = m.delivered {
                    Text(d).font(.vm.footnote).italic().foregroundStyle(Color.vm.labelTertiary)
                }
            }
            Spacer(minLength: 0)
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

    // chatbox = 真 Liquid Glass;左 + 菜单(收敛附件/连接/模板)· 上下文 · 发送
    private var inputBar: some View {
        VStack(alignment: .leading, spacing: 12) {
            TextField("Message Zero…", text: $input, axis: .vertical)
                .font(.vm.body)
                .foregroundStyle(Color.vm.label)
                .tint(Color.vm.tint)          // 光标 = 品牌橙
                .lineLimit(1...5)

            HStack(spacing: 18) {
                // + = 统一"添加"菜单(原生 Menu;附件吸收进来)
                Menu {
                    Button { } label: { Label("Attach file", systemImage: "paperclip") }
                    Button { } label: { Label("Photo", systemImage: "photo") }
                    Button { } label: { Label("Add connector", systemImage: "bolt") }
                    Button { } label: { Label("Templates", systemImage: "square.grid.2x2") }
                } label: {
                    VMIcon(name: "plus", size: 22, color: .vm.label)
                }

                // 上下文/connector 常驻(Zero 招牌:这次让它用哪个 repo / 收件箱)
                Button { } label: { VMIcon(name: "plug", size: 22, color: .vm.label) }
                    .buttonStyle(.plain)

                Spacer()

                // 主操作:实色 tint 圆钮(有文字=发送,空=语音)
                Button { send(input) } label: {
                    Circle()
                        .fill(Color.vm.tint)
                        .frame(width: 38, height: 38)
                        .overlay(VMIcon(name: "microphone", size: 18, color: .white))
                }
                .buttonStyle(.plain)
            }
        }
        .tint(Color.vm.tint)
        .padding(18)
        .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
        .padding(.horizontal, 12)
        .padding(.bottom, 8)
    }

    private func send(_ text: String) {
        let t = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return }
        if messages.isEmpty { threadTitle = t }
        messages.append(ChatMessage(role: .user, text: t))
        input = ""
        // POC:一句 canned 回执,让 flow 看起来是活的
        messages.append(ChatMessage(role: .assistant, text: "On it — let me take a look.", running: true))
    }

    private func startNewChat() {
        messages = []
        input = ""
        threadTitle = "New chat"
    }
}
