# 01. Setup and theme

Stack: Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui (for installing KokonutUI components) + `motion` (free, MIT).

## 1. Install

Follow the current shadcn/ui install guide for Vite (it sets up Tailwind v4, the `@/` path alias and `components.json`). Then:

```bash
npm install motion lucide-react clsx tailwind-merge
npx shadcn@latest init
```

When `init` asks for a base colour, pick any; we override the variables below. Light mode only: do not add a dark theme.

## 2. `src/lib/utils.ts`

shadcn usually creates this. If not, create it. Every component imports `cn` from here.

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 3. Fonts

In `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
```

## 4. Theme tokens (add to the main CSS file that shadcn created)

Keep the `@import` lines shadcn added at the top. Add our brand tokens, then point shadcn's variables at the same palette so KokonutUI components pick up the brand automatically.

```css
@theme {
  --color-cream: #FDFAE7;
  --color-cobalt: #1E2BFA;
  --color-ink: #111111;
  --color-ink-muted: #6B6B6B;

  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

/* Map shadcn variables to the SatyaCheck palette (light only). */
:root {
  --radius: 1rem;
  --background: #FDFAE7;
  --foreground: #111111;
  --card: #FFFFFF;
  --card-foreground: #111111;
  --popover: #FFFFFF;
  --popover-foreground: #111111;
  --primary: #1E2BFA;
  --primary-foreground: #FDFAE7;
  --secondary: rgba(30, 43, 250, 0.08);
  --secondary-foreground: #111111;
  --muted: rgba(30, 43, 250, 0.06);
  --muted-foreground: #6B6B6B;
  --accent: rgba(30, 43, 250, 0.08);
  --accent-foreground: #111111;
  --border: rgba(30, 43, 250, 0.2);
  --input: rgba(30, 43, 250, 0.25);
  --ring: #1E2BFA;
}

/* Remove any .dark { ... } block shadcn generated. */

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

html { scroll-behavior: smooth; }
body {
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 { font-family: var(--font-display); letter-spacing: -0.02em; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

Token note: grey body text is `text-ink-muted`. Do not use `text-muted` for text: in shadcn, `muted` is a background colour.

## 5. KokonutUI components (MIT licence)

Install only these. Each command copies the component source into the project, so it can be edited.

```bash
npx shadcn@latest add @kokonutui/smooth-tab
npx shadcn@latest add @kokonutui/spotlight-cards
npx shadcn@latest add @kokonutui/slide-text-button
npx shadcn@latest add @kokonutui/morphic-navbar
npx shadcn@latest add @kokonutui/loader
```

If the `@kokonutui/` namespace is not recognised, use the install command shown on that component's page at kokonutui.com/docs. After installing, read each file and adapt it (props, default demo content, fixed widths) as described in `02-component-map.md`. Keep the MIT header comment in each file.

## 6. Our own motion components

Create `src/components/motion/` and add every file from `03-motion-components.md`. They depend only on `motion`, `lucide-react` and `@/lib/utils`.
