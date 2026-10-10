import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_[]";
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type DecodeTextProps = {
  text: string;
  /** Total reveal budget in ms (Article Headings template default). */
  duration?: number;
  /** Delay before this run starts, in ms. Use multiples of the 140ms stagger. */
  delay?: number;
  /** How many characters ahead of the reveal front show scrambled glyphs. */
  window?: number;
  className?: string;
};

/**
 * Scramble-decode for short monospaced labels (Article Headings template).
 * Characters resolve left to right on an eased budget; a short window ahead
 * of the front cycles random glyphs and everything past it stays blank, so the
 * mono width never shifts. Screen readers get the plain text throughout.
 */
export function DecodeText({ text, duration = 560, delay = 0, window: scramble = 5, className }: DecodeTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(() => text.replace(/\S/g, " "));

  useEffect(() => {
    if (reduce || !inView) return;
    const chars = [...text];
    let frame = 0;
    let start = 0;
    let lastSwap = 0;
    let noise = chars.map(() => GLYPHS[(Math.random() * GLYPHS.length) | 0]);

    const step = (now: number) => {
      if (!start) start = now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const front = easeOutCubic(t) * chars.length;
      if (now - lastSwap > 45) {
        noise = chars.map(() => GLYPHS[(Math.random() * GLYPHS.length) | 0]);
        lastSwap = now;
      }
      setShown(
        chars
          .map((c, i) => {
            if (i < front || c === " ") return c;
            return i < front + scramble ? noise[i] : " ";
          })
          .join("")
      );
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, text, duration, delay, scramble]);

  return (
    <span ref={ref} className={cn("whitespace-pre-wrap", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reduce ? text : shown}</span>
    </span>
  );
}
