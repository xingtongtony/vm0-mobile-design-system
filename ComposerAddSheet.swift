import SwiftUI
import UniformTypeIdentifiers

// composer + 的原生 bottom sheet —— Options 头(标题 + 关闭) + Image/Camera/File/Connectors 四卡。
// 点每张卡各自弹一个子 sheet(File 走原生 fileImporter)。全部 SwiftUI 原生组件。
struct ComposerAddSheet: View {
    var onClose: () -> Void

    private enum Sub: String, Identifiable { case image, camera, connectors; var id: String { rawValue } }
    @State private var sub: Sub?
    @State private var showFileImporter = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // 头:标题 + 关闭
            HStack {
                Text("Options").font(.vm.title2).foregroundStyle(Color.vm.label)
                Spacer()
                Button { onClose() } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Color.vm.labelSecondary)
                        .frame(width: 30, height: 30)
                        .background(Color.vm.fill3, in: Circle())
                }
                .buttonStyle(.plain)
            }

            // 四张小卡
            HStack(spacing: 10) {
                card("photo", "Image") { sub = .image }
                card("camera", "Camera") { sub = .camera }
                card("file-plus", "File") { showFileImporter = true }
                card("plug", "Connectors") { sub = .connectors }
            }

            Text("3 uploads remaining today")
                .font(.vm.footnote)
                .foregroundStyle(Color.vm.labelSecondary)
        }
        .padding(.horizontal, 20)
        .padding(.top, 18)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .presentationDetents([.height(240)])
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

// 子 sheet 通用头
private struct SheetHeader: View {
    let title: String
    var onClose: () -> Void
    var body: some View {
        HStack {
            Text(title).font(.vm.title3).foregroundStyle(Color.vm.label)
            Spacer()
            Button { onClose() } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Color.vm.labelSecondary)
                    .frame(width: 30, height: 30)
                    .background(Color.vm.fill3, in: Circle())
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 20)
        .padding(.top, 18)
        .padding(.bottom, 12)
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
        VStack(spacing: 0) {
            SheetHeader(title: "Photos", onClose: onClose)
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
                .padding(.bottom, 24)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
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
            SheetHeader(title: "Camera", onClose: onClose)
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
            // 快门
            Circle().stroke(Color.vm.label.opacity(0.6), lineWidth: 3)
                .frame(width: 66, height: 66)
                .overlay(Circle().fill(Color.vm.label).frame(width: 52, height: 52))
                .padding(.vertical, 22)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
    }
}

// Connectors —— 搜索 + 集成列表(真图标)
struct ConnectorsSheet: View {
    var onClose: () -> Void
    @State private var query = ""

    private var filtered: [Connector] {
        query.isEmpty ? Connector.samples
            : Connector.samples.filter { $0.name.localizedCaseInsensitiveContains(query) }
    }

    var body: some View {
        VStack(spacing: 0) {
            SheetHeader(title: "Connectors", onClose: onClose)
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass").font(.system(size: 14)).foregroundStyle(Color.vm.labelTertiary)
                TextField("Search connectors", text: $query)
                    .font(.vm.subhead).foregroundStyle(Color.vm.label).tint(Color.vm.tint)
            }
            .padding(.horizontal, 12).frame(height: 38)
            .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.md, style: .continuous))
            .padding(.horizontal, 20)
            .padding(.bottom, 8)

            ScrollView {
                VStack(spacing: 0) {
                    ForEach(filtered) { c in
                        Button { onClose() } label: {
                            HStack(spacing: 12) {
                                VMImage(name: c.icon, size: 28)
                                Text(c.name).font(.vm.body).foregroundStyle(Color.vm.label)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundStyle(Color.vm.labelTertiary)
                            }
                            .padding(.horizontal, 20).frame(height: 52)
                            .contentShape(Rectangle())
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.bottom, 24)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationBackground(.ultraThinMaterial)
    }
}
