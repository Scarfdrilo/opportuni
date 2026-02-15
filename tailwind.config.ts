import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        opportuni: {
          pink: "#E91E63",
          magenta: "#D81B60",
          orange: "#FF9800",
          'gradient-start': "#E91E63",
          'gradient-end': "#FF9800",
        },
      },
      backgroundImage: {
        'opportuni-gradient': 'linear-gradient(135deg, #E91E63 0%, #FF9800 100%)',
        'opportuni-gradient-hover': 'linear-gradient(135deg, #D81B60 0%, #F57C00 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
