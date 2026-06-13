/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#ECEADF',
        surface: '#FFFFFF',
        accent:  '#C8E83A',
        'accent-soft': '#EEF7C0',
        ink:     '#1A1A18',
        muted:   '#6B6865',
        border:  '#E0DDD4',
        // keep team/area identifiers — used only as dots/small indicators
        'team-0': '#F97316',
        'team-1': '#06B6D4',
        'team-2': '#22C55E',
        'team-3': '#EC4899',
        'team-4': '#A855F7',
        'team-5': '#EAB308',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        'card-hover': '0 6px 20px rgba(0,0,0,0.09)',
        'btn': '0 1px 3px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
