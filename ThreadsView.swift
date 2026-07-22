import SwiftUI

// 左抽屉内容 —— 一列 chat threads(照桌面模型)。顶部图标用中性 label 色,
// 与聊天页顶栏图标同一变量(不是橙色)。原生 List / TextField / swipeActions。
struct ThreadsDrawer: View {
    @State private var threads = ChatThread.samples
    @State private var query = ""
    var onClose: () -> Void
    var onSelect: (ChatThread) -> Void
    var onNew: () -> Void

    private var filtered: [ChatThread] {
        query.isEmpty ? threads : threads.filter { $0.title.localizedCaseInsensitiveContains(query) }
    }
    private var pinned: [ChatThread] { filtered.filter { $0.pinned } }
    private var recent: [ChatThread] { filtered.filter { !$0.pinned } }

    var body: some View {
        VStack(spacing: 0) {
            header
            searchField
            List {
                if !pinned.isEmpty {
                    Section("Pinned") { ForEach(pinned) { row($0) } }
                }
                Section("Recent") { ForEach(recent) { row($0) } }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            accountRow
        }
    }

    // 顶部:三横线(关闭)· 标题 · 新建 —— 图标 = .vm.label(同聊天页顶栏)
    private var header: some View {
        HStack(spacing: 12) {
            Button { onClose() } label: { VMIcon(name: "menu", size: 20, color: .vm.label) }
                .buttonStyle(.plain)
            Text("Chats").font(.vm.title3).foregroundStyle(Color.vm.label)
            Spacer()
            Button { onNew() } label: { VMIcon(name: "plus", size: 20, color: .vm.label) }
                .buttonStyle(.plain)
        }
        .padding(.horizontal, 16)
        .padding(.top, 14)
        .padding(.bottom, 10)
    }

    private var searchField: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 14))
                .foregroundStyle(Color.vm.labelTertiary)
            TextField("Search chats", text: $query)
                .font(.vm.subhead)
                .foregroundStyle(Color.vm.label)
                .tint(Color.vm.tint)
        }
        .padding(.horizontal, 12)
        .frame(height: 38)
        .background(Color.vm.fill3, in: RoundedRectangle(cornerRadius: VM.radius.md, style: .continuous))
        .padding(.horizontal, 16)
        .padding(.bottom, 8)
    }

    private func row(_ t: ChatThread) -> some View {
        Button { onSelect(t) } label: {
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
        .listRowBackground(Color.clear)
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
            Image(systemName: "gearshape")
                .font(.system(size: 18))
                .foregroundStyle(Color.vm.labelTertiary)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .overlay(Rectangle().fill(Color.vm.separatorHairline).frame(height: 1), alignment: .top)
    }

    private func delete(_ t: ChatThread) { threads.removeAll { $0.id == t.id } }
    private func togglePin(_ t: ChatThread) {
        if let i = threads.firstIndex(where: { $0.id == t.id }) { threads[i].pinned.toggle() }
    }
}
