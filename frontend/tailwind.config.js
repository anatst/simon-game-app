/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': 'hsl(330 100% 60%)',
        'neon-cyan': 'hsl(185 100% 50%)',
        'neon-lime': 'hsl(120 100% 50%)',
        'neon-amber': 'hsl(35 100% 55%)',
        'neon-purple': 'hsl(280 100% 60%)',
        'simon-green': 'hsl(120 100% 45%)',
        'simon-red': 'hsl(0 100% 55%)',
        'simon-yellow': 'hsl(45 100% 55%)',
        'simon-blue': 'hsl(210 100% 55%)',
        'background': 'hsl(260 30% 6%)',
        'foreground': 'hsl(0 0% 95%)',
        'card': 'hsl(260 35% 10%)',
        'muted': 'hsl(260 25% 18%)',
        'muted-foreground': 'hsl(260 15% 60%)',
        'border': 'hsl(260 30% 20%)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'arcade': ['Press Start 2P', 'cursive'],
        'space': ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'neon-pink': '0 0 15px hsl(330 100% 60% / 0.4), 0 0 30px hsl(330 100% 60% / 0.2)',
        'neon-cyan': '0 0 15px hsl(185 100% 50% / 0.4), 0 0 30px hsl(185 100% 50% / 0.2)',
        'neon-lime': '0 0 15px hsl(120 100% 50% / 0.4), 0 0 30px hsl(120 100% 50% / 0.2)',
        'neon-amber': '0 0 15px hsl(35 100% 55% / 0.4), 0 0 30px hsl(35 100% 55% / 0.2)',
        'simon-green': '0 0 30px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)',
        'simon-red': '0 0 30px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)',
        'simon-yellow': '0 0 30px rgba(251, 191, 36, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)',
        'simon-blue': '0 0 30px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
