/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lavender-blush': '#f5e6e8',
        'thistle': '#d5c6e0',
        'rose-quartz': '#aaa1c8',
        'mountbatten': '#967aa1',
        'space-cadet': '#192a51',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-custom': 'linear-gradient(135deg, #f5e6e8, #d5c6e0, #aaa1c8, #967aa1, #192a51)',
      },
    },
  },
  plugins: [],
} 