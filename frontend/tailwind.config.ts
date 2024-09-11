import { Config } from "tailwindcss";

const config = {
  content: ["index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2B85FF",
        secondary: "#EF863E",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
