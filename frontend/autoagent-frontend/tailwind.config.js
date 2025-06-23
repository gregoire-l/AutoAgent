/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
      },
      colors: {
        // Status colors from prototype
        'status-confirmed': '#10B981',
        'status-discussion': '#F59E0B',
        'status-suggestion': '#3B82F6',
        'status-unaddressed': 'rgba(113, 113, 122, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
