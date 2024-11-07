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
