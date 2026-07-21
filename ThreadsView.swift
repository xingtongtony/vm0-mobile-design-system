import SwiftUI

// 左侧 threads 抽屉 —— 照搬桌面模型:一列 chat threads,pin 置顶,每行 running 指示器,
// 右上 + 新建,底部账户行。用原生 List / searchable / swipeActions / NavigationStack,
// 仅做 token 的 font/color/icon 定制。
struct ThreadsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var threads = ChatThread.samples
    @State private var query = ""
    var onSelect: (ChatThread) -> Void
    var onNew: () -> Void

    private var filtered: [ChatThread] {
        query.isEmpty ? threads : threads.filter { $0.title.localizedCaseInsensitiveContains(query) }
    }
    private var pinned: [ChatThread] { filtered.filter { $0.pinned } }
    private var recent: [ChatThread] { filtered.filter { !$0.pinned } }

    var body: some View {
        NavigationStack {
            List {
                if !pinned.isEmpty {
                    Section("Pinned") { ForEach(pinned) { row($0) } }
                }
                Section("Recent") { ForEach(recent) { row($0) } }
            }
            .listStyle(.plain)
            .searchable(text: $query, prompt: "Search chats")
            .navigationTitle("Chats")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button { onNew(); dismiss() } label: {
                        VMIcon(name: "plus", size: 20, color: .vm.tint)
                    }
                }
            }
            .safeAreaInset(edge: .bottom) { accountRow }
        }
        .tint(Color.vm.tint)   // 原生控件选中/强调色 → VM0 橙(不是系统蓝)
    }

    private func row(_ t: ChatThread) -> some View {
        Button {
            onSelect(t); dismiss()
        } label: {
            HStack(spacing: 12) {
                Text(t.emoji)
                    .font(.system(size: 20))
                    .frame(width: 34, height: 34)
                    .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: 9, style: .continuous))
                VStack(alignment: .leading, spacing: 2) {
                    Text(t.title).font(.vm.headline).foregroundStyle(Color.vm.label).lineLimit(1)
                    Text(t.snippet).font(.vm.footnote).foregroundStyle(Color.vm.labelSecondary).lineLimit(1)
                }
                Spacer(minLength: 8)
                if t.running {
                    HStack(spacing: 6) {
                        RunningDot()
                        Text("Running").font(.vm.caption1).foregroundStyle(Color.vm.tint)
                    }
                } else {
                    Text(t.updated).font(.vm.caption1).foregroundStyle(Color.vm.labelTertiary)
                }
            }
            .padding(.vertical, 4)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .listRowSeparatorTint(Color.vm.separatorHairline)
        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
            Button(role: .destructive) { delete(t) } label: { Label("Delete", systemImage: "trash") }
            Button { togglePin(t) } label: {
                Label(t.pinned ? "Unpin" : "Pin", systemImage: t.pinned ? "pin.slash" : "pin")
            }
            .tint(Color.vm.tint)
        }
    }

    private var accountRow: some View {
        HStack(spacing: 12) {
            Circle().fill(Color.vm.tintSubtle).frame(width: 34, height: 34)
                .overlay(Text("T").font(.vm.headline).foregroundStyle(Color.vm.tint))
            VStack(alignment: .leading, spacing: 1) {
                Text("Tong Xing").font(.vm.subhead).foregroundStyle(Color.vm.label)
                Text("Settings").font(.vm.caption1).foregroundStyle(Color.vm.labelSecondary)
            }
            Spacer()
            Image(systemName: "gearshape")   // 占位:待换成 Tabler 齿轮图标
                .font(.system(size: 18))
                .foregroundStyle(Color.vm.labelTertiary)
        }
        .padding(.horizontal, 20).padding(.vertical, 12)
        .background(.thinMaterial)
    }

    private func delete(_ t: ChatThread) { threads.removeAll { $0.id == t.id } }
    private func togglePin(_ t: ChatThread) {
        if let i = threads.firstIndex(where: { $0.id == t.id }) { threads[i].pinned.toggle() }
    }
}
