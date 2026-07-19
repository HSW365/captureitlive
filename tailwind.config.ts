import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 3px)",
        sm: "calc(var(--radius) - 6px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        coral: { 50: "#FFF3EF", 100: "#FFE1D6", 300: "#FFAF94", 500: "#FF6B4A", 600: "#E8532F", 700: "#C23F20", 900: "#6B2010" },
        amber: { 50: "#FFF8E8", 100: "#FFECBC", 300: "#FFD066", 500: "#F5A623", 600: "#D6870F", 700: "#A8650A", 900: "#5C3705" },
        teal: { 50: "#EEFBF8", 100: "#CDF3EA", 300: "#7EDBC7", 500: "#1D9A85", 600: "#157E6C", 700: "#0F6255", 900: "#093732" },
        violet: { 50: "#F5F0FF", 100: "#E4D6FF", 300: "#B896F5", 500: "#8358D6", 600: "#6A3FBD", 700: "#522F94", 900: "#2D1A54" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["Space Grotesk", "monospace"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "trail-draw": { from: { strokeDashoffset: "1400" }, to: { strokeDashoffset: "0" } },
        "rise": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "trail-draw": "trail-draw 2.4s ease-out forwards",
        "rise": "rise 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
