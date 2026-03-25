/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--text))",
        primary: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-border))",
        },
      },
    },
  },
  plugins: [],
};