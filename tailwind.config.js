/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Inter", "sans-serif"], // ✅ Google Font
      },
    },
  },
  plugins: [require("daisyui")],
};
