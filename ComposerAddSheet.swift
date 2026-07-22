import SwiftUI
import UniformTypeIdentifiers

// 卡片下方选项行的数据
struct AddOption: Identifiable {
    enum Trailing { case check, lock, maxLock, chevron }
    let id = UUID()
    var key: String
    var icon: String
    var title: String
    var subtitle: String?
    var trailing: Trailing
}

// composer + 的原生 bottom sheet —— Options 头(标题 + 关闭) + Image/Camera/File/Connectors 四卡。
// 点每张卡各自弹一个子 sheet(File 走原生 fileImporter)。全部 SwiftUI 原生组件。
struct ComposerAddSheet: View {
    var onClose: () -> Void

    private enum Sub: String, Identifiable { case image, camera, connectors; var id: String { rawValue } }
    @State private var sub: Sub?
    @State private var showFileImporter = false

    // 卡片下面那一列选项 —— 真实 vm0 项(Connectors 移到这里;非 vm0 的 Deep research/Model council 已删)
    private let options: [AddOption] = [
        .init(key: "connectors", icon: "plug",     title: "Connectors",      subtitle: "Use a connected integration", trailing: .chevron),
        .init(key: "templates",  icon: "template", title: "Templates",       subtitle: "Start from a template",       trailing: .chevron),
        .init(key: "workflow",   icon: "route",    title: "Create workflow", subtitle: "Automate a repeatable task",  trailing: .chevron),
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // 三张小卡(Connectors 已移到下面列表)
                HStack(spacing: 10) {
                    card("photo", "Image") { sub = .image }
                    card("camera", "Camera") { sub = .camera }
                    card("file-plus", "File") { showFileImporter = true }
                }

                // 下面的选项列表
                VStack(spacing: 0) {
                    ForEach(options) { opt in
                        Button { handleOption(opt) } label: { optionRow(opt) }
                            .buttonStyle(.plain)
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)
            .padding(.bottom, 20)
        }
        .vmSheetChrome(title: "Options", onClose: onClose)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
        .sheet(item: $sub) { which in
            switch which {
            case .image:      ImagePickerSheet(onClose: { sub = nil })
            case .camera:     CameraSheet(onClose: { sub = nil })
            case .connectors: ConnectorsSheet(onClose: { sub = nil })
            }
        }
        .fileImporter(
            isPresented: $showFileImporter,
            allowedContentTypes: [.item],
            allowsMultipleSelection: true
        ) { _ in
            onClose()
        }
    }

    private func handleOption(_ opt: AddOption) {
        if opt.key == "connectors" {
            sub = .connectors          // Connectors 打开它自己的子 sheet
        } else {
            onClose()                  // Templates / Create workflow:占位关闭
        }
    }

    private func optionRow(_ opt: AddOption) -> some View {
        let locked = (opt.trailing == .lock || opt.trailing == .maxLock)
        return HStack(spacing: 14) {
            VMIcon(name: opt.icon, size: 22, color: locked ? .vm.labelTertiary : .vm.label)
            VStack(alignment: .leading, spacing: 1) {
                HStack(spacing: 8) {
                    Text(opt.title)
                        .font(.vm.body)
                        .foregroundStyle(locked ? Color.vm.labelTertiary : Color.vm.label)
                    if opt.trailing == .maxLock {
                        Text("Max")
                            .font(.vm.caption2)
                            .foregroundStyle(Color.vm.tint)
                            .padding(.horizontal, 7).padding(.vertical, 2)
                            .background(Color.vm.tintSubtle, in: Capsule())
                    }
                }
                if let s = opt.subtitle {
                    Text(s).font(.vm.footnote).foregroundStyle(Color.vm.labelTertiary)
                }
            }
            Spacer()
            switch opt.trailing {
            case .check:
                VMIcon(name: "check", size: 16, color: .vm.tint)
            case .lock, .maxLock:
                VMIcon(name: "lock", size: 16, color: .vm.labelTertiary)
            case .chevron:
                VMIcon(name: "chevron-right", size: 16, color: .vm.labelTertiary)
            }
        }
        .frame(minHeight: 52)
        .contentShape(Rectangle())
    }

