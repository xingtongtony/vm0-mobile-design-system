import SwiftUI
import UIKit

// 组件(VMIcon / AgentAvatar / RunningDot / GlassCircleButton / GlassPill / SideDrawer)
// 都在 VMComponents.swift —— 单一真源,改那里即全局更新。

struct ChatView: View {
    @State private var messages: [ChatMessage] = ChatMessage.sampleThread
    @State private var input = ""
    @State private var showThreads = false
    @State private var showAgentPicker = false
    @State private var agentID = Agent.zero.id
    @State private var showAddSheet = false
    @State private var showWorkflows = false
    @State private var showConnectors = false
    @FocusState private var inputFocused: Bool

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
        .scrollDismissesKeyboard(.interactively)   // 下滑可交互收起键盘
        .safeAreaInset(edge: .top) { topBar }
        .safeAreaInset(edge: .bottom) { inputBar }
        .background(Color.vm.bgGrouped.ignoresSafeArea())
        .overlay(alignment: .leading) {
            SideDrawer(isOpen: $showThreads) {
                ThreadsDrawer(
                    onClose: { showThreads = false },
                    onSelect: { _ in messages = ChatMessage.sampleThread; showThreads = false },
                    onNew: { startNewChat(); showThreads = false }
                )
            }
        }
    }

    // 顶栏:三横线抽屉钮 · agent 切换 pill(无标题) · 新建圆钮
    private var topBar: some View {
        HStack(spacing: 10) {
            GlassCircleButton(icon: "menu") { showThreads = true }
            agentSwitcher
            Spacer()
            GlassCircleButton(icon: "plus") { startNewChat() }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    // agent 切换入口 —— 玻璃 pill,点开是原生 .popover 下拉(每行带真头像 + 选中打勾)
    private var agentSwitcher: some View {
        GlassPill {
            showAgentPicker = true
        } label: {
            HStack(spacing: 8) {
                AgentAvatar(agent: currentAgent, size: 24)
                Text(currentAgent.name)
                    .font(.vm.headline)
                    .foregroundStyle(Color.vm.label)
                VMIcon(name: "chevron-down", size: 14, color: .vm.labelSecondary)
            }
        }
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
                            VMIcon(name: "check", size: 16, color: .vm.tint)
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
        VStack(alignment: .leading, spacing: 10) {
            TextField("Message Zero…", text: $input, axis: .vertical)
                .font(.vm.body)
                .foregroundStyle(Color.vm.label)
                .tint(Color.vm.tint)          // 光标 = 品牌橙
                .lineLimit(1...5)
                .focused($inputFocused)
                .padding(.horizontal, 18)
                .padding(.top, 16)

            // 控件行:.center 共享中心线;间距收紧,更贴 chatbox 边缘,视觉更平衡
            HStack(alignment: .center, spacing: 14) {
                // + = 原生 bottom sheet(内容自排,图标用我们的 Tabler + 深色)
                Button { showAddSheet = true } label: {
                    VMIcon(name: "plus", size: 22, color: .vm.label)
                }
                .buttonStyle(.plain)

                // skill/workflow 入口 = 拼图,灰色 tile 背景
                Button { showWorkflows = true } label: {
                    VMIcon(name: "puzzle", size: 18, color: .vm.label)
                        .frame(width: 32, height: 32)
                        .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.md, style: .continuous))
                }
                .buttonStyle(.plain)

                // 已连接工具的叠加头像 → 打开 Connectors sheet
                Button { showConnectors = true } label: {
                    ConnectorStack(connectors: Connector.connected, size: 26)
                }
                .buttonStyle(.plain)

                Spacer()

                Button { send(input) } label: {
                    Circle()
                        .fill(Color.vm.tint)
                        .frame(width: 38, height: 38)
                        .overlay(VMIcon(name: "microphone", size: 18, color: .white))
                }
                .buttonStyle(.plain)
            }
            .padding(.leading, 12)
            .padding(.trailing, 8)
            .padding(.bottom, 8)
        }
        .tint(Color.vm.tint)
        .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
        .contentShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
        .onTapGesture { inputFocused = true }   // 点输入区任意位置 → 聚焦调起键盘
        .padding(.horizontal, 12)
        .padding(.bottom, 8)
        .sheet(isPresented: $showAddSheet) {
            ComposerAddSheet(onClose: { showAddSheet = false })
        }
        .sheet(isPresented: $showWorkflows) {
            WorkflowsSheet(
                onClose: { showWorkflows = false },
                onPick: { w in
                    input = input.isEmpty ? w.name : input + " " + w.name
                    showWorkflows = false
                    inputFocused = true
                }
            )
        }
        .sheet(isPresented: $showConnectors) {
            ConnectorsSheet(onClose: { showConnectors = false })
        }
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
