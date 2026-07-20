/** VM0 Mobile — NativeWind / Tailwind 配置(语义 token → CSS 变量,自动跟随明暗)
 *  用法:className="bg-bg text-label rounded-md px-4"
 *  间距用 Tailwind 默认 4px 阶(0.5=2 / 1=4 / 2=8 / 3=12 / 4=16 / 5=20 / 6=24 / 8=32 / 10=40 / 12=48)= VM0 8pt 栅格 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
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
      fontFamily: {
        sans: ['Noto Sans'], 'sans-medium': ['Noto Sans Medium'], 'sans-semibold': ['Noto Sans SemiBold'], 'sans-bold': ['Noto Sans Bold'],
        'sans-cjk': ['Noto Sans SC'], 'sans-cjk-medium': ['Noto Sans SC Medium'], 'sans-cjk-bold': ['Noto Sans SC Bold'],
        mono: ['JetBrains Mono'], 'mono-medium': ['JetBrains Mono Medium'],
      },
      fontSize: {
        'large-title': ['34px', '41px'], title1: ['28px', '34px'], title2: ['22px', '28px'], title3: ['20px', '25px'],
        headline: ['17px', '22px'], body: ['17px', '22px'], callout: ['16px', '21px'], subhead: ['15px', '20px'],
        footnote: ['13px', '18px'], caption1: ['12px', '16px'], caption2: ['11px', '13px'], mono: ['14px', '20px'],
      },
      borderRadius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', card: '16px', xl: '20px', full: '999px' },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // 入场 stagger:fade-up-N = 延迟 N*80ms(web 展示动效;native 无副作用)
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-1': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s both',
        'fade-up-2': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.16s both',
        'fade-up-3': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.24s both',
        'fade-up-4': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.32s both',
        'fade-up-5': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both',
      },
    },
  },
  plugins: [],
};
