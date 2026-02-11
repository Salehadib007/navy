/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Inter", "sans-serif"], // ✅ Google Font
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light", // default
      "dark",
      "cupcake",
      "forest",
      "retro",
      "synthwave",
      "valentine",
    ],
    darkTheme: "dark",
  },
};
