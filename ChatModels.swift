import Foundation

// Agent —— 顶栏 pill 的切换目标。avatar = bundle 里的 png 名(Zero 用官方 zero-avatar);
// 其它 agent 暂无头像资源,AgentAvatar 回退成首字母圆片。
struct Agent: Identifiable, Hashable {
    let id: String
    var name: String
    var avatar: String
    var initial: String

    static let zero = Agent(id: "zero", name: "Zero", avatar: "zero-avatar", initial: "Z")
    static let samples: [Agent] = [
        zero,
        Agent(id: "ada", name: "Ada", avatar: "ada-avatar", initial: "A"),
        Agent(id: "lucas", name: "Lucas", avatar: "lucas-avatar", initial: "L"),
    ]
}

// 聊天消息(POC 假数据)。role 决定渲染:user = 气泡靠右,assistant = 头像 + 平铺正文。
struct ChatMessage: Identifiable {
    enum Role { case user, assistant }
    let id = UUID()
    var role: Role
    var text: String
    var groupStart: Bool = true       // assistant:该消息是否是一组的开头(显示 Zero 头像)
    var chips: [String] = []          // 产出物 code chip
    var running: Bool = false         // 正在执行(显示 running 行)
    var delivered: String? = nil      // 交付时间脚注

    // 一条已有内容的对话
    static let sampleThread: [ChatMessage] = [
        ChatMessage(role: .user, text: "这个 workspace 的 bug 帮我看下"),
        ChatMessage(role: .assistant, text: "好的,我先检查一下工作区状态。"),
        ChatMessage(role: .user, text: "继续"),
        ChatMessage(
            role: .assistant,
            text: "The workspace was wiped between turns — I re-cloned and re-applied the changes: the JSX edit and the CSS rule. Then regenerated firewalls and ran lint, type-check, and the affected tests.\n\nPushed to PR #11357.",
            chips: ["zero-stack-card", "mobile-stack-list.tsx"],
            delivered: "Delivered May 11, 10:26 AM"
        ),
    ]
}

// 对话线程(= 桌面端左栏一行)。thread 是容器;run 嵌在 thread 内部,不是独立列表。
// "正在跑" 只是 thread 上的一个状态(running),不拆成第二张列表。
struct ChatThread: Identifiable {
    let id = UUID()
    var emoji: String
    var title: String
    var snippet: String
    var running: Bool = false
    var pinned: Bool = false
    var updated: String

    static let samples: [ChatThread] = [
        ChatThread(emoji: "🐛", title: "Workspace bug triage", snippet: "Pushed to PR #11357", running: true, pinned: true, updated: "now"),
        ChatThread(emoji: "📥", title: "Summarize my inbox", snippet: "12 threads, 3 need a reply", pinned: true, updated: "9:02"),
        ChatThread(emoji: "🚀", title: "Release notes draft", snippet: "Drafted the v0.4 changelog", updated: "Yesterday"),
        ChatThread(emoji: "🔀", title: "Review PR #11342", snippet: "Left 4 comments", updated: "Yesterday"),
        ChatThread(emoji: "📊", title: "Weekly usage report", snippet: "Runs up 18% WoW", updated: "Mon"),
    ]
}
