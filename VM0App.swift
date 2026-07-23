import SwiftUI
import UIKit

@main
struct VM0App: App {
    init() { VMSearchBarStyle.apply() }   // 把系统搜索栏的图标换成我们的 Tabler

    var body: some Scene {
        WindowGroup {
            ChatView()
        }
    }
}

// 原生 .searchable 底层是 UISearchBar —— 用 appearance 把它的清除(X)和放大镜
// 换成我们的 Tabler 图标(保留原生搜索组件,只改图标,符合"用我们的 icon"的规矩)。
enum VMSearchBarStyle {
    static func apply() {
        let bar = UISearchBar.appearance()
        if let clear = tabler("x", pt: 17) {
            bar.setImage(clear, for: .clear, state: .normal)
        }
        if let search = tabler("search", pt: 18) {
            bar.setImage(search, for: .search, state: .normal)
        }
    }

    // bundle PNG → 缩到指定点数的 template UIImage(跟随搜索栏自身 tint)
    private static func tabler(_ name: String, pt: CGFloat) -> UIImage? {
        guard let path = Bundle.main.path(forResource: name, ofType: "png"),
              let ui = UIImage(contentsOfFile: path) else { return nil }
        let size = CGSize(width: pt, height: pt)
        let img = UIGraphicsImageRenderer(size: size).image { _ in
            ui.draw(in: CGRect(origin: .zero, size: size))
        }
        return img.withRenderingMode(.alwaysTemplate)
    }
}