    private func card(_ icon: String, _ label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 8) {
                VMIcon(name: icon, size: 24, color: .vm.label)
                Text(label).font(.vm.footnote).foregroundStyle(Color.vm.label)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 82)
            .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.lg, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

// Image —— 近期照片网格(POC:渐变占位缩略图)
struct ImagePickerSheet: View {
    var onClose: () -> Void
    private let cols = [GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8)]
    private let swatches: [[Color]] = [
        [.orange, .pink], [.blue, .teal], [.purple, .indigo],
        [.green, .mint], [.red, .orange], [.cyan, .blue],
        [.yellow, .orange], [.pink, .purple], [.teal, .green],
    ]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: cols, spacing: 8) {
                ForEach(Array(swatches.enumerated()), id: \.offset) { _, c in
                    Button { onClose() } label: {
                        RoundedRectangle(cornerRadius: VM.radius.md, style: .continuous)
                            .fill(LinearGradient(colors: c, startPoint: .topLeading, endPoint: .bottomTrailing))
                            .aspectRatio(1, contentMode: .fit)
                            .overlay(VMIcon(name: "photo", size: 22, color: .white).opacity(0.85))
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
        .vmSheetChrome(title: "Photos", onClose: onClose)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
    }
}

// Camera —— 取景器占位(模拟器无相机)
struct CameraSheet: View {
    var onClose: () -> Void
    var body: some View {
        VStack(spacing: 0) {
            RoundedRectangle(cornerRadius: VM.radius.card, style: .continuous)
                .fill(Color.black.opacity(0.85))
                .overlay(
                    VStack(spacing: 10) {
                        VMIcon(name: "camera", size: 40, color: .white).opacity(0.8)
                        Text("Camera isn't available in the Simulator")
                            .font(.vm.footnote).foregroundStyle(.white.opacity(0.7))
                    }
                )
                .padding(.horizontal, 20)
                .padding(.top, 8)
            // 快门
            Circle().stroke(Color.vm.label.opacity(0.6), lineWidth: 3)
                .frame(width: 66, height: 66)
                .overlay(Circle().fill(Color.vm.label).frame(width: 52, height: 52))
                .padding(.vertical, 22)
        }
        .vmSheetChrome(title: "Camera", onClose: onClose)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
    }
}

// 连接器行:未连 → 灰色 "Connect"(与名字同字号);已连 → 右箭头(更多操作)
private struct ConnectorRow: View {
    let c: Connector
    var body: some View {
        HStack(spacing: 12) {
            VMImage(name: c.icon, size: 28)
            Text(c.name).font(.vm.body).foregroundStyle(Color.vm.label)
            Spacer()
            if c.connected {
                VMIcon(name: "chevron-right", size: 16, color: .vm.labelTertiary)
            } else {
                Text("Connect").font(.vm.body).foregroundStyle(Color.vm.labelSecondary)
            }
        }
        .frame(height: 44)
        .contentShape(Rectangle())
    }
}

// Connectors —— 原生 group(insetGrouped):Add connectors 一组 + 推荐 integrations 一组
struct ConnectorsSheet: View {
    var onClose: () -> Void
    @State private var showAll = false

    var body: some View {
        List {
            Section {
                Button { showAll = true } label: {
                    HStack(spacing: 12) {
                        VMIcon(name: "plus", size: 22, color: .vm.label)
                            .frame(width: 28, height: 28)
                        Text("Add connectors").font(.vm.body).foregroundStyle(Color.vm.label)
                        Spacer()
                        VMIcon(name: "chevron-right", size: 16, color: .vm.labelTertiary)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .listRowBackground(Color.vm.bgElevated)
            }

            Section {
                ForEach(Connector.samples) { c in
                    Button { onClose() } label: { ConnectorRow(c: c) }
                        .buttonStyle(.plain)
                        .listRowBackground(Color.vm.bgElevated)
                }
            } header: {
                Text("Recommended").font(.vm.footnote).foregroundStyle(Color.vm.labelSecondary)
            }
        }
        .listStyle(.insetGrouped)
        .scrollContentBackground(.hidden)
        .vmSheetChrome(title: "Connectors", onClose: onClose)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
        .sheet(isPresented: $showAll) { AllConnectorsSheet(onClose: { showAll = false }) }
    }
}

// Add connectors —— 全部集成(已连接的标记 Connected,其余 Add)
struct AllConnectorsSheet: View {
    var onClose: () -> Void
    @State private var query = ""

    private var filtered: [Connector] {
        query.isEmpty ? Connector.samples
            : Connector.samples.filter { $0.name.localizedCaseInsensitiveContains(query) }
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 8) {
                VMIcon(name: "search", size: 16, color: .vm.labelTertiary)
                TextField("Search integrations", text: $query)
                    .font(.vm.subhead).foregroundStyle(Color.vm.label).tint(Color.vm.tint)
            }
            .padding(.horizontal, 12).frame(height: 38)
            .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.md, style: .continuous))
            .padding(.horizontal, 20).padding(.top, 8).padding(.bottom, 8)

            List {
                Section {
                    ForEach(filtered) { c in
                        Button { onClose() } label: { ConnectorRow(c: c) }
                            .buttonStyle(.plain)
                            .listRowBackground(Color.vm.bgElevated)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .scrollContentBackground(.hidden)
        }
        .vmSheetChrome(title: "Add connectors", onClose: onClose)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
    }
}
