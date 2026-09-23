# 02. Component map: what goes where

Principle: the site must feel calm and trustworthy to parents and bank staff. Motion guides attention; it never shows off. One looping animation per screen at most, nothing that hijacks scrolling, everything still under `prefers-reduced-motion`.

## Source of each effect

| Effect | Source | Why this source |
|---|---|---|
| Shrink header, split reveal, stagger reveal, scroll word reveal, border beam, scroll spotlight, screenshot scroll reveal, footer reveal, parallax layers, segmented toggle, toast stack, overlay, copy button, carousel with controls, skeleton | **Our own code** in `03-motion-components.md`, built on the free `motion` library | The motion.dev UI versions of these are part of the paid Motion+ membership. Ours are original implementations of the same ideas, sized for this site |
| Rotating word, verdict card | **Our own code** | Specific to SatyaCheck |
| Smooth tab, spotlight cards, slide text button, morphic navbar, loader | **KokonutUI** (MIT), installed via shadcn CLI | Free, editable, fits the brand once the theme variables are mapped |

If the team later buys Motion+, the originals can replace ours through its shadcn command. Nothing else changes.

## Section by section

| Section | Components | Notes |
|---|---|---|
| Header | `ShrinkHeader` + KokonutUI `morphic-navbar` for desktop links | Logo left, links centre, "Join the waitlist" button right. Mobile: hamburger opens a simple full-width menu panel (AnimatePresence, Escape closes it) |
| Hero | Headline with `RotatingWord`, `VerdictCard`, `ParallaxLayers` (optional), KokonutUI `slide-text-button` for the primary CTA | Headline: "Is that really your [son / daughter / brother / friend] on the phone?" The first word, "son", is what screen readers and reduced-motion users get. Parallax: two faint layers only (dot grid, a soft cobalt glow), max 40 px travel |
| Problem | `SplitReveal` (onView) for the heading, `StaggerReveal` for the four steps, `ScrollWordReveal` for the closing line | The closing line "Caller ID checks the number. Your ears check the voice. Scammers now beat both." is the only scroll word reveal on the page |
| How it works | `ScrollSpotlight` with three steps, then the tinted "Every warning tells you why" band | Step visuals: (1) a voiceprint match card with two waveforms, (2) a waveform with an "AI fingerprints" scan line, (3) a quoted scam line with a matched-script tag. On mobile it falls back to a stacked list automatically |
| Demo | `ScreenshotScrollReveal` wrapping the video, `Skeleton` while the embed loads or when no URL is set | Lazy-load the iframe |
| What your family sees | Desktop: KokonutUI `smooth-tab` (4 tabs: Verified, Be careful, High risk, Unverified; each `cardContent` is a small phone-style result card). Mobile: `SnapCarousel` with the same four cards | Adapt smooth-tab: remove its fixed `w-[400px]` and fixed card height, set one cobalt `color` per tab (not rainbow colours), keep its keyboard behaviour |
| For banks and telcos | `StaggerReveal` for the three points, flow diagram, "Talk to us about a pilot" opens `Overlay` with the pilot form | Submit shows KokonutUI `loader`, result goes to `useToast()` |
| Where we are | `StaggerReveal` for the three-step timeline | Done / In progress / Next |
| Privacy summary | KokonutUI `spotlight-cards` for the four blocks | If its layout fights the design, fall back to `StaggerReveal` cards. Hover spotlight is desktop-only by nature, which is fine |
| Team | `StaggerReveal` cards | |
| FAQ | Accessible accordion built in place with `motion` height animation | Buttons with `aria-expanded`, one open at a time |
| Final CTA (waitlist) | `BorderBeam` around the form card, `SegmentedToggle` for "I am a", KokonutUI `loader` on submit, `useToast()` for success or error | The only border beam on the page: it pulls the eye to the conversion point |
| Footer | `FooterReveal`, `CopyButton` for the contact email | FooterReveal switches itself off when the footer is taller than the screen |
| Whole app | `ToastProvider` wraps the app | |

## Deliberately not used, and why

| Component | Reason |
|---|---|
| Page curtain (motion.dev) | Adds a delay to every navigation; the site has only two pages |
| Coverflow (motion.dev) | Playful 3D look works against a trust-first brand; the snap carousel covers the need |
| Expand card (motion.dev) | Nothing on the page needs card-to-detail expansion |
| Hold button, attract button, switch button, command button, social button (KokonutUI) | No matching action on a landing page; "hold to confirm" on a scam-safety site could confuse parents |
| Shimmer text, dynamic text, scroll text (KokonutUI) | Covered by our verdict card shimmer, `RotatingWord` and `ScrollWordReveal`. Dynamic text cycles fixed foreign-language greetings once and stops, which does not fit |
| Mouse effect card, card stack, liquid glass card (KokonutUI) | Too many hover effects dilute the one that matters; heavy blur also costs performance on low-end phones |
| Profile dropdown, action search bar (KokonutUI) | No accounts or search on a marketing page |

## Dribbble references
The three Dribbble shots are mood references only: use them for spacing, card density and how much whitespace surrounds a hero. Do not copy layouts, illustrations or assets from them.

## Motion rules (acceptance criteria)
1. At most one continuously looping animation visible at a time (hero verdict card, then border beam far below).
2. No scroll hijacking, no scroll-linked effect that changes page length.
3. Every component respects `prefers-reduced-motion` (ours already do; check the KokonutUI ones and add `useReducedMotion` where missing).
4. Scroll effects are transforms and opacity only. No animating width, height or top in scroll handlers.
5. Lighthouse performance stays 90+ on mobile. If a component drops it, remove the component, not the content.
