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
      className={cn("relative w-full scroll-mt-24 px-fluid py-24 lg:py-36", className)}
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
  return (
    <div className={cn("mb-14 lg:mb-20", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <Eyebrow index={index} className={cn("mb-6", center && "justify-center")}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <WordReveal
        id={id}
        text={title}
        className={cn("type-headline max-w-[16ch] font-display font-semibold text-fg", center && "mx-auto")}
      />
      {lede && (
        <Reveal delay={0.15}>
          <p className={cn("type-lede mt-7 max-w-2xl text-fg-muted", center && "mx-auto")}>{lede}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
