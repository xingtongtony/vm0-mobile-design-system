import SwiftUI
import UIKit

// VM0 Mobile 设计 token(权威值 = main 分支 theme/theme.ts / tokens.json,Figma XweEZS9K34gTjIR87dTYCc 导出,2026-07-20)
// 明暗双模式:所有语义色用 UIColor dynamicProvider,跟随系统 colorScheme 自动切换。
// 用法:Color.vm.tint / Font.vm.body / VM.radius.card / VM.space.lg

// MARK: - Color

private func vmDynamic(light: UIColor, dark: UIColor) -> Color {
    Color(UIColor { trait in
        trait.userInterfaceStyle == .dark ? dark : light
    })
}

private extension UIColor {
    convenience init(hex: UInt32, alpha: CGFloat = 1) {
        self.init(
            red: CGFloat((hex >> 16) & 0xFF) / 255,
            green: CGFloat((hex >> 8) & 0xFF) / 255,
            blue: CGFloat(hex & 0xFF) / 255,
            alpha: alpha
        )
    }
}

enum VMColor {
    // brand tint
    static let tint         = vmDynamic(light: UIColor(hex: 0xED4E01), dark: UIColor(hex: 0xFF6321))
    static let tintPressed  = vmDynamic(light: UIColor(hex: 0xDE3F00), dark: UIColor(hex: 0xFF7A45))
    static let tintSubtle   = vmDynamic(light: UIColor(hex: 0xFDE7DF), dark: UIColor(hex: 0xFF6321, alpha: 0.16))
    static let onTint       = vmDynamic(light: .white, dark: .white)

    // backgrounds (Apple grouped model)
    static let bg           = vmDynamic(light: .white, dark: UIColor(hex: 0x0C0E12))
    static let bgElevated   = vmDynamic(light: .white, dark: UIColor(hex: 0x1A1E26))
    static let bgGrouped    = vmDynamic(light: UIColor(hex: 0xF3F5F8), dark: UIColor(hex: 0x0C0E12))
    static let bgSecondary  = vmDynamic(light: UIColor(hex: 0xF3F5F8), dark: UIColor(hex: 0x1A1E26))
    static let bgTertiary   = vmDynamic(light: .white, dark: UIColor(hex: 0x22262F))

    // labels (cool hue + opacity ladder)
    static let label            = vmDynamic(light: UIColor(hex: 0x14171D), dark: UIColor(hex: 0xF3F5F8))
    static let labelSecondary   = vmDynamic(light: UIColor(hex: 0x3C4351, alpha: 0.6), dark: UIColor(hex: 0xE7EBF5, alpha: 0.7))
    static let labelTertiary    = vmDynamic(light: UIColor(hex: 0x3C4351, alpha: 0.3), dark: UIColor(hex: 0xE7EBF5, alpha: 0.3))
    static let labelQuaternary  = vmDynamic(light: UIColor(hex: 0x3C4351, alpha: 0.18), dark: UIColor(hex: 0xE7EBF5, alpha: 0.16))

    // fills (semi-transparent, cool gray base)
    static let fill1 = vmDynamic(light: UIColor(hex: 0x788192, alpha: 0.2), dark: UIColor(hex: 0x788192, alpha: 0.36))
    static let fill2 = vmDynamic(light: UIColor(hex: 0x788192, alpha: 0.16), dark: UIColor(hex: 0x788192, alpha: 0.32))
    static let fill3 = vmDynamic(light: UIColor(hex: 0x788192, alpha: 0.12), dark: UIColor(hex: 0x788192, alpha: 0.24))
    static let fill4 = vmDynamic(light: UIColor(hex: 0x788192, alpha: 0.08), dark: UIColor(hex: 0x788192, alpha: 0.18))

    // separators
    static let separator         = vmDynamic(light: UIColor(hex: 0xC5CBD5), dark: UIColor(hex: 0x333944))
    static let separatorHairline = vmDynamic(light: UIColor(hex: 0x14171D, alpha: 0.12), dark: UIColor(hex: 0xE7EBF5, alpha: 0.17))

    // status
    static let success     = vmDynamic(light: UIColor(hex: 0x2A7A4B), dark: UIColor(hex: 0x34B368))
    static let destructive = vmDynamic(light: UIColor(hex: 0xEF4444), dark: UIColor(hex: 0xFF5C5C))
    static let done        = vmDynamic(light: UIColor(hex: 0x6A5ACD), dark: UIColor(hex: 0x9A8CF0))
    static let link        = vmDynamic(light: UIColor(hex: 0x2E6FC2), dark: UIColor(hex: 0x5B9BF0))
    static let warning     = vmDynamic(light: UIColor(hex: 0xB35A00), dark: UIColor(hex: 0xE8912E))

    // status subtle backgrounds (badges/alerts/toasts)
    static let subtleSuccess     = vmDynamic(light: UIColor(hex: 0xE4F1EA), dark: UIColor(hex: 0x34B368, alpha: 0.18))
    static let subtleDestructive = vmDynamic(light: UIColor(hex: 0xFDECEC), dark: UIColor(hex: 0xFF5C5C, alpha: 0.18))
    static let subtleDone        = vmDynamic(light: UIColor(hex: 0xECE9FA), dark: UIColor(hex: 0x9A8CF0, alpha: 0.18))
    static let subtleWarning     = vmDynamic(light: UIColor(hex: 0xFBEEDD), dark: UIColor(hex: 0xE8912E, alpha: 0.18))
    static let subtleLink        = vmDynamic(light: UIColor(hex: 0xE5EEF9), dark: UIColor(hex: 0x5B9BF0, alpha: 0.18))
}

extension Color {
    static let vm = VMColor.self
}

// MARK: - Typography

// Noto Sans 打进 bundle(ttf + Info.plist UIAppFonts)后自动生效;缺字体时回退系统字。
// CJK 由 iOS 字体级联处理(Noto Sans SC 可后续补充)。
enum VMFont {
    static let sansName = "NotoSans"
    static let monoName = "JetBrainsMono-Regular"

    static func sans(_ size: CGFloat, _ weight: Font.Weight) -> Font {
        if UIFont(name: sansName, size: size) != nil {
            return .custom(sansName, size: size).weight(weight)
        }
        return .system(size: size, weight: weight)
    }

    static func mono(_ size: CGFloat) -> Font {
        if UIFont(name: monoName, size: size) != nil {
            return .custom(monoName, size: size)
        }
        return .system(size: size, design: .monospaced)
    }

    // type ramp(Apple 字号阶梯,同 tokens.json "type")
    static let largeTitle = sans(34, .bold)
    static let title1     = sans(28, .bold)
    static let title2     = sans(22, .bold)
    static let title3     = sans(20, .semibold)
    static let headline   = sans(17, .semibold)
    static let body       = sans(17, .regular)
    static let callout    = sans(16, .regular)
    static let subhead    = sans(15, .regular)
    static let footnote   = sans(13, .regular)
    static let caption1   = sans(12, .regular)
    static let caption2   = sans(11, .regular)
    static let monoBody   = mono(14)
}

extension Font {
    static let vm = VMFont.self
}

// MARK: - Metrics

enum VM {
    enum radius {
        static let xs: CGFloat = 4, sm: CGFloat = 6, md: CGFloat = 8, lg: CGFloat = 12
        static let card: CGFloat = 16, xl: CGFloat = 20, full: CGFloat = 999
    }
    enum space {
        static let xxs: CGFloat = 2, xs: CGFloat = 4, sm: CGFloat = 8, md: CGFloat = 12
        static let lg: CGFloat = 16, xl: CGFloat = 20, xxl: CGFloat = 24, xxxl: CGFloat = 32
        static let huge: CGFloat = 40, giant: CGFloat = 48
    }
    enum rule {
        static let touchTargetMin: CGFloat = 44
        static let screenMargin: CGFloat = 16
        static let listRowMin: CGFloat = 44
    }
}
