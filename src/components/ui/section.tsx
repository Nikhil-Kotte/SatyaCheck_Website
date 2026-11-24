import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, WordReveal } from "./reveal";

/**
 * Colour block for a section. Each tone re-declares the design tokens for
 * everything inside it (see index.css), so children need no changes.
 */
export type Tone = "paper" | "tint" | "ink" | "brand" | "lime";

const TONE_CLASS: Record<Tone, string> = {
  paper: "",
  tint: "border-y-2 border-edge bg-canvas-2",
  ink: "dark border-y-2 border-ink",
  brand: "tone-brand border-y-2 border-ink",
  lime: "tone-lime border-y-2 border-ink",
};

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  tone?: Tone;
};

export function Section({ id, children, className, labelledBy, tone = "paper" }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative isolate w-full scroll-mt-24 overflow-x-clip px-fluid py-20 lg:py-28", TONE_CLASS[tone], className)}
    >
      {children}
    </section>
  );
}

/** Stamped label above a headline: a numbered tag, like a case-file tab. */
export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-md border-2 border-edge bg-surface font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-fg shadow-[3px_3px_0_0_rgb(var(--pop))]",
        className
      )}
    >
      {index && (
        <span className="grid place-items-center border-r-2 border-edge bg-accent px-2 tracking-[0.06em] text-on-accent">{index}</span>
      )}
      <span className="px-2.5 py-1.5">{children}</span>
    </p>
  );
}

type SectionHeadingProps = {
  id: string;
  index?: string;
  eyebrow?: string;
  /** Wrap words in *asterisks* for the highlighter accent. */
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({ id, index, eyebrow, title, lede, align = "left", className, children }: SectionHeadingProps) {
  const center = align === "center";
  // Left-aligned headings with a lede use both columns on desktop, so the
  // right half of the header row is never empty.
  const split = !center && !!lede;
  return (
    <div className={cn("mx-auto mb-12 max-w-[1400px] lg:mb-16", center && "text-center", className)}>
      {eyebrow && (
        <Reveal y={12} className={cn("mb-7 flex", center && "justify-center")}>
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <div className={cn(split && "lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16")}>
        <WordReveal id={id} text={title} className={cn("type-headline max-w-[15ch] font-display text-fg", center && "mx-auto")} />
        {lede && (
          <Reveal delay={0.15}>
            <p
              className={cn(
                "type-lede mt-7 max-w-2xl text-fg-muted",
                split && "border-l-2 border-edge pl-5 lg:mb-2 lg:mt-0",
                center && "mx-auto"
              )}
            >
              {lede}
            </p>
          </Reveal>
        )}
      </div>
      {children}
    </div>
  );
}

/** Concentric arcs, like sound leaving a speaker. */
export function Ripples({ className, rings = 7 }: { className?: string; rings?: number }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden="true" className={className}>
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={30 + i * (166 / rings)}
          stroke="currentColor"
          strokeWidth={i % 3 === 0 ? 2 : 1.2}
          strokeDasharray={i % 3 === 1 ? "3 8" : undefined}
          opacity={1 - i * (0.8 / rings)}
        />
      ))}
    </svg>
  );
}

/**
 * Section ornament: a ripple in one corner and a hatched block in the other.
 * Flat vector only. Decorative; clipped to the section.
 */
export function Aurora({ flip = false, tone = "brand" }: { flip?: boolean; tone?: "brand" | "risk" | "ok" }) {
  const ink = { brand: "text-brand", risk: "text-risk", ok: "text-ok" }[tone];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Ripples
        className={cn(
          "absolute h-[340px] w-[340px] opacity-25 sm:h-[560px] sm:w-[560px] sm:opacity-35",
          ink,
          flip
            ? "bottom-[-130px] left-[-150px] sm:bottom-[-210px] sm:left-[-230px]"
            : "right-[-150px] top-[-130px] sm:right-[-230px] sm:top-[-210px]"
        )}
      />
      <div className={cn("bg-hatch absolute hidden h-24 w-40 opacity-30 lg:block", flip ? "right-0 top-16" : "bottom-16 left-0")} />
    </div>
  );
}

/** A waveform rule between sections: flat, a burst of voice, flat again. */
export function WaveDivider({ className }: { className?: string }) {
  const bars = Array.from({ length: 41 }, (_, i) => {
    const d = Math.abs(i - 20) / 20;
    return 4 + Math.round(30 * Math.pow(1 - d, 1.6) * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7))));
  });
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-4 px-fluid", className)}>
      <span className="h-0.5 flex-1 bg-edge" />
      <span className="flex h-9 items-center gap-[3px]">
        {bars.map((h, i) => (
          <span key={i} className="w-[3px] bg-brand" style={{ height: h }} />
        ))}
      </span>
      <span className="h-0.5 flex-1 bg-edge" />
    </div>
  );
}
