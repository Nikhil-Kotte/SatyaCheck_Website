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
