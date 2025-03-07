/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // veya 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary-color))",
          light: "rgb(var(--primary-light))",
          dark: "rgb(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary-color))",
        },
        text: {
          primary: "rgb(var(--text-primary))",
          secondary: "rgb(var(--text-secondary))",
        },
        card: {
          bg: "rgb(var(--card-bg))",
          border: "rgb(var(--card-border))",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-slow": "pulse 2s ease-in-out infinite",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(var(--card-shadow), 0.1), 0 2px 4px -1px rgba(var(--card-shadow), 0.06)",
        "card-hover": "0 10px 15px -3px rgba(var(--card-shadow), 0.1), 0 4px 6px -2px rgba(var(--card-shadow), 0.05)",
      },
    },
  },
  plugins: [],
};
