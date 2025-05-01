// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",        // 👈 esto debe decir "class"
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
