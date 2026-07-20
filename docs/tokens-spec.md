# VM0 Mobile Design System — v1 (VM0 × iOS/iPadOS)

> ⚠️ **权威值以 `../theme/` 为准(2026-07-20 从 Figma 变量导出:`tokens.json` / `theme.ts` / `tailwind.config.js`)。**
> 本文档是早期规划稿,少数值已和最终实现漂移,对照如下(以下均以 Figma/theme 为准):
> - `bg/base` light = **#FFFFFF**(非 #FAFBFC);dark = **#0C0E12**(非 #101319)
> - `bg/grouped` dark = **#0C0E12**(非 #0E1116)
> - labels secondary/tertiary/quaternary 用**透明度叠加**(如 `rgba(60,67,81,0.6)`),非实色
> - fills 透明度 = **0.20 / 0.16 / 0.12 / 0.08**(非 0.24/0.18/0.12/0.06)
> - `separator/opaque` light = **#C5CBD5**(非 #DCE1E8)
> - 排版:**title2 = 22/28**、**title3 = 20/25**、**body = 17/22**、callout = 16/21、caption2 = 11/13(采用 Apple 真实字号阶,非本文早期值)
> 其余(tint、status、radius、spacing、dataviz)与本文一致。以后请改 Figma 变量后重新导出 theme。

> Merge philosophy: **iOS = structure (semantic role taxonomy, type ramp roles, spacing rhythm,
> continuous corners, materials). VM0 = identity (brand tint, cool gray hue, VM0 status colors,
> Noto Sans).** Built for React Native + Apple native components.
>
> Decisions locked: font = **bundle Noto Sans** (+ Noto Sans SC), keep JetBrains Mono. Grays =
> **VM0 cool hue in Apple's role structure**. Status = **all VM0's own**, light+dark authored here.

---

## Token architecture (3 tiers)

```
1. Primitives   VM0 primary/gray scales · VM0 status hex · dataviz hex        (raw, never used directly in UI)
2. Semantic     tint · label(1-4) · bg(base/elevated/grouped) · fill(1-4)      (what components read; light + dark)
                · separator · status(success/destructive/done/link/warning)
3. Component     RN/native props: tintColor, text style, radius, material      (maps semantic → native)
```

---

## 1. COLOR

### 1.1 Brand tint (the single brand-injection point → replaces systemBlue)

| Role | Light | Dark | Notes |
|---|---|---|---|
| tint | `#ED4E01` (primary-700) | `#FF6321` (brightened) | buttons, links, switch-on, selection, active |
| tint-pressed | `#DE3F00` (primary-800) | `#FF7A45` | pressed/hover |
| tint-subtle-bg | `#FDE7DF` (primary-100) | `rgba(255,99,33,0.16)` | tinted chips, selected rows |
| on-tint | `#FFFFFF` | `#FFFFFF` | text/icon on tint fill |

> Dark tint is brightened because pure `#ED4E01` vibrates on dark backgrounds (Apple brightens tints in dark too).

### 1.2 Neutrals — VM0 cool gray hue, restructured into Apple's layering roles

**Backgrounds** (Apple grouped model: gray screen, white cells)
| Role | Light | Dark |
|---|---|---|
| bg/base (screen) | `#FAFBFC` (gray-0) | `#101319` |
| bg/elevated (card, sheet, cell) | `#FFFFFF` | `#1A1E26` (gray-900) |
| bg/grouped (grouped-list screen) | `#F3F5F8` (gray-50) | `#0E1116` |
| bg/tertiary (nested) | `#F3F5F8` | `#22262F` |

**Labels** (text — 4 levels, VM0 foreground → opacity ladder)
| Role | Light | Dark |
|---|---|---|
| label/primary | `#14171D` (gray-950) | `#F3F5F8` (gray-50) |
| label/secondary | `#525B68` (gray-800) | `#B2BAC8` (gray-500) |
| label/tertiary | `#788192` (gray-700) | `#788192` (gray-700) |
| label/quaternary | `#9BA3B3` (gray-600) | `#525B68` (gray-800) |

