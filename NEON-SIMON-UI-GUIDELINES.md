# NEON × SIMON - 80s Retro-Futurism UI Guidelines

## Design Philosophy
A high-end vintage synthesizer aesthetic found in a neon-lit arcade. Dark mode with heavy neon glows (pink, cyan, lime, amber) and a "lo-fi synth" feel.

---

## Color Palette (HSL Values)

### Core Colors
```css
--background: 260 30% 6%        /* Deep space black */
--foreground: 0 0% 95%          /* Off-white text */
--card: 260 35% 10%             /* Elevated surface */
--muted: 260 25% 18%            /* Dimmed arcade purple */
--muted-foreground: 260 15% 60% /* Subdued text */
--border: 260 30% 20%           /* Subtle borders */
```

### Neon Colors (The Stars)
```css
--neon-pink: 330 100% 60%       /* Hot pink - Primary accent */
--neon-cyan: 185 100% 50%       /* Electric cyan - Secondary */
--neon-lime: 120 100% 50%       /* Radioactive green - Success */
--neon-amber: 35 100% 55%       /* Gold/amber - Highlights */
--neon-purple: 280 100% 60%     /* Deep purple - Tertiary */
```

### Simon Button Colors
```css
--simon-green: 120 100% 45%
--simon-red: 0 100% 55%
--simon-yellow: 45 100% 55%
--simon-blue: 210 100% 55%
```

---

## Typography

### Font Stack
```css
font-orbitron: 'Orbitron', sans-serif     /* Headers, scores, titles */
font-arcade: 'Press Start 2P', cursive    /* Retro game text, buttons */
font-space: 'Space Mono', monospace       /* Body text, UI labels */
```

### Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap');
```

### Usage
- **Orbitron**: Scores, large numbers, futuristic headers
- **Press Start 2P**: Game buttons, retro labels, small titles
- **Space Mono**: Body copy, descriptions, UI text

---

## Neon Text Effects

```css
.neon-text-pink {
  color: hsl(330 100% 60%);
  text-shadow: 
    0 0 5px hsl(330 100% 60%),
    0 0 10px hsl(330 100% 60%),
    0 0 20px hsl(330 100% 60%),
    0 0 40px hsl(330 100% 60% / 0.5);
}

.neon-text-cyan {
  color: hsl(185 100% 50%);
  text-shadow: 
    0 0 5px hsl(185 100% 50%),
    0 0 10px hsl(185 100% 50%),
    0 0 20px hsl(185 100% 50%),
    0 0 40px hsl(185 100% 50% / 0.5);
}

.neon-text-lime {
  color: hsl(120 100% 50%);
  text-shadow: 
    0 0 5px hsl(120 100% 50%),
    0 0 10px hsl(120 100% 50%),
    0 0 20px hsl(120 100% 50%),
    0 0 40px hsl(120 100% 50% / 0.5);
}

.neon-text-amber {
  color: hsl(35 100% 55%);
  text-shadow: 
    0 0 5px hsl(35 100% 55%),
    0 0 10px hsl(35 100% 55%),
    0 0 20px hsl(35 100% 55%),
    0 0 40px hsl(35 100% 55% / 0.5);
}
```

---

## Neon Border Glow

```css
.neon-border {
  border: 2px solid hsl(330 100% 60%);
  box-shadow: 
    inset 0 0 15px hsl(330 100% 60% / 0.2),
    0 0 15px hsl(330 100% 60% / 0.4),
    0 0 30px hsl(330 100% 60% / 0.2);
}

