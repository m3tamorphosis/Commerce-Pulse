import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))"
        }
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 24px rgba(15, 23, 42, 0.045)",
        elevated: "0 16px 42px rgba(15, 23, 42, 0.16)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "page-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "section-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.99)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "content-switch": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "nav-select": {
          "0%": { transform: "scale(0.98)" },
          "60%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" }
        },
        "row-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "bar-in": {
          "0%": { opacity: "0", transform: "scaleY(0.35)" },
          "100%": { opacity: "1", transform: "scaleY(1)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "popover-in": {
          "0%": { opacity: "0", transform: "translateY(-4px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      },
      animation: {
        "fade-in": "fade-in 180ms ease-out",
        "page-in": "page-in 160ms cubic-bezier(0.16, 1, 0.3, 1)",
        "section-in": "section-in 260ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "content-switch": "content-switch 220ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "nav-select": "nav-select 180ms ease-out",
        "row-in": "row-in 180ms ease-out both",
        "bar-in": "bar-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.4s ease-in-out infinite",
        "slide-up": "slide-up 220ms ease-out",
        "popover-in": "popover-in 140ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
