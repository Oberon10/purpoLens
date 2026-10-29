import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        purpo: {
          dark: "#000000",
          surface: "#0e0e11",
          card: "#141418",
          cardBorder: "#23232c",
          muted: "#9a9aa8",
          purple: {
            DEFAULT: "#5E60CE",
            glow: "#7B2CBF",
            deep: "#4D194D",
            light: "#9D4EDD",
            hover: "#6F2DBD",
          },
          cyan: {
            DEFAULT: "#64DFDF",
            light: "#72EFDD",
            dark: "#48CAE4",
          },
          gray: {
            50: "#fafafa",
            100: "#f4f4f5",
            200: "#e5e5e5",
            300: "#d4d4d8",
            400: "#a1a1aa",
            500: "#71717a",
            600: "#52525b",
            700: "#3f3f46",
            800: "#27272a",
            900: "#18181b",
            950: "#09090b",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 50px -10px rgba(94, 96, 206, 0.4)",
        "glow-cyan": "0 0 50px -10px rgba(100, 223, 223, 0.35)",
        "glow-lg": "0 0 80px -15px rgba(94, 96, 206, 0.5)",
        card: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

