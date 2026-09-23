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
    <span className="relative inline-grid overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
      <span className="sr-only">{words[0]}</span>
      {/* Invisible longest word reserves width so the line never jumps. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden="true"
          className={cn("col-start-1 row-start-1", className)}
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