**Fills** (semi-transparent — sit over content/photos, this is what makes iOS layering work)
Base color = cool gray `#788192`. Light: opacity 0.24 / 0.18 / 0.12 / 0.06 (fill 1→4). Dark: base `#C5CCD7`, opacity 0.16 / 0.12 / 0.08 / 0.05.

**Separators**
| Role | Light | Dark |
|---|---|---|
| separator/opaque | `#DCE1E8` (gray-200) | `#2A2F39` |
| separator/hairline (over content) | `rgba(82,91,104,0.28)` | `rgba(210,215,224,0.16)` |

### 1.3 Status — all VM0 (light + dark authored)

| Role | Light | Dark | Subtle bg (light / dark) |
|---|---|---|---|
| success | `#2A7A4B` | `#34B368` | `#E4F1EA` / `rgba(52,179,104,.18)` |
| destructive | `#EF4444` | `#FF5C5C` | `#FDECEC` / `rgba(255,92,92,.18)` |
| done | `#6A5ACD` | `#9A8CF0` | `#ECE9FA` / `rgba(154,140,240,.18)` |
| link | `#2E6FC2` | `#5B9BF0` | `#E5EEF9` / `rgba(91,155,240,.18)` |
| warning | `#B35A00` | `#E8912E` | `#FBEEDD` / `rgba(232,145,46,.18)` |

> Dark values are brightened for contrast on dark surfaces. Subtle-bg = for badges/alerts/toasts.

### 1.4 Data-viz — VM0, unchanged, fixed HEX (do NOT invert per theme)

- **Credit:** free `#3EB7B8` · promotional `#E88033` · pay-as-you-go `#97918A` · plan-pro `#EDC43E` · plan-team `#6B8DE3`
- **Usage kind:** model `#5E6AD2` · image `#EC70A5` · video `#358A8E` · connector `#98928B` · other `#E1C43C`
- **Card accent:** `#D4956A` `#E24B6A` `#E1C43C` `#98928B` `#EC70A5` `#358A8E`
- **Avatar:** `#ED4E01` `#E0B376` `#E26C9E` `#45A7A8` `#E0BB3C` `#FF990A`

---

## 2. TYPOGRAPHY — Noto Sans (bundled), custom Dynamic Type ramp

Font families: `Noto Sans` (Latin) + `Noto Sans SC` (CJK auto-fallback) · code `JetBrains Mono`.
Weights bundled: 400 Regular · 500 Medium · 600 Semibold · 700 Bold.
Since we're NOT on SF Pro, Dynamic Type is hand-rolled: sizes below are the **default (Large) scale**; multiply by `PixelRatio.getFontScale()` (RN `allowFontScaling`) and clamp to ~0.85–1.35×.

| Style | size / line-height | weight | Apple role equiv |
|---|---|---|---|
| largeTitle | 34 / 41 | 700 | Large Title |
| title1 | 28 / 34 | 700 | Title 1 |
| title2 | 24 / 30 | 600 | Title 2 |
| title3 | 20 / 26 | 600 | Title 3 |
| headline | 17 / 22 | 600 | Headline |
| **body** | **17 / 24** | 400 | Body ← bumped from web's 16 |
| callout | 16 / 22 | 400 | Callout |
| subhead | 15 / 20 | 400 | Subheadline |
| footnote | 13 / 18 | 400 | Footnote |
| caption1 | 12 / 16 | 400 | Caption 1 |
| caption2 | 11 / 14 | 400 | Caption 2 |
| mono | 14 / 20 | 400 (JetBrains Mono) | code / values |

---

## 3. RADIUS — VM0 values, rendered with continuous curve

`borderCurve: 'continuous'` on EVERYTHING (the squircle is a key native tell).

| Token | value | use |
|---|---|---|
| radius/xs | 4 | tags, small chips |
| radius/sm | 6 | inputs, small controls |
| radius/md | 8 | buttons (default), controls |
| radius/lg | 12 | menus, popovers |
| radius/card | 16 | cards, sheets (VM0 zero-card) |
| radius/xl | 20 | large sheets / hero |
| radius/full | 999 | capsule buttons, pills, avatars |

