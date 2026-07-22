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

// Agent 头像 —— 官方插画直接显示,无背景、无裁切(Zero = 手绘吉祥物 zero-avatar.png)。
// 没有头像资源的 agent 回退成首字母圆片。
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

// 运行中指示点 —— 品牌橙,thread 行 / assistant running 行共用
struct RunningDot: View {
    var size: CGFloat = 7
    var body: some View { Circle().fill(Color.vm.tint).frame(width: size, height: size) }
}

struct ChatView: View {
    @State private var messages: [ChatMessage] = ChatMessage.sampleThread
    @State private var input = ""
    @State private var showThreads = false
    @State private var showAgentPicker = false
    @State private var agentID = Agent.zero.id

    private var currentAgent: Agent {
        Agent.samples.first { $0.id == agentID } ?? .zero
    }

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
                onSelect: { _ in messages = ChatMessage.sampleThread },
                onNew: { startNewChat() }
            )
        }
    }

    // 顶栏:threads 圆钮 · agent 切换 pill(无标题) · 新建圆钮
    private var topBar: some View {
        HStack(spacing: 10) {
            glassCircle("list") { showThreads = true }
            agentSwitcher
            Spacer()
            glassCircle("plus") { startNewChat() }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    // agent 切换入口 —— 玻璃 pill,点开是原生 .popover 下拉(每行带真头像 + 选中打勾)
    private var agentSwitcher: some View {
        Button { showAgentPicker = true } label: {
            HStack(spacing: 8) {
                AgentAvatar(agent: currentAgent, size: 24)
                Text(currentAgent.name)
                    .font(.vm.headline)
                    .foregroundStyle(Color.vm.label)
                Image(systemName: "chevron.down")   // 占位:待换成 Tabler chevron
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Color.vm.labelSecondary)
            }
            .padding(.leading, 6)
            .padding(.trailing, 12)
            .frame(height: 40)
            .glassEffect(.regular.interactive(), in: Capsule())
        }
        .buttonStyle(.plain)
        .popover(isPresented: $showAgentPicker) {
            agentPicker.presentationCompactAdaptation(.popover)
        }
    }

    // 下拉内容 —— 原生行,头像常显(不用等选完)
    private var agentPicker: some View {
        VStack(spacing: 0) {
            ForEach(Array(Agent.samples.enumerated()), id: \.element.id) { idx, a in
                Button {
                    agentID = a.id
                    showAgentPicker = false
                } label: {
                    HStack(spacing: 10) {
                        AgentAvatar(agent: a, size: 30)
                        Text(a.name).font(.vm.headline).foregroundStyle(Color.vm.label)
                        Spacer(minLength: 24)
                        if a.id == agentID {
                            Image(systemName: "checkmark")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(Color.vm.tint)
                        }
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                if idx < Agent.samples.count - 1 {
                    Divider().overlay(Color.vm.separatorHairline)
                }
            }
        }
        .frame(width: 240)
        .background(Color.vm.bgElevated)
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

    // 空态:agent 头像 + 招呼 + 模板 tile(点一下直接发)
    private var emptyState: some View {
        VStack(spacing: 24) {
            AgentAvatar(agent: currentAgent, size: 64)
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

    // assistant:头像在正文上方(VStack),无背景
    private func assistantBlock(_ m: ChatMessage) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            if m.groupStart {
                AgentAvatar(agent: currentAgent, size: 40)
            }
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
        messages.append(ChatMessage(role: .user, text: t))
        input = ""
        // POC:一句 canned 回执,让 flow 看起来是活的
        messages.append(ChatMessage(role: .assistant, text: "On it — let me take a look.", running: true))
    }

    private func startNewChat() {
        messages = []
        input = ""
    }
}