.neon-border-cyan {
  border: 2px solid hsl(185 100% 50%);
  box-shadow: 
    inset 0 0 15px hsl(185 100% 50% / 0.2),
    0 0 15px hsl(185 100% 50% / 0.4),
    0 0 30px hsl(185 100% 50% / 0.2);
}
```

---

## Component Patterns

### Arcade Frame (Cards/Containers)
```css
.arcade-frame {
  background: linear-gradient(145deg, hsl(260 35% 12%), hsl(260 30% 6%));
  border: 3px solid hsl(260 30% 25%);
  box-shadow: 
    inset 0 2px 10px rgba(255,255,255,0.05),
    0 10px 40px rgba(0,0,0,0.5);
}
```

### Grid Background Pattern
```css
.grid-pattern {
  background-image: 
    linear-gradient(hsl(260 30% 15% / 0.5) 1px, transparent 1px),
    linear-gradient(90deg, hsl(260 30% 15% / 0.5) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

### CRT Scanline Overlay
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

---

## Animations

```css
/* Neon Pulse */
@keyframes pulseNeon {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.2); }
}

/* Flicker Effect (CRT) */
@keyframes flicker {
  0%, 100% { opacity: 1; }
  3% { opacity: 0.9; }
  6% { opacity: 1; }
  7% { opacity: 0.85; }
  9% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.9; }
  95% { opacity: 1; }
}

/* Glow Pulse */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
  50% { box-shadow: 0 0 30px currentColor, 0 0 60px currentColor, 0 0 80px currentColor; }
}

/* Victory Strobe */
@keyframes victoryStrobe {
  0%, 100% { opacity: 1; }
  25% { opacity: 0.3; }
  50% { opacity: 1; }
  75% { opacity: 0.4; }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

## Button Shadows (Per Color)

```css
/* Green Button */
shadow-[0_0_30px_rgba(16,185,129,0.5),inset_0_0_20px_rgba(255,255,255,0.2)]
/* Active: */
shadow-[0_0_60px_rgba(16,185,129,0.9),0_0_100px_rgba(16,185,129,0.6),inset_0_0_30px_rgba(255,255,255,0.4)]

/* Red Button */
shadow-[0_0_30px_rgba(239,68,68,0.5),inset_0_0_20px_rgba(255,255,255,0.2)]

/* Yellow Button */
shadow-[0_0_30px_rgba(251,191,36,0.5),inset_0_0_20px_rgba(255,255,255,0.2)]

/* Blue Button */
shadow-[0_0_30px_rgba(59,130,246,0.5),inset_0_0_20px_rgba(255,255,255,0.2)]
```

---

## Gradients

```css
/* Synthwave Background */
--gradient-synthwave: linear-gradient(180deg, hsl(280 60% 15%) 0%, hsl(260 30% 6%) 50%, hsl(330 30% 8%) 100%);

/* Rainbow Neon Border */
--gradient-neon-border: linear-gradient(135deg, hsl(330 100% 60%), hsl(185 100% 50%), hsl(120 100% 50%), hsl(35 100% 55%));

/* Chrome Text */
--gradient-chrome: linear-gradient(180deg, hsl(0 0% 95%) 0%, hsl(0 0% 70%) 50%, hsl(0 0% 95%) 100%);
```

---

## Design Rules

1. **Never use pure white** - Use `foreground` (off-white) or neon colors
2. **Avoid flat colors** - Always add gradients or glow effects
3. **Layer shadows** - Multiple box-shadows create depth
4. **Use inset shadows** - Adds that "pressed into the surface" feel
5. **Animate subtly** - Flickering, pulsing, floating animations
6. **Keep text readable** - Neon effects for headers, plain for body
7. **Dark backgrounds only** - This is a dark-mode-first design
8. **Round corners generously** - Arcade buttons feel soft and tactile

---

## Usage Example

```tsx
import '../styles/neon-simon-ui.css';

function MyComponent() {
  return (
    <div className="arcade-frame">
      <h1 className="font-orbitron neon-text-pink pulse-neon">
        SIMON SAYS
      </h1>
      <p className="font-space text-foreground">
        Welcome to the arcade
      </p>
      <button className="font-arcade neon-border-cyan glow-pulse">
        START GAME
      </button>
    </div>
  );
}
```

---

## Tailwind CSS Integration

To use these colors in Tailwind, add to `tailwind.config.js`:

```js
module.exports = {
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
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'arcade': ['Press Start 2P', 'cursive'],
        'space': ['Space Mono', 'monospace'],
      },
    },
  },
}
```