> iOS 26/27 trend: primary/prominent buttons lean capsule (`radius/full`). Pick per component.

---

## 4. SPACING — 8pt grid (+4pt half-step), Apple hard rules

Scale: `2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48`
Non-negotiable native rules:
- **Screen edge margin = 16**
- **Minimum touch target = 44 × 44**
- **List row min height = 44**
- Section gap = 24–32

---

## 5. ELEVATION / MATERIAL — iOS-native, not web shadows

- **Chrome** (nav bar, tab bar, sheet, popover, menu) → **native material blur** (regular/thick), NOT drop shadow. RN: `expo-blur` / native `UIBlurEffect`.
- **Content card, light** → VM0 subtle shadow `0 2px 12px rgba(120,129,146,0.06)` + 0.5px hairline separator.
- **Content card, dark** → no shadow; use `bg/elevated` lift + hairline separator.
- **Hairline** = 0.5px (retina) separator color.

---

## 6. RN theme starter (TypeScript)

```ts
export const tokens = {
  color: {
    light: {
      tint: '#ED4E01', tintPressed: '#DE3F00', tintSubtle: '#FDE7DF', onTint: '#FFFFFF',
      bg: '#FAFBFC', bgElevated: '#FFFFFF', bgGrouped: '#F3F5F8',
      label: '#14171D', labelSecondary: '#525B68', labelTertiary: '#788192', labelQuaternary: '#9BA3B3',
      fill1: 'rgba(120,129,146,0.24)', fill2: 'rgba(120,129,146,0.18)',
      fill3: 'rgba(120,129,146,0.12)', fill4: 'rgba(120,129,146,0.06)',
      separator: '#DCE1E8', separatorHairline: 'rgba(82,91,104,0.28)',
      success: '#2A7A4B', destructive: '#EF4444', done: '#6A5ACD', link: '#2E6FC2', warning: '#B35A00',
    },
    dark: {
      tint: '#FF6321', tintPressed: '#FF7A45', tintSubtle: 'rgba(255,99,33,0.16)', onTint: '#FFFFFF',
      bg: '#101319', bgElevated: '#1A1E26', bgGrouped: '#0E1116',
      label: '#F3F5F8', labelSecondary: '#B2BAC8', labelTertiary: '#788192', labelQuaternary: '#525B68',
      fill1: 'rgba(197,204,215,0.16)', fill2: 'rgba(197,204,215,0.12)',
      fill3: 'rgba(197,204,215,0.08)', fill4: 'rgba(197,204,215,0.05)',
      separator: '#2A2F39', separatorHairline: 'rgba(210,215,224,0.16)',
      success: '#34B368', destructive: '#FF5C5C', done: '#9A8CF0', link: '#5B9BF0', warning: '#E8912E',
    },
  },
  font: { sans: 'Noto Sans', sansCJK: 'Noto Sans SC', mono: 'JetBrains Mono' },
  type: {
    largeTitle: { size: 34, line: 41, weight: '700' }, title1: { size: 28, line: 34, weight: '700' },
    title2: { size: 24, line: 30, weight: '600' }, title3: { size: 20, line: 26, weight: '600' },
    headline: { size: 17, line: 22, weight: '600' }, body: { size: 17, line: 24, weight: '400' },
    callout: { size: 16, line: 22, weight: '400' }, subhead: { size: 15, line: 20, weight: '400' },
    footnote: { size: 13, line: 18, weight: '400' }, caption1: { size: 12, line: 16, weight: '400' },
    caption2: { size: 11, line: 14, weight: '400' }, mono: { size: 14, line: 20, weight: '400' },
  },
  radius: { xs: 4, sm: 6, md: 8, lg: 12, card: 16, xl: 20, full: 999 },
  space: { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40, giant: 48 },
} as const
```

---

## Open items (need a value / decision)

1. **success/done exact hex** — captured `#2A7A4B` / `#6A5ACD` from the site, but confirm these are the canonical UI values (site green was the md-tag green, may differ from a UI success fill).
2. **Dark palette** authored here from Apple's elevation model — needs a design review pass on real screens.
3. iPad multi-column layout, adaptive breakpoints — deferred (phase 2).
