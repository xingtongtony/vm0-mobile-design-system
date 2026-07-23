import SwiftUI
import UIKit

// 组件(VMIcon / AgentAvatar / RunningDot / GlassCircleButton / GlassPill / SideDrawer)
// 都在 VMComponents.swift —— 单一真源,改那里即全局更新。

struct ChatView: View {
    @State private var messages: [ChatMessage] = ChatMessage.sampleThread
    @State private var showThreads = false
    @State private var agentID = Agent.zero.id

    private var currentAgent: Agent {
        Agent.samples.first { $0.id == agentID } ?? .zero
    }

    var body: some View {
        Group {
            if messages.isEmpty {
                emptyState
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 22) {
                        ForEach(messages) { messageView($0) }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 12)
                }
                .defaultScrollAnchor(.bottom)
                .scrollDismissesKeyboard(.interactively)   // 下滑可交互收起键盘
            }
        }
        .safeAreaInset(edge: .top) { topBar }
        .safeAreaInset(edge: .bottom) { ChatComposer(onSend: sendMessage) }
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

    // agent 切换入口 —— 复用组件 VMPickerMenu;触发器是玻璃 pill
    private var agentSwitcher: some View {
        VMPickerMenu(
            items: Agent.samples.map { VMMenuItem(id: $0.id, title: $0.name, icon: $0.avatar) },
            selection: $agentID
        ) {
            HStack(spacing: 8) {
                AgentAvatar(agent: currentAgent, size: 24)
                Text(currentAgent.name)
                    .font(.vm.headline)
                    .foregroundStyle(Color.vm.label)
                VMIcon(name: "chevron-down", size: 14, color: .vm.labelSecondary)
            }
            .padding(.leading, 6).padding(.trailing, 12)
            .frame(height: 40)
            .glassEffect(.regular.interactive(), in: Capsule())
        }
    }

    // 空态:agent 头像 + 招呼,屏幕上下居中(去掉模板卡)
    private var emptyState: some View {
        VStack(spacing: 18) {
            Spacer()
            AgentAvatar(agent: currentAgent, size: 72)
            Text("How can I help, Tong?")
                .font(.vm.title2)
                .foregroundStyle(Color.vm.label)
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
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

    // 发送(上层持有 messages;composer 通过 onSend 回调进来)
    private func sendMessage(_ text: String) {
        let t = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return }
        messages.append(ChatMessage(role: .user, text: t))
        // POC:一句 canned 回执,让 flow 看起来是活的
        messages.append(ChatMessage(role: .assistant, text: "On it — let me take a look.", running: true))
    }

    private func startNewChat() {
        messages = []
    }
}
