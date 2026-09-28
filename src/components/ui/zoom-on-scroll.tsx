import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Apple-style entrance for large panels: the panel grows from slightly
 * smaller, with rounder corners, into full size as it scrolls into view.
 * Transform and radius only, so it stays smooth. Static under reduced motion.
 */
export function ZoomOnScroll({ children, className, radius = 32 }: { children: ReactNode; className?: string; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [reduce ? radius : radius * 2, radius]);
  return (
    <motion.div ref={ref} style={{ scale, y, borderRadius }} className={cn("origin-top overflow-hidden", className)}>
      {children}
    </motion.div>
  );
}
