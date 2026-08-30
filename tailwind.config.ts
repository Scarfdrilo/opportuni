import type { Config } from "tailwindcss";

const config: Config = {
  // 'class' so no `dark:` utility ever activates from the OS color scheme —
  // the Opportuni UI is always light.
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["Gabarito", "var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        opportuni: {
          rosa: "#e3216d",
          "rosa-dark": "#c41b5c",
          "rosa-light": "#f06a9e",
          naranja: "#f89b0e",
          "naranja-dark": "#d4850b",
          "naranja-light": "#fbc56a",
          lila: "#7c5cfc",
          "lila-light": "#a48bff",
          teal: "#0ec4a9",
          blue: "#3B82F6",
          green: "#22C55E",
          yellow: "#FACC15",
          cream: "#fdf6ee",
          cream2: "#faf0e2",
          warm: "#f5e6d0",
          dark: "#1a1a2e",
          dark2: "#2d2d44",
          lavender: "#fff5f8",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #e3216d 0%, #f89b0e 100%)",
        "warm-gradient": "linear-gradient(135deg, #f89b0e 0%, #FACC15 100%)",
      },
      borderRadius: {
        bento: "16px",
        "bento-lg": "28px",
        "bento-xl": "36px",
      },
      boxShadow: {
        bento: "3px 3px 0 #1a1a2e",
        "bento-md": "4px 4px 0 #1a1a2e",
        "bento-lg": "5px 5px 0 #1a1a2e",
        "bento-xl": "7px 7px 0 #1a1a2e",
        "bento-rosa": "4px 4px 0 #e3216d",
        "bento-naranja": "4px 4px 0 #f89b0e",
        "bento-lila": "4px 4px 0 #7c5cfc",
        "bento-teal": "4px 4px 0 #0ec4a9",
        soft: "0 4px 20px rgba(227, 33, 109, 0.08)",
        "soft-rosa": "0 8px 25px rgba(227, 33, 109, 0.25)",
      },
      borderWidth: {
        bento: "2.5px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(10deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(0.6)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bop: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.3)", opacity: "1" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        bop: "bop 1.4s ease-in-out infinite",
        scroll: "scroll 25s linear infinite",
        "scroll-reverse": "scroll-reverse 30s linear infinite",
        "pulse-soft": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
