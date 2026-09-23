import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable (see src/index.css) so the whole site flips
// between light and dark by toggling the `dark` class on <html>.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: token('canvas'), 2: token('canvas-2') },
        surface: { DEFAULT: token('surface'), 2: token('surface-2') },
        fg: { DEFAULT: token('fg'), muted: token('fg-muted'), subtle: token('fg-subtle') },
        brand: { DEFAULT: token('brand'), solid: token('brand-solid'), hi: token('brand-hi') },
        'on-brand': token('on-brand'),
        line: token('line'),
        ok: token('ok'),
        warn: token('warn'),
        risk: token('risk'),
        neutral: token('neutral'),
        // The control-plane panel stays dark in both themes.
        night: { DEFAULT: '#05061A', 2: '#0B0D2A', line: '#23265A' },
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        card: '20px',
        panel: '32px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgb(var(--line) / 0.06), 0 12px 40px -18px rgb(var(--shadow) / 0.35)',
        lift: '0 30px 80px -30px rgb(var(--shadow) / 0.55)',
        glow: '0 0 0 1px rgb(var(--brand) / 0.3), 0 10px 40px -8px rgb(var(--brand) / 0.55)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: { from: { transform: 'translateX(-120%) skewX(-20deg)' }, to: { transform: 'translateX(220%) skewX(-20deg)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        scan: { '0%': { top: '0%' }, '100%': { top: '100%' } },
        eq: { '0%, 100%': { transform: 'scaleY(0.3)' }, '50%': { transform: 'scaleY(1)' } },
        'ring-soft': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.08, 1.25)', opacity: '0' },
        },
        'flow-dot': {
          '0%': { top: '-4px', opacity: '0' },
          '20%, 80%': { opacity: '1' },
          '100%': { top: 'calc(100% - 4px)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.2, 0.6, 0.35, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 3.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        scan: 'scan 2.4s ease-in-out infinite alternate',
        eq: 'eq 0.9s ease-in-out infinite',
        'flow-dot': 'flow-dot 1.2s linear infinite',
        'ring-soft': 'ring-soft 2.4s cubic-bezier(0.2, 0.6, 0.35, 1) infinite',
      },
    },
  },
  plugins: [
    // `short:` targets phones held sideways: wide enough for tablet layouts but
    // very short. A plugin variant (not a `screens` entry) keeps `min-[…]:` working.
    plugin(({ addVariant }) => {
      addVariant('short', '@media (max-height: 520px) and (orientation: landscape)');
    }),
  ],
};
