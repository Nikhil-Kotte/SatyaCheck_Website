# 03. Motion components (source)

Original implementations for SatyaCheck, built on the free `motion` library (`motion/react`). They were type-checked with TypeScript in strict mode against React 19 and motion 13, and render without errors. They have not yet been tested visually in a browser, so check each one on a phone.

Create each file at the path in its heading. All of them respect `prefers-reduced-motion`.

## Usage examples

```tsx
// Hero headline
<h1 className="font-display text-5xl font-bold md:text-7xl">
  Is that really your <RotatingWord words={["son", "daughter", "brother", "friend"]} /> on the phone?
</h1>

// Section heading that reveals when scrolled to
<SplitReveal as="h2" onView text="Three checks. One clear answer." className="font-display text-4xl font-bold" />

// Waitlist card with the travelling border light
<BorderBeam innerClassName="bg-white p-8" radius={28}>
  <WaitlistForm />
</BorderBeam>

// Toasts: wrap the app once, then call from any component
<ToastProvider><App /></ToastProvider>
const toast = useToast();
toast({ title: "You're on the list. Thank you.", tone: "success" });

// Footer reveal: wrap everything except the footer
<FooterReveal footer={<SiteFooter />}>
  <main>{/* all sections */}</main>
</FooterReveal>
```

## Utility

`src/lib/utils.ts`

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## ShrinkHeader

`src/components/motion/shrink-header.tsx`

```tsx
import { useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type ShrinkHeaderProps = {
  children: ReactNode;
  /** Scroll distance in px before the header shrinks. */
  threshold?: number;
  className?: string;
};

/**
 * Sticky header that starts tall and transparent, then shrinks into a
 * compact translucent bar once the page scrolls past `threshold`.
 */
export function ShrinkHeader({ children, threshold = 24, className }: ShrinkHeaderProps) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [shrunk, setShrunk] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > threshold;
    if (next !== shrunk) setShrunk(next);
  });

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center px-4",
        "pt-[env(safe-area-inset-top)]",
        className
      )}
      initial={false}
      animate={{ paddingTop: shrunk ? 8 : 20 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="flex w-full items-center justify-between rounded-full border"
        initial={false}
        animate={{
          maxWidth: shrunk ? 880 : 1200,
          paddingTop: shrunk ? 10 : 16,
          paddingBottom: shrunk ? 10 : 16,
          paddingLeft: shrunk ? 18 : 8,
          paddingRight: shrunk ? 10 : 8,
          backgroundColor: shrunk ? "rgba(253,250,231,0.82)" : "rgba(253,250,231,0)",
          borderColor: shrunk ? "rgba(30,43,250,0.18)" : "rgba(30,43,250,0)",
          boxShadow: shrunk ? "0 8px 30px rgba(17,17,17,0.08)" : "0 0 0 rgba(0,0,0,0)",
        }}
        style={{ backdropFilter: shrunk ? "blur(12px)" : "none", WebkitBackdropFilter: shrunk ? "blur(12px)" : "none" }}
        transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.header>
  );
}
```

## SplitReveal

`src/components/motion/split-reveal.tsx`

```tsx
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SplitRevealProps = {
  text: string;
  /** Rendered element. Use "h1" for the hero headline. */
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Animate when scrolled into view instead of on mount. */
  onView?: boolean;
};

/**
 * Headline that reveals word by word, each word rising out of its own mask.
 * Screen readers get the full sentence once, via aria-label.
 */
export function SplitReveal({
  text,
  as = "h1",
  className,
  delay = 0.1,
  stagger = 0.06,
  onView = false,
}: SplitRevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(" ");

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : delay } },
  };
  const word = {
    hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 1 : 0 },
    show: { y: "0%", opacity: 1, transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const trigger = onView
    ? { whileInView: "show", viewport: { once: true, amount: 0.6 } }
    : { animate: "show" };

  return (
    <Tag aria-label={text} className={cn(className)} variants={container} initial="hidden" {...trigger}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" variants={word}>
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
```

## StaggerReveal

`src/components/motion/stagger-reveal.tsx`

```tsx
import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  /** Class applied to each wrapped child. */
  itemClassName?: string;
  /** Seconds between items. */
  stagger?: number;
  /** Distance in px each item rises from. */
  distance?: number;
};

/**
 * Wraps each child and fades it up in sequence the first time the group
 * scrolls into view. Use for card grids, timelines and feature lists.
 */
export function StaggerReveal({
  children,
  className,
  itemClassName,
  stagger = 0.1,
  distance = 24,
}: StaggerRevealProps) {
  const reduce = useReducedMotion();
  const container = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : stagger } } };
  const item = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : distance },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {Children.toArray(children).map((child, i) => (
        <motion.div key={i} className={cn(itemClassName)} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

## ScrollWordReveal

`src/components/motion/scroll-word-reveal.tsx`

```tsx
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

