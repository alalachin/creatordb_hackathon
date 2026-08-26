import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      boxShadow: {
        xs:    "0 1px 2px rgba(0,0,0,.05)",
        sm:    "0 1px 4px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.04)",
        md:    "0 4px 12px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.04)",
        lg:    "0 8px 32px rgba(0,0,0,.09), 0 16px 48px rgba(0,0,0,.05)",
        brand: "0 4px 24px rgba(13,148,136,.3)",
        glow:  "0 0 40px rgba(13,148,136,.22)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #0891b2 100%)",
        "gradient-hero":  "linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 50%, #f0f9ff 100%)",
      },
      animation: {
        "fade-in":     "fadeIn .4s ease both",
        "slide-up":    "slideUp .45s ease both",
        "scale-in":    "scaleIn .3s ease both",
        "float":       "float 4s ease-in-out infinite",
        "spin-slow":   "spin 3s linear infinite",
        "pulse-slow":  "pulse 3s ease-in-out infinite",
        "gradient":    "gradient-drift 6s ease infinite",
        "shimmer":     "shimmer 1.4s ease-in-out infinite",
        "blob":        "blob-drift 10s ease-in-out infinite",
        "glass-sweep": "glass-sweep 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(.94)" }, to: { opacity: "1", transform: "scale(1)" } },
        float:   {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "gradient-drift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition:  "200% 0" },
        },
        "blob-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%":      { transform: "translate(20px, -15px) scale(1.04)" },
          "66%":      { transform: "translate(-12px, 18px) scale(0.97)" },
        },
        "glass-sweep": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "250% center" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
