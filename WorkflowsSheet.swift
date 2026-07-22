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
            .padding(.top, 8).padding(.bottom, 6)

            // 列表:原生 List
            List {
                Section {
                    ForEach(filtered) { w in
                        Button { onPick(w) } label: { row(w) }
                            .buttonStyle(.plain)
                            .listRowBackground(Color.vm.bgElevated)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .scrollContentBackground(.hidden)
        }
        // 原生搜索(系统 glass 搜索栏)
        .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always), prompt: "Search workflows")
        .tint(Color.vm.tint)
        .vmSheetChrome(title: "Workflows", onClose: onClose)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
    }

    private func row(_ w: Workflow) -> some View {
        HStack(spacing: 12) {
            // workflow 图标 tile(拼图)
            VMIcon(name: "puzzle", size: 20, color: .vm.label)
                .frame(width: 38, height: 38)
                .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.md, style: .continuous))
            Text(w.name).font(.vm.body).foregroundStyle(Color.vm.label).lineLimit(1)
            Spacer(minLength: 8)
            Text(w.trigger)
                .font(.vm.caption1).foregroundStyle(Color.vm.labelSecondary)
                .padding(.horizontal, 10).frame(height: 24)
                .background(Color.vm.fill3, in: Capsule())
            if w.isPublic {
                VMIcon(name: "world", size: 16, color: .vm.link)
            }
            AgentAvatar(agent: Agent(id: w.name, name: w.name, avatar: w.agentAvatar, initial: "•"), size: 26)
        }
        .padding(.horizontal, 20).frame(height: 60)
        .contentShape(Rectangle())
    }
}