type ScrollWordRevealProps = {
  text: string;
  className?: string;
  /** Opacity of words that have not been reached yet. */
  dimOpacity?: number;
};

/**
 * A statement whose words brighten one by one as the reader scrolls through
 * it. Use once per page, for the single line you most want read.
 */
export function ScrollWordReveal({ text, className, dimOpacity = 0.15 }: ScrollWordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} aria-label={text} className={cn("flex flex-wrap", className)}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={`${w}-${i}`} progress={scrollYProgress} range={[start, end]} dim={dimOpacity}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  dim,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className="mr-[0.25em]">
      {children}
    </motion.span>
  );
}
```

## RotatingWord

`src/components/motion/rotating-word.tsx`

```tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type RotatingWordProps = {
  words: string[];
  /** Milliseconds each word stays on screen. */
  interval?: number;
  className?: string;
};

/**
 * Swaps one word in a sentence on a slow loop, e.g. "your son / daughter /
 * brother". The first word is what screen readers and reduced-motion users
 * get, so the sentence always reads correctly.
 */
export function RotatingWord({ words, interval = 2400, className }: RotatingWordProps) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(t);
  }, [reduce, words.length, interval]);

  if (reduce) return <span className={className}>{words[0]}</span>;

  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      <span className="sr-only">{words[0]}</span>
      {/* Invisible longest word reserves width so the line never jumps. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden="true"
          className="col-start-1 row-start-1 text-cobalt"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
```

## VerdictCard (hero signature)

`src/components/motion/verdict-card.tsx`

```tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Stage = 0 | 1 | 2 | 3 | 4 | 5;
// 0 ringing, 1-3 checks appear, 4 warning, 5 hold then restart

const CHECKS = [
  { label: "Voice match", value: "Weak" },
  { label: "Synthetic speech", value: "Detected" },
  { label: "Scam script", value: "Family emergency" },
];

const TIMINGS: Record<Stage, number> = { 0: 1400, 1: 700, 2: 700, 3: 900, 4: 4000, 5: 600 };

/**
 * The hero's signature animation: a phone call screen where three checks
 * tick in one by one, then a warning appears with the quoted scam line.
 * Loops. Under reduced motion it shows the final state, still.
 */
export function VerdictCard({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>(reduce ? 4 : 0);

  useEffect(() => {
    if (reduce) {
      setStage(4);
      return;
    }
    const t = window.setTimeout(() => setStage((s) => ((s + 1) % 6) as Stage), TIMINGS[stage]);
    return () => window.clearTimeout(t);
  }, [stage, reduce]);

  const visible = stage === 5 ? 0 : stage;

  return (
    <figure className={cn("mx-auto w-full max-w-[340px]", className)}>
      <div
        role="img"
        aria-label="Illustration: SatyaCheck warns that a caller claiming to be Rahul may not be him, because the voice match is weak, synthetic speech is detected and the conversation matches a family-emergency scam."
        className="rounded-[44px] bg-ink p-3 shadow-[0_30px_60px_-20px_rgba(30,43,250,0.35)]"
      >
        <motion.div
          className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[34px] bg-white px-5 pb-6 pt-10"
          animate={{ opacity: stage === 5 ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute left-1/2 top-3 h-2 w-20 -translate-x-1/2 rounded-full bg-ink" />

          <p className="text-center font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">Incoming call</p>
          <p className="mt-1 text-center font-display text-3xl font-bold tracking-tight text-ink">Rahul (son)</p>
          <p className="mt-1 text-center text-sm text-ink-muted">+91 98••• ••210</p>

          <Waveform live={!reduce && stage < 4} />

          <div className="mt-2 h-5 text-center text-xs font-medium">
            {stage < 4 && !reduce && <ShimmerLabel text="Checking the call…" />}
          </div>

          <ul className="mt-3 space-y-2">
            {CHECKS.map((c, i) => (
              <AnimatePresence key={c.label}>
                {visible > i && (
                  <motion.li
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.35 }}
                    className="flex items-center justify-between rounded-xl border border-cobalt/15 bg-cobalt/[0.04] px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm text-ink">
                      <span className="h-2 w-2 rounded-full bg-cobalt" />
                      {c.label}
                    </span>
                    <span className="font-display text-sm font-semibold text-cobalt">{c.value}</span>
                  </motion.li>
                )}
              </AnimatePresence>
            ))}
          </ul>

          <AnimatePresence>
            {visible >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4"
              >
                <div className="rounded-2xl bg-cobalt p-4 text-cream">
                  <p className="font-display text-xl font-bold leading-tight">Stop. This may not be Rahul.</p>
                  <p className="mt-2 text-sm leading-snug text-cream/90">
                    He said “Don’t tell Papa. Send it now, I’ll explain later.” This matches a known family-emergency scam.
                  </p>
                </div>
                <div className="mt-3 grid gap-2">
                  <span className="rounded-full bg-cobalt py-3 text-center font-display text-sm font-semibold text-cream">
                    Call Rahul directly
                  </span>
                  <span className="rounded-full border-2 border-cobalt py-2.5 text-center font-display text-sm font-semibold text-cobalt">
                    Report to 1930
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <figcaption className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-ink-muted">
        Illustrative screen
      </figcaption>
    </figure>
  );
}

function Waveform({ live }: { live: boolean }) {
  const bars = Array.from({ length: 28 }, (_, i) => 8 + Math.round(22 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23))));
  return (
    <div aria-hidden="true" className="mt-5 flex h-10 items-center justify-center gap-[3px]">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[4px] rounded-full bg-cobalt/60"
          style={{ height: h }}
          animate={live ? { scaleY: [1, 0.4 + (i % 5) * 0.15, 1] } : { scaleY: 1 }}
          transition={live ? { duration: 0.9 + (i % 4) * 0.15, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        />
      ))}
    </div>
  );
}

