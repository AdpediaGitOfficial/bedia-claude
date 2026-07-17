import { Darker_Grotesque } from "next/font/google";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D463D",
          dark: "#0f2e20",
          light: "#2d6b4f",
        },
        secondary: {
          DEFAULT: "#E5E0C9",
          off: "#E6DFD5",
          dark: "#EDE8E2",
        },
        darkblack: "#333333",
      },
      fontFamily: {
        sans: ["var(--font-euclid)", ...defaultTheme.fontFamily.sans],
        neiko: ["var(--font-neiko)", "sans-serif"],
        sunrise: ["var(--font-sunrise)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      screens: {
        "2xl": "1920px", // optional, already default
      },
      borderRadius: {
        lg: "30px",
      },
      boxShadow: {
        soft: "0px 0px 55px 0px #0000001A",
      },
    },
  },
  plugins: [],
};
export default config;
