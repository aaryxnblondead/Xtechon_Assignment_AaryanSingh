import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#b3d4ff',
          300: '#84b8ff',
          400: '#5494ff',
          500: '#2f73ff',
          600: '#1f57db',
          700: '#1a44b1',
          800: '#183c8f',
          900: '#173573',
        },
        accent: '#ff6b6b',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.06)',
        card: '0 8px 30px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}
export default config
