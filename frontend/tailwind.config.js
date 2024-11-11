/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": {
          light: "#A5B4FC", // Light shade of blue
          DEFAULT: "#6366F1", // Default blue
          dark: "#4338CA", // Darker shade of blue
        },
        "primary-purple": {
          light: "#C4B5FD", // Light shade of purple
          DEFAULT: "#8B5CF6", // Default purple
          dark: "#6D28D9", // Darker shade of purple
        },
        accent: {
          light: "#818CF8", // Light accent color
          DEFAULT: "#4F46E5", // Main accent color
          dark: "#3730A3", // Darker accent
        },
        neutral: {
          light: "#E0E7FF", // Light neutral
          DEFAULT: "#CBD5E1", // Main neutral (grayish)
          dark: "#94A3B8", // Darker neutral
        },
        primary: {
          50: "#E1E8EF",
          100: "#D4DEE7",
          200: "#afc5e7",
          300: "#99B0C7",
          400: "#7c9ccf",
          500: "#5478b3",
          600: "#4C6B8A",
          700: "#3C546C",
          800: "#2C3D4F",
          900: "#1B2631",
          950: "#141C24",
        },
        accent: {
          50: "#a8e6db",
          100: "#72cbbc",
          200: "#48ad9c",
          300: "#2c9785",
          400: "#128673",
          500: "#ffc96a",
          600: "#f66677",
          700: "#fcbbc0",
          800: "#f98b98",
          900: "#e44356",
          950: "#cb1b30",
        },
      },
    },
  },
  plugins: [],
};
