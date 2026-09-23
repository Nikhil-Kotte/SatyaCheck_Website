import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

/** Brand mark: a voice waveform resolving into a check. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="sc-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--brand-hi))" />
          <stop offset="1" stopColor="rgb(var(--brand-solid))" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#sc-logo)" />
      <path
        d="M6.5 16v0M9.5 12.5v7M12.5 14.5v3"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M15 16.5l3.2 3.3L25.5 11" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[19px] font-bold tracking-[-0.04em] text-fg">
        Satya<span className="text-brand">Check</span>
      </span>
    </span>
  );
}

/** Sun/moon switch. The new theme grows out of the button as a circle. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={cn(
        "relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line/20 bg-surface/60 text-fg transition-colors hover:border-brand/50 hover:text-brand",
        className
      )}
    >
      <motion.span
        key={theme}
        initial={{ y: 18, rotate: -90, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="grid place-items-center"
      >
        {dark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
      </motion.span>
    </button>
  );
}

/** A dot with a ring that pulses outward. Static under reduced motion. */
export function PulseDot({ className, tone = "brand" }: { className?: string; tone?: "brand" | "ok" | "warn" | "risk" }) {
  const color = { brand: "bg-brand", ok: "bg-ok", warn: "bg-warn", risk: "bg-risk" }[tone];
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)} aria-hidden="true">
      <span className={cn("absolute inset-0 rounded-full animate-pulse-ring", color)} />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}

/** Counts up to `to` once it scrolls into view. */
export function Counter({ to, suffix = "", prefix = "", className }: { to: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

/** Infinite horizontal ticker. Children are rendered twice for a seamless loop. */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mask-fade-x relative flex overflow-hidden", className)}>
      <div className="flex w-max shrink-0 animate-marquee items-center hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Thin brand-coloured bar at the very top that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand-solid via-brand-hi to-brand"
      style={{ scaleX }}
    />
  );
}

/** Animated equaliser bars, used on the sound toggle. */
export function EqBars({ active, className }: { active: boolean; className?: string }) {
  return (
    <span className={cn("flex h-3.5 items-end gap-[2px]", className)} aria-hidden="true">
      {[0, 0.2, 0.4, 0.1].map((d, i) => (
        <span
          key={i}
          className={cn("w-[2.5px] origin-bottom rounded-full bg-current", active ? "h-full animate-eq" : "h-1")}
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </span>
  );
}
