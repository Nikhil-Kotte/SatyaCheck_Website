import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhoneOff, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = 0 | 1 | 2 | 3 | 4 | 5;
// 0 ringing, 1-3 checks appear, 4 warning, 5 hold then restart

const CHECKS = [
  { label: "Voice match", value: "Weak", tone: "text-warn", dot: "bg-warn" },
  { label: "Synthetic speech", value: "Detected", tone: "text-risk", dot: "bg-risk" },
  { label: "Scam script", value: "Family emergency", tone: "text-risk", dot: "bg-risk" },
];

const TIMINGS: Record<Stage, number> = { 0: 1600, 1: 800, 2: 800, 3: 1000, 4: 4200, 5: 600 };

/**
 * The hero's signature animation: a phone call screen where three checks
 * tick in one by one, then a warning appears with the quoted scam line.
 * Loops. Under reduced motion it shows the final state, still.
 */
export function VerdictCard({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>(0);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setStage((s) => ((s + 1) % 6) as Stage), TIMINGS[stage]);
    return () => window.clearTimeout(t);
  }, [stage, reduce]);

  const currentStage: Stage = reduce ? 4 : stage;
  const visible = currentStage === 5 ? 0 : currentStage;
  const flagged = visible >= 4;

  return (
    <figure className={cn("mx-auto w-full max-w-[318px]", className)}>
      <div
        role="img"
        aria-label="Illustration: SatyaCheck warns that a caller claiming to be Rahul may not be him, because the voice match is weak, synthetic speech is detected and the conversation matches a family-emergency scam."
        className="relative rounded-[46px] bg-[#0B0D2A] p-[10px] shadow-[0_50px_100px_-30px_rgb(var(--shadow)/0.7),inset_0_0_0_1.5px_rgb(255_255_255/0.08)] ring-1 ring-white/10"
      >
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-28 h-10 w-[3px] rounded-l bg-[#1a1d45]" aria-hidden="true" />
        <span className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-[#1a1d45]" aria-hidden="true" />

        <motion.div
          className="relative flex min-h-[570px] flex-col overflow-hidden rounded-[37px] bg-surface px-5 pb-6 pt-11"
          animate={{ opacity: currentStage === 5 ? 0.35 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Ambient glow that turns red when the call is flagged */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
            animate={{ backgroundColor: flagged ? "rgb(var(--risk) / 0.28)" : "rgb(var(--brand) / 0.22)" }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute left-1/2 top-3 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-[#0B0D2A]" />

          <p className="relative text-center font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-fg-muted">
            {flagged ? "Call flagged" : "Incoming call"}
          </p>
          <p className="relative mt-1.5 text-center font-display text-[28px] font-bold tracking-tight text-fg">Rahul (son)</p>
          <p className="relative mt-0.5 text-center font-mono text-xs text-fg-subtle">+91 98••• ••210</p>

          <Waveform live={!reduce && currentStage < 4} flagged={flagged} />

          <div className="mt-1 h-5 text-center text-xs font-medium">
            {currentStage < 4 && !reduce && <ShimmerLabel text="SatyaCheck is listening…" />}
          </div>

          <ul className="mt-2 space-y-2">
            {CHECKS.map((c, i) => (
              <AnimatePresence key={c.label}>
                {visible > i && (
                  <motion.li
                    initial={{ opacity: 0, x: -14, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between rounded-xl border border-line/10 bg-canvas/70 px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-[13px] text-fg">
                      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                      {c.label}
                    </span>
                    <span className={cn("font-display text-[13px] font-semibold", c.tone)}>{c.value}</span>
                  </motion.li>
                )}
              </AnimatePresence>
            ))}
          </ul>

          <AnimatePresence>
            {flagged && (
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative mt-4"
              >
                <div className="rounded-2xl border border-risk/30 bg-risk/10 p-4">
                  <p className="flex items-center gap-2 font-display text-lg font-bold leading-tight text-risk">
                    <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
                    Stop. This may not be Rahul.
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-fg">
                    He said <span className="rounded bg-risk/15 px-1 font-medium">“Don’t tell Papa. Send it now, I’ll explain later.”</span>{" "}
                    <span className="text-fg-muted">This matches a known family-emergency scam.</span>
                  </p>
                </div>
                <div className="mt-3 grid gap-2">
                  <span className="rounded-full bg-brand-solid py-3 text-center font-display text-sm font-semibold text-on-brand">
                    Call Rahul directly
                  </span>
                  <span className="flex items-center justify-center gap-1.5 rounded-full border border-line/25 py-2.5 text-center font-display text-sm font-semibold text-fg">
                    <PhoneOff className="h-3.5 w-3.5" aria-hidden="true" />
                    Report to 1930
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <figcaption className="mt-5 text-center font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-fg-subtle">
        Illustrative screen
      </figcaption>
    </figure>
  );
}

function Waveform({ live, flagged }: { live: boolean; flagged: boolean }) {
  const bars = Array.from({ length: 32 }, (_, i) => 6 + Math.round(24 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23))));
  return (
    <div aria-hidden="true" className="relative mt-5 flex h-10 items-center justify-center gap-[3px]">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className={cn("w-[3px] rounded-full transition-colors duration-700", flagged ? "bg-risk/60" : "bg-brand/70")}
          style={{ height: h }}
          animate={live ? { scaleY: [1, 0.35 + (i % 5) * 0.16, 1] } : { scaleY: 1 }}
          transition={live ? { duration: 0.8 + (i % 4) * 0.15, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        />
      ))}
    </div>
  );
}

function ShimmerLabel({ text }: { text: string }) {
  return (
    <motion.span
      className="bg-[length:200%_100%] bg-gradient-to-r from-fg-subtle via-brand to-fg-subtle bg-clip-text text-transparent"
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      transition={{ duration: 2.2, ease: "linear", repeat: Infinity }}
    >
      {text}
    </motion.span>
  );
}
