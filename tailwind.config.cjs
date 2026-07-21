/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        paper: '#ffffff',
        rule: '#d8dee8',
        signal: '#0f766e',
        caution: '#b45309',
        quiet: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'Noto Sans CJK SC', 'system-ui', 'sans-serif'],
        data: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        line: '0 1px 0 rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