function ShimmerLabel({ text }: { text: string }) {
  return (
    <motion.span
      className="bg-[length:200%_100%] bg-gradient-to-r from-ink-muted via-cobalt to-ink-muted bg-clip-text text-transparent"
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      transition={{ duration: 2.2, ease: "linear", repeat: Infinity }}
    >
      {text}
    </motion.span>
  );
}
```

## BorderBeam

`src/components/motion/border-beam.tsx`

```tsx
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type BorderBeamProps = {
  children: ReactNode;
  className?: string;
  /** Classes for the inner panel (its background must be opaque). */
  innerClassName?: string;
  /** Corner radius in px, shared by the frame and the panel. */
  radius?: number;
  /** Border thickness in px. */
  thickness?: number;
  /** Seconds per lap. */
  duration?: number;
  /** Colour of the travelling light. */
  color?: string;
  /** Resting border colour. */
  trackColor?: string;
};

/**
 * A thin arc of light that travels around a rounded panel's border.
 * Built from a rotating conic gradient that is only visible through the
 * gap between the frame and the panel. Use on one element per page.
 */
export function BorderBeam({
  children,
  className,
  innerClassName,
  radius = 28,
  thickness = 2,
  duration = 6,
  color = "#1E2BFA",
  trackColor = "rgba(30,43,250,0.15)",
}: BorderBeamProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ borderRadius: radius, padding: thickness, background: trackColor }}
    >
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[200%]"
          style={{
            x: "-50%",
            y: "-50%",
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${color} 340deg, transparent 360deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        />
      )}
      <div className={cn("relative h-full", innerClassName)} style={{ borderRadius: radius - thickness }}>
        {children}
      </div>
    </div>
  );
}
```

## ScrollSpotlight

`src/components/motion/scroll-spotlight.tsx`

```tsx
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type SpotlightStep = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
  /** What the sticky panel shows while this step is active. */
  visual: ReactNode;
};

type ScrollSpotlightProps = {
  steps: SpotlightStep[];
  className?: string;
};

/**
 * Two-column scrollytelling block. The visual on one side stays pinned
 * while the steps scroll past; whichever step is in the middle of the
 * viewport is highlighted and drives the visual. On small screens it
 * falls back to a simple stacked list with each visual inline.
 */
export function ScrollSpotlight({ steps, className }: ScrollSpotlightProps) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className={cn("grid gap-10 lg:grid-cols-2 lg:gap-16", className)}>
      <div className="hidden lg:block">
        <div className="sticky top-28 flex h-[70vh] items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[active]?.id}
              className="w-full"
              initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : -16, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
            >
              {steps[active]?.visual}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ol className="flex flex-col lg:py-[20vh]">
        {steps.map((step, i) => (
          <Step key={step.id} step={step} index={i} active={i === active} onActive={() => setActive(i)} />
        ))}
      </ol>
    </div>
  );
}

