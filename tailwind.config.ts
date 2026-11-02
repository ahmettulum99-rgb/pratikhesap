import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 2px 8px rgb(20 43 74 / 4%)"
      },
      colors: {
        navy: "#142B4A",
        blue: {
          DEFAULT: "#2878E5",
          100: "#d8e8ff",
          200: "#a9ccff"
        },
        "pale-blue": "#EAF2FF",
        canvas: "#F5F8FC"
      }
    }
  },
  plugins: []
};

export default config;
