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
  color = "rgb(var(--brand))",
  trackColor = "rgb(var(--line) / 0.15)",
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
