/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'SF Pro Display'",
          'system-ui',
          'sans-serif',
        ],
        body: ['-apple-system', 'BlinkMacSystemFont', "'SF Pro Text'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        accent: 'var(--accent)',
      },
      fontSize: {
        logo: ['22px', '1'],
      },
      borderRadius: {
        DEFAULT: '8px',
        tag: '4px',
        full: '100px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
