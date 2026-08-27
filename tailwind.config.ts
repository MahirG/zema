import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          soft: "var(--gold-2)",
          deep: "var(--gold-deep)",
        },
        zema: {
          text: "var(--text)",
          muted: "var(--muted)",
          subtle: "var(--muted-2)",
          green: "var(--green)",
          blue: "var(--blue)",
          red: "var(--red)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        ethiopic: ["var(--font-ethiopic)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 16px 64px -24px rgba(232, 176, 75, 0.55)",
        panel: "0 24px 80px -44px rgba(0, 0, 0, 0.9)",
      },
      transitionTimingFunction: {
        zema: "cubic-bezier(.2,.7,.2,1)",
      },
      animation: {
        "soft-pulse": "softPulse 2.2s ease-in-out infinite",
      },
      keyframes: {
        softPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".45" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
