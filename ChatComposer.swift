import SwiftUI

// 聊天输入框(chatbox)—— 抽成独立组件(单一真源)。
// 自己管理输入文本 / 焦点 / 三个 sheet;发送通过 onSend 回调交给上层。
// 左下 + 与 skill 用统一的 CircleIconButton(与右侧发送钮同尺寸 38、居中对齐)。
struct ChatComposer: View {
    var onSend: (String) -> Void

    @State private var input = ""
    @State private var showAddSheet = false
    @State private var showWorkflows = false
    @State private var showConnectors = false
    @FocusState private var focused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {   // 文字区与控件行拉开一点
            TextField("Message Zero…", text: $input, axis: .vertical)
                .font(.vm.body)
                .foregroundStyle(Color.vm.label)
                .tint(Color.vm.tint)
                .lineLimit(1...5)
                .focused($focused)
                .padding(.horizontal, 18)
                .padding(.top, 20)                    // chatbox 更高一点

            // 控件行:左侧钮与右侧发送钮同为 38、.center 对齐
            HStack(alignment: .center, spacing: 12) {
                CircleIconButton(icon: "plus") { showAddSheet = true }
                CircleIconButton(icon: "route", iconSize: 19) { showWorkflows = true }

                // 已连接工具叠加头像 → Connectors sheet
                Button { showConnectors = true } label: {
                    ConnectorStack(connectors: Connector.connected, size: 26)
                }
                .buttonStyle(.plain)

                Spacer()

                // 发送:实色 tint 圆钮(38)
                Button { send() } label: {
                    Circle()
                        .fill(Color.vm.tint)
                        .frame(width: 38, height: 38)
                        .overlay(VMIcon(name: "microphone", size: 18, color: .white))
                }
                .buttonStyle(.plain)
            }
            .padding(.leading, 10)                     // 左侧钮更贴边
            .padding(.trailing, 8)
            .padding(.bottom, 8)
        }
        .tint(Color.vm.tint)
        .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 26, style: .continuous))
        .contentShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
        .onTapGesture { focused = true }
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
                    focused = true
                }
            )
        }
        .sheet(isPresented: $showConnectors) {
            ConnectorsSheet(onClose: { showConnectors = false })
        }
    }

    private func send() {
        let t = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return }
        onSend(t)
        input = ""
    }
}
