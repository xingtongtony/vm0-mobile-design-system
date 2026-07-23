import SwiftUI

// Chats 整页 —— 由聊天页左上角按钮从左侧滑入(全屏覆盖,自带 NavigationStack)。
// 全原生:List(insetGrouped) + .searchable(iOS 26 底部搜索) + 系统导航栏(标题走 Noto Sans);
// header 右侧是返回按钮(chevron-left)。选中一条 → 载入并关闭回聊天。
struct ChatsPage: View {
    @State private var threads = ChatThread.samples
    @State private var query = ""
    var onSelect: (ChatThread) -> Void
    var onClose: () -> Void

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
            .listStyle(.insetGrouped)
            .scrollContentBackground(.hidden)
            .background(Color.vm.bgGrouped.ignoresSafeArea())
            .searchable(text: $query, prompt: "Search chats")
            .tint(Color.vm.tint)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Chats").font(.vm.headline).foregroundStyle(Color.vm.label)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button { onClose() } label: {
                        VMIcon(name: "chevron-left", size: 18, color: .vm.label)   // 右上返回
                    }
                }
            }
            .safeAreaInset(edge: .bottom) { accountRow }
        }
        .background(Color.vm.bg.ignoresSafeArea())   // 不透明底,整页覆盖聊天
    }

    private func row(_ t: ChatThread) -> some View {
        Button {
            onSelect(t)
            onClose()
        } label: {
            HStack(spacing: 12) {
                VMIcon(name: t.icon, size: 19, color: .vm.label)
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
            .frame(height: 48)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .listRowBackground(Color.vm.bgElevated)
        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
            Button(role: .destructive) { delete(t) } label: {
                Label { Text("Delete") } icon: { VMIcon(name: "trash", size: 18, color: .white) }
            }
            Button { togglePin(t) } label: {
                Label { Text(t.pinned ? "Unpin" : "Pin") } icon: {
                    VMIcon(name: t.pinned ? "pinned-off" : "pin", size: 18, color: .white)
                }
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
            VMIcon(name: "settings", size: 18, color: .vm.labelTertiary)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(.thinMaterial)
        .overlay(Rectangle().fill(Color.vm.separatorHairline).frame(height: 1), alignment: .top)
    }

    private func delete(_ t: ChatThread) { threads.removeAll { $0.id == t.id } }
    private func togglePin(_ t: ChatThread) {
        if let i = threads.firstIndex(where: { $0.id == t.id }) { threads[i].pinned.toggle() }
    }
}
