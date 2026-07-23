import SwiftUI

// Skill/Workflows bottom sheet —— 对应 vm0 web 的 Workflows 页面。
// 展示已定义好的 workflow;点一条 → 带入 chatbox(onPick)。全部 SwiftUI 原生组件。
struct WorkflowsSheet: View {
    var onClose: () -> Void
    var onPick: (Workflow) -> Void

    @State private var query = ""
    @State private var filter = "All"
    private let filters = ["All", "Automated", "Manual", "Private", "Public"]

    private var filtered: [Workflow] {
        Workflow.samples.filter {
            (query.isEmpty || $0.name.localizedCaseInsensitiveContains(query)) &&
            (filter == "All" || $0.trigger == filter ||
             (filter == "Public" && $0.isPublic) || (filter == "Private" && !$0.isPublic))
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            // 过滤 chips(原生 ScrollView 横滑)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(filters, id: \.self) { f in
                        let on = filter == f
                        Button { filter = f } label: {
                            Text(f).font(.vm.subhead)
                                .foregroundStyle(on ? Color.vm.onTint : Color.vm.label)
                                .padding(.horizontal, 14).frame(height: 32)
                                .background(on ? Color.vm.label : Color.vm.fill3, in: Capsule())
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 20)
            }
            .padding(.top, 6).padding(.bottom, 4)

            // 列表:原生 List(compact,行更紧凑,离上面更近)
            List {
                Section {
                    ForEach(filtered) { w in
                        Button { onPick(w) } label: { row(w) }
                            .buttonStyle(.plain)
                            .listRowBackground(Color.vm.bgElevated)
                            .listRowInsets(EdgeInsets(top: 2, leading: 14, bottom: 2, trailing: 14))
                    }
                }
            }
            .listStyle(.insetGrouped)
            .listSectionSpacing(.compact)
            .contentMargins(.top, 6, for: .scrollContent)
            .scrollContentBackground(.hidden)
        }
        // 原生 .searchable —— iOS 26 在 iPhone 上默认渲染成底部悬浮 glass 搜索(同 Settings)
        .searchable(text: $query, prompt: "Search workflows")
        .tint(Color.vm.tint)
        .vmSheetChrome(title: "Workflows", onClose: onClose)
        .presentationDetents([.medium, .large])   // 默认半层,用户可自行拖到全层
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
    }

    private func row(_ w: Workflow) -> some View {
        HStack(spacing: 12) {
            // workflow 图标 tile(route)
            VMIcon(name: "route", size: 18, color: .vm.label)
                .frame(width: 32, height: 32)
                .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.md, style: .continuous))
            Text(w.name).font(.vm.body).foregroundStyle(Color.vm.label).lineLimit(1)
            Spacer(minLength: 8)
            Text(w.trigger)
                .font(.vm.caption1).foregroundStyle(Color.vm.labelSecondary)
                .padding(.horizontal, 9).frame(height: 22)
                .background(Color.vm.fill3, in: Capsule())
            if w.isPublic {
                VMIcon(name: "world", size: 15, color: .vm.link)
            }
            AgentAvatar(agent: Agent(id: w.name, name: w.name, avatar: w.agentAvatar, initial: "•"), size: 24)
        }
        .frame(height: 44)
        .contentShape(Rectangle())
    }
}
