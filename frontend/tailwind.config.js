/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#3b82f6',
        'brand-blue-h': '#2563eb',
        'gh-canvas': '#0d1117',
        'gh-default': '#161b22',
        'gh-subtle': '#21262d',
        'gh-border': '#30363d',
        'gh-border-h': '#444c56',
        'gh-text': '#c9d1d9',
        'gh-muted': '#8b949e',
        'gh-dim': '#6e7681',
        'gh-green': '#238636',
        'gh-green-h': '#2ea043',
        'gh-green-em': '#56d364',
      },
      borderRadius: {
        '2xl': '12px',
        'xl': '8px',
        'lg': '6px',
        'md': '4px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};
