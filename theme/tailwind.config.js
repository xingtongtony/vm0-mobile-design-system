/** VM0 Mobile — NativeWind / Tailwind 配置(语义 token → CSS 变量,自动跟随明暗)
 *  用法示例:className="bg-bg text-label rounded-md px-4"
 *  间距用 Tailwind 默认 4px 阶(0.5=2 / 1=4 / 2=8 / 3=12 / 4=16 / 5=20 / 6=24 / 8=32 / 10=40 / 12=48)——正好等于 VM0 8pt 栅格,无需自定义。 */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class', // 也支持系统偏好;手动切换给根节点加 .dark
  theme: {
    extend: {
      colors: {
        tint: 'var(--tint)', 'tint-pressed': 'var(--tint-pressed)', 'tint-subtle': 'var(--tint-subtle)', 'on-tint': 'var(--on-tint)',
        bg: 'var(--bg)', 'bg-elevated': 'var(--bg-elevated)', 'bg-grouped': 'var(--bg-grouped)', 'bg-secondary': 'var(--bg-secondary)', 'bg-tertiary': 'var(--bg-tertiary)',
        label: 'var(--label)', 'label-secondary': 'var(--label-secondary)', 'label-tertiary': 'var(--label-tertiary)', 'label-quaternary': 'var(--label-quaternary)',
        'fill-1': 'var(--fill-1)', 'fill-2': 'var(--fill-2)', 'fill-3': 'var(--fill-3)', 'fill-4': 'var(--fill-4)',
        separator: 'var(--separator)', 'separator-hairline': 'var(--separator-hairline)',
        success: 'var(--success)', destructive: 'var(--destructive)', done: 'var(--done)', link: 'var(--link)', warning: 'var(--warning)',
        'subtle-success': 'var(--subtle-success)', 'subtle-destructive': 'var(--subtle-destructive)', 'subtle-done': 'var(--subtle-done)', 'subtle-warning': 'var(--subtle-warning)', 'subtle-link': 'var(--subtle-link)',
      },
      fontFamily: { sans: ['Noto Sans'], 'sans-cjk': ['Noto Sans SC'], mono: ['JetBrains Mono'] },
      // [fontSize, lineHeight] —— Apple ramp
      fontSize: {
        'large-title': ['34px', '41px'], title1: ['28px', '34px'], title2: ['22px', '28px'], title3: ['20px', '25px'],
        headline: ['17px', '22px'], body: ['17px', '22px'], callout: ['16px', '21px'], subhead: ['15px', '20px'],
        footnote: ['13px', '18px'], caption1: ['12px', '16px'], caption2: ['11px', '13px'], mono: ['14px', '20px'],
      },
      borderRadius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', card: '16px', xl: '20px', full: '999px' },
    },
  },
  plugins: [],
}
