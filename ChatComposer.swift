import SwiftUI

// 聊天输入框(chatbox)—— 抽成独立组件(单一真源)。
// 自己管理输入文本 / 焦点 / 三个 sheet;发送通过 onSend 回调交给上层。
// 左下 + 与 skill 用统一的 CircleIconButton(与右侧发送钮同尺寸 38、居中对齐)。
struct ChatComposer: View {
    var onSend: (String) -> Void

    @State private var input = ""
    @State private var showAddSheet = false
    @State private var showWorkflows = false
    @State private var modelID = Model.defaultID
    @FocusState private var focused: Bool

    private var currentModel: Model {
        Model.samples.first { $0.id == modelID } ?? Model.samples[0]
    }

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

            // 控件行:+ · skill · 模型菜单 · 发送;间距 8
            HStack(alignment: .center, spacing: 8) {
                CircleIconButton(icon: "plus") { showAddSheet = true }
                CircleIconButton(icon: "route", iconSize: 19) { showWorkflows = true }
                modelMenu

                Spacer(minLength: 8)

                // 发送:实色 tint 圆钮(38)
                Button { send() } label: {
                    Circle()
                        .fill(Color.vm.tint)
                        .frame(width: 38, height: 38)
                        .overlay(VMIcon(name: "microphone", size: 18, color: .white))
                }
                .buttonStyle(.plain)
            }
            .padding(.leading, 10)
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
    }

    // 模型切换 —— 原生 Menu(Picker 自动打勾)。button 只显示短名(无图标/无箭头/无 "Claude")
    private var modelMenu: some View {
        Menu {
            Picker("Model", selection: $modelID) {
                ForEach(Model.samples) { m in
                    Text(m.short).tag(m.id)
                }
            }
        } label: {
            Text(currentModel.short)
                .font(.vm.subhead).foregroundStyle(Color.vm.label).lineLimit(1)
                .padding(.horizontal, 12)
                .frame(height: 34)
                .background(Color.vm.fill3, in: Capsule())
        }
    }

    private func send() {
        let t = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return }
        onSend(t)
        input = ""
    }
}
