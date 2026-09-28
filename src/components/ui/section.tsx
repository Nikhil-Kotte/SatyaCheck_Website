import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, WordReveal } from "./reveal";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
};

export function Section({ id, children, className, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative isolate w-full scroll-mt-24 overflow-x-clip px-fluid py-20 lg:py-28", className)}
    >
      {children}
    </section>
  );
}

/** Small monospaced label above a headline, e.g. "[03] How it works". */
export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand",
        className
      )}
    >
      {index && <span className="text-fg-subtle">[{index}]</span>}
      <span className="h-px w-6 bg-brand/50" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

type SectionHeadingProps = {
  id: string;
  index?: string;
  eyebrow?: string;
  /** Wrap words in *asterisks* for the serif accent. */
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
        <Reveal y={12}>
          <Eyebrow index={index} className={cn("mb-6", center && "justify-center")}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <div className={cn(split && "lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16")}>
        <WordReveal
          id={id}
          text={title}
          className={cn("type-headline max-w-[16ch] font-display font-semibold text-fg", center && "mx-auto")}
        />
        {lede && (
          <Reveal delay={0.15}>
            <p className={cn("type-lede mt-7 max-w-2xl text-fg-muted", split && "lg:mt-0 lg:pb-2", center && "mx-auto")}>{lede}</p>
          </Reveal>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * Two soft colour fields behind a section, so liquid glass has something to
 * refract. Decorative only; clipped by the section.
 */
export function Aurora({ flip = false, tone = "brand" }: { flip?: boolean; tone?: "brand" | "risk" | "ok" }) {
  const second = { brand: "bg-brand-hi/[0.14]", risk: "bg-risk/[0.10]", ok: "bg-ok/[0.12]" }[tone];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className={cn("absolute top-[8%] h-[440px] w-[440px] rounded-full bg-brand/[0.12] blur-[130px]", flip ? "right-[-6%]" : "left-[-6%]")} />
      <div className={cn("absolute bottom-[6%] h-[480px] w-[480px] rounded-full blur-[140px]", second, flip ? "left-[4%]" : "right-[4%]")} />
    </div>
  );
}
