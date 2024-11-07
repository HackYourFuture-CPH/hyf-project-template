/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': {
          light: '#A5B4FC', // Light shade of blue
          DEFAULT: '#6366F1', // Default blue
          dark: '#4338CA', // Darker shade of blue
        },
        'primary-purple': {
          light: '#C4B5FD', // Light shade of purple
          DEFAULT: '#8B5CF6', // Default purple
          dark: '#6D28D9', // Darker shade of purple
        },
        accent: {
          light: '#818CF8', // Light accent color
          DEFAULT: '#4F46E5', // Main accent color
          dark: '#3730A3', // Darker accent
        },
        neutral: {
          light: '#E0E7FF', // Light neutral
          DEFAULT: '#CBD5E1', // Main neutral (grayish)
          dark: '#94A3B8', // Darker neutral
        },
      },
    },
  },
  plugins: [],
};
