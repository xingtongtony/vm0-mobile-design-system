// VM0 Mobile — 设计 token(权威值,从 Figma 文件 XweEZS9K34gTjIR87dTYCc 的变量导出)
// 单一真源:改设计 → 改 Figma 变量 → 重新导出这份文件。
// 生成时间:2026-07-20

export const colors = {
  light: {
    // brand tint
    tint: '#ed4e01', tintPressed: '#de3f00', tintSubtle: '#fde7df', onTint: '#ffffff',
    // backgrounds (Apple grouped model)
    bg: '#ffffff', bgElevated: '#ffffff', bgGrouped: '#f3f5f8', bgSecondary: '#f3f5f8', bgTertiary: '#ffffff',
    // labels (VM0 cool hue + Apple opacity ladder)
    label: '#14171d', labelSecondary: 'rgba(60, 67, 81, 0.6)', labelTertiary: 'rgba(60, 67, 81, 0.3)', labelQuaternary: 'rgba(60, 67, 81, 0.18)',
    // fills (semi-transparent, cool gray base)
    fill1: 'rgba(120, 129, 146, 0.2)', fill2: 'rgba(120, 129, 146, 0.16)', fill3: 'rgba(120, 129, 146, 0.12)', fill4: 'rgba(120, 129, 146, 0.08)',
    // separators
    separator: '#c5cbd5', separatorHairline: 'rgba(20, 23, 29, 0.12)',
    // status
    success: '#2a7a4b', destructive: '#ef4444', done: '#6a5acd', link: '#2e6fc2', warning: '#b35a00',
    // status subtle backgrounds (badges/alerts/toasts)
    subtleSuccess: '#e4f1ea', subtleDestructive: '#fdecec', subtleDone: '#ece9fa', subtleWarning: '#fbeedd', subtleLink: '#e5eef9',
  },
  dark: {
    tint: '#ff6321', tintPressed: '#ff7a45', tintSubtle: 'rgba(255, 99, 33, 0.16)', onTint: '#ffffff',
    bg: '#0c0e12', bgElevated: '#1a1e26', bgGrouped: '#0c0e12', bgSecondary: '#1a1e26', bgTertiary: '#22262f',
    label: '#f3f5f8', labelSecondary: 'rgba(231, 235, 245, 0.7)', labelTertiary: 'rgba(231, 235, 245, 0.3)', labelQuaternary: 'rgba(231, 235, 245, 0.16)',
    fill1: 'rgba(120, 129, 146, 0.36)', fill2: 'rgba(120, 129, 146, 0.32)', fill3: 'rgba(120, 129, 146, 0.24)', fill4: 'rgba(120, 129, 146, 0.18)',
    separator: '#333944', separatorHairline: 'rgba(231, 235, 245, 0.17)',
    success: '#34b368', destructive: '#ff5c5c', done: '#9a8cf0', link: '#5b9bf0', warning: '#e8912e',
    subtleSuccess: 'rgba(52, 179, 104, 0.18)', subtleDestructive: 'rgba(255, 92, 92, 0.18)', subtleDone: 'rgba(154, 140, 240, 0.18)', subtleWarning: 'rgba(232, 145, 46, 0.18)', subtleLink: 'rgba(91, 155, 240, 0.18)',
  },
} as const

// dataviz — 固定 HEX,不随主题反转
export const dataviz = {
  creditFree: '#3eb7b8', creditPromotional: '#e88033', creditPayg: '#97918a', creditPlanPro: '#edc43e', creditPlanTeam: '#6b8de3',
  usageModel: '#5e6ad2', usageImage: '#ec70a5', usageVideo: '#358a8e', usageConnector: '#98928b', usageOther: '#e1c43c',
  cardAccent: ['#d4956a', '#e24b6a', '#e1c43c', '#98928b', '#ec70a5', '#358a8e'],
  avatar: ['#ed4e01', '#e0b376', '#e26c9e', '#45a7a8', '#e0bb3c', '#ff990a'],
} as const

export const fonts = { sans: 'Noto Sans', sansCJK: 'Noto Sans SC', mono: 'JetBrains Mono' } as const
export const weight = { regular: '400', medium: '500', semibold: '600', bold: '700' } as const

// 排版 ramp(Apple 字号阶梯,默认 Large 档;用 allowFontScaling 接 Dynamic Type)
export const type = {
  largeTitle: { size: 34, line: 41, weight: weight.bold },
  title1: { size: 28, line: 34, weight: weight.bold },
  title2: { size: 22, line: 28, weight: weight.bold },
  title3: { size: 20, line: 25, weight: weight.semibold },
  headline: { size: 17, line: 22, weight: weight.semibold },
  body: { size: 17, line: 22, weight: weight.regular },
  callout: { size: 16, line: 21, weight: weight.regular },
  subhead: { size: 15, line: 20, weight: weight.regular },
  footnote: { size: 13, line: 18, weight: weight.regular },
  caption1: { size: 12, line: 16, weight: weight.regular },
  caption2: { size: 11, line: 13, weight: weight.regular },
  mono: { size: 14, line: 20, weight: weight.regular },
} as const

export const radius = { xs: 4, sm: 6, md: 8, lg: 12, card: 16, xl: 20, full: 999 } as const
export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40, giant: 48 } as const
export const rule = { touchTargetMin: 44, screenMargin: 16, listRowMin: 44 } as const

export const tokens = { colors, dataviz, fonts, weight, type, radius, space, rule } as const
export type Tokens = typeof tokens
export type ColorScheme = keyof typeof colors
export type TypeVariant = keyof typeof type