function Step({
  step,
  index,
  active,
  onActive,
}: {
  step: SpotlightStep;
  index: number;
  active: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <li ref={ref} className="py-8 lg:min-h-[45vh] lg:py-0 lg:flex lg:flex-col lg:justify-center">
      <div
        className={cn(
          "border-l-2 pl-6 transition-all duration-300",
          active ? "border-cobalt opacity-100" : "border-cobalt/15 lg:opacity-40"
        )}
      >
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-cobalt">
          {step.eyebrow ?? String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">{step.title}</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">{step.body}</p>
        <div className="mt-6 lg:hidden">{step.visual}</div>
      </div>
    </li>
  );
}
```

## ScreenshotScrollReveal

`src/components/motion/screenshot-scroll-reveal.tsx`

```tsx
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type ScreenshotScrollRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A media panel (video, screenshot) that starts tilted back and slightly
 * small, then straightens and scales to full size as it scrolls into view.
 */
export function ScreenshotScrollReveal({ children, className }: ScreenshotScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [reduce ? 1 : 0.4, 1]);

  return (
    <div ref={ref} className={cn("[perspective:1200px]", className)}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "center top" }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
```

## ParallaxLayers

`src/components/motion/parallax-layers.tsx`

```tsx
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type Layer = {
  content: ReactNode;
  /** Pixels the layer moves over the section's scroll. Negative moves up. */
  distance: number;
  className?: string;
};

type ParallaxLayersProps = {
  layers: Layer[];
  children?: ReactNode;
  className?: string;
};

/**
 * Decorative background layers that drift at different speeds as the
 * section scrolls. Keep distances small (20 to 80 px) so it stays calm.
 */
export function ParallaxLayers({ layers, children, className }: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {layers.map((layer, i) => (
        <ParallaxLayer key={i} layer={layer} progress={scrollYProgress} disabled={!!reduce} />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function ParallaxLayer({
  layer,
  progress,
  disabled,
}: {
  layer: Layer;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  disabled: boolean;
}) {
  const y = useTransform(progress, [0, 1], [0, disabled ? 0 : layer.distance]);
  return (
    <motion.div aria-hidden="true" style={{ y }} className={cn("pointer-events-none absolute inset-0", layer.className)}>
      {layer.content}
    </motion.div>
  );
}
```

## FooterReveal

`src/components/motion/footer-reveal.tsx`

```tsx
import { useEffect, useRef, useState, type ReactNode } from "react";

type FooterRevealProps = {
  /** The page content that scrolls away. Must have an opaque background. */
  children: ReactNode;
  /** The footer that sits underneath and is uncovered at the end. */
  footer: ReactNode;
};

/**
 * The page lifts away at the end of the scroll to uncover a footer that
 * was sitting underneath it. Falls back to a normal footer when the
 * footer is taller than the viewport (for example on small phones).
 */
export function FooterReveal({ children, footer }: FooterRevealProps) {
  const footerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(0);
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      setHeight(h);
      setFits(h < window.innerHeight * 0.8);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div
        className="relative z-10 bg-cream shadow-[0_24px_40px_-24px_rgba(17,17,17,0.18)]"
        style={{ marginBottom: fits ? height : 0 }}
      >
        {children}
      </div>
      <footer ref={footerRef} className={fits ? "fixed inset-x-0 bottom-0 z-0" : "relative"}>
        {footer}
      </footer>
    </>
  );
}
```

## SegmentedToggle

`src/components/motion/segmented-toggle.tsx`

```tsx
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

type SegmentedToggleProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group, e.g. "I am a". */
  label: string;
  className?: string;
};

/**
 * Pill-shaped single-choice control with a highlight that glides between
 * options. Works as a radio group for keyboards and screen readers.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedToggleProps<T>) {
  const id = useId();
  const reduce = useReducedMotion();

  const onKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = options[(index + dir + options.length) % options.length];
    onChange(next.value);
    document.getElementById(`${id}-${next.value}`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex flex-wrap gap-1 rounded-full border border-cobalt/20 bg-cobalt/5 p-1", className)}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            id={`${id}-${opt.value}`}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
              selected ? "text-cream" : "text-ink hover:text-cobalt"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-cobalt"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

## ToastProvider and useToast

`src/components/motion/toast-stack.tsx`

```tsx
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
type Toast = { id: number; title: string; description?: string; tone: ToastTone };
type ToastInput = Omit<Toast, "id">;

const ToastContext = createContext<((t: ToastInput) => void) | null>(null);

/** Call `const toast = useToast(); toast({ title, tone })` anywhere inside ToastProvider. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/**
 * Stacked notifications in the bottom-right (bottom-centre on mobile).
 * Newest on top, older ones tucked behind; each dismisses after 5 s.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { ...input, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center sm:inset-x-auto sm:right-6 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {[...toasts].reverse().map((t, i) => (
            <motion.div
              key={t.id}
              layout={!reduce}
              initial={{ opacity: 0, y: reduce ? 0 : 24, scale: 0.96 }}
              animate={{ opacity: 1 - i * 0.2, y: reduce ? 0 : -i * 10, scale: 1 - i * 0.04 }}
              exit={{ opacity: 0, y: reduce ? 0 : 12, scale: 0.96 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              style={{ zIndex: 10 - i, position: i === 0 ? "relative" : "absolute", bottom: 0 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-cream p-4 shadow-lg",
                t.tone === "error" ? "border-red-300" : "border-cobalt/20"
              )}
              role="status"
            >
              {t.tone === "error" ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-ink">{t.title}</p>
                {t.description && <p className="mt-0.5 text-sm text-ink-muted">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded-full p-1 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
```

## Overlay (modal)

`src/components/motion/overlay.tsx`

```tsx
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Accessible modal: blurred backdrop, panel that rises in, Escape and
 * backdrop click close it, focus moves into the panel and returns to the
 * trigger afterwards, and Tab stays inside while open.
 */
export function Overlay({ open, onClose, title, children, className }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const el = panelRef.current?.querySelector<HTMLElement>(
        "input, select, textarea, button, [href], [tabindex]:not([tabindex='-1'])"
      );
      el?.focus();
    };
    const t = window.setTimeout(focusFirst, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        "input, select, textarea, button, [href], [tabindex]:not([tabindex='-1'])"
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative w-full max-w-lg rounded-t-3xl border border-cobalt/20 bg-cream p-6 shadow-2xl sm:rounded-3xl sm:p-8",
              "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
              className
            )}
            initial={{ y: reduce ? 0 : 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : 40, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-ink-muted hover:bg-cobalt/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
```

## CopyButton

`src/components/motion/copy-button.tsx`

```tsx
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  /** Visible text; defaults to the value itself. */
  label?: string;
  className?: string;
};

/** Shows a value (e.g. the contact email) with a one-click copy action. */
export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-cobalt/20 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-cobalt hover:text-cobalt",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
        className
      )}
    >
      <span>{label ?? value}</span>
      <span className="relative h-4 w-4" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            {copied ? <Check className="h-4 w-4 text-cobalt" /> : <Copy className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
```

## SnapCarousel (carousel with controls)

`src/components/motion/snap-carousel.tsx`

```tsx
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SnapCarouselProps = {
  children: ReactNode;
  /** Accessible name, e.g. "Result screens". */
  label: string;
  className?: string;
  /** Width of each slide, as a Tailwind class. */
  slideClassName?: string;
};

/**
 * Native scroll-snap carousel with previous/next buttons and dot
 * indicators. Swipe works on touch for free; buttons and dots are for
 * mouse and keyboard users. Use on mobile; show a grid on desktop.
 */
export function SnapCarousel({ children, label, className, slideClassName = "w-[80%] sm:w-[45%]" }: SnapCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const items = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const el = track?.children[i] as HTMLElement | undefined;
    if (!track || !el) return;
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <section aria-roledescription="carousel" aria-label={label} className={cn("relative", className)}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[10%] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn("shrink-0 snap-center", slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
          aria-label="Previous"
          className="rounded-full border border-cobalt/20 p-2 text-ink transition hover:border-cobalt disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-cobalt" : "w-2 bg-cobalt/25 hover:bg-cobalt/50"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(Math.min(slides.length - 1, index + 1))}
          disabled={index === slides.length - 1}
          aria-label="Next"
          className="rounded-full border border-cobalt/20 p-2 text-ink transition hover:border-cobalt disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
```

## Skeleton

`src/components/motion/skeleton.tsx`

```tsx
import { cn } from "@/lib/utils";

/**
 * Placeholder block with a soft shimmer, shown while something loads
 * (for example the demo video). The shimmer stops under reduced motion.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-cobalt/[0.06]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
        "motion-reduce:before:hidden",
        className
      )}
    />
  );
}
```
