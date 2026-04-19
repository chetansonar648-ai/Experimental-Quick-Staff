/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#13b6ec",
        secondary: "#1DB954",
        "background-light": "#f6f7f8",
        "background-dark": "#101c22",
        "text-light": "#111418",
        "text-dark": "#f6f7f8",
        "subtle-light": "#617c89",
        "subtle-dark": "#a0b1b9",
        "border-light": "#dbe0e6",
        "border-dark": "#344150",
        positive: "#078836",
      },
      fontFamily: {
        display: ["Inter", "Manrope", "Poppins", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

