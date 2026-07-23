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

// Connector —— vm0 集成(图标 = 从 static.vm0.io 拉下的品牌 SVG 渲成的 connector-<id>.png)。
// connected = 是否已连接(已连接的显示在对话框的叠加头像里,并在列表中标记)。
struct Connector: Identifiable, Hashable {
    let id: String
    var name: String
    var icon: String
    var connected: Bool = false

    static let samples: [Connector] = [
        .init(id: "github", name: "GitHub", icon: "connector-github", connected: true),
        .init(id: "gmail", name: "Gmail", icon: "connector-gmail", connected: true),
        .init(id: "google-drive", name: "Google Drive", icon: "connector-google-drive", connected: true),
        .init(id: "notion", name: "Notion", icon: "connector-notion"),
        .init(id: "linear", name: "Linear", icon: "connector-linear"),
        .init(id: "figma", name: "Figma", icon: "connector-figma"),
        .init(id: "discord", name: "Discord", icon: "connector-discord"),
        .init(id: "asana", name: "Asana", icon: "connector-asana"),
        .init(id: "airtable", name: "Airtable", icon: "connector-airtable"),
        .init(id: "hubspot", name: "HubSpot", icon: "connector-hubspot"),
        .init(id: "stripe", name: "Stripe", icon: "connector-stripe"),
        .init(id: "jira", name: "Jira", icon: "connector-jira"),
        .init(id: "gitlab", name: "GitLab", icon: "connector-gitlab"),
    ]

    static var connected: [Connector] { samples.filter { $0.connected } }
}

// Workflow —— vm0 的可复用 SOP(对应 web 的 Workflows 页面)。POC 假数据。
struct Workflow: Identifiable, Hashable {
    let id = UUID()
    var name: String
    var trigger: String        // "Manual" / "Automated"
    var isPublic: Bool
    var agentAvatar: String    // 负责的 agent 头像

    static let samples: [Workflow] = [
        .init(name: "Ad Campaign", trigger: "Manual", isPublic: true, agentAvatar: "ada-avatar"),
        .init(name: "Anthropic Design", trigger: "Manual", isPublic: true, agentAvatar: "lucas-avatar"),
        .init(name: "axiom-red", trigger: "Manual", isPublic: true, agentAvatar: "zero-avatar"),
        .init(name: "Connector Create", trigger: "Manual", isPublic: true, agentAvatar: "zero-avatar"),
        .init(name: "Course Inbound Poller", trigger: "Manual", isPublic: true, agentAvatar: "zero-avatar"),
        .init(name: "Daily Standup Report", trigger: "Manual", isPublic: true, agentAvatar: "zero-avatar"),
        .init(name: "Draw vm0 Cover", trigger: "Manual", isPublic: true, agentAvatar: "lucas-avatar"),
        .init(name: "Editorial Illustration", trigger: "Manual", isPublic: true, agentAvatar: "lucas-avatar"),
        .init(name: "Flaky Test", trigger: "Manual", isPublic: true, agentAvatar: "zero-avatar"),
        .init(name: "folk-storybook", trigger: "Manual", isPublic: true, agentAvatar: "lucas-avatar"),
    ]
}

// Model —— 模型切换(图标 = vm0 provider 图标 model-<provider>.png,名称用真实模型名)。
struct Model: Identifiable, Hashable {
    let id: String
    var name: String
    var icon: String

    static let samples: [Model] = [
        .init(id: "opus",     name: "Claude Opus 4.8",   icon: "model-anthropic"),
        .init(id: "sonnet",   name: "Claude Sonnet 4.5", icon: "model-anthropic"),
        .init(id: "gpt5",     name: "GPT-5",             icon: "model-openai"),
        .init(id: "deepseek", name: "DeepSeek V3",       icon: "model-deepseek"),
        .init(id: "kimi",     name: "Kimi K2",           icon: "model-kimi"),
    ]
    static let defaultID = "opus"
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
