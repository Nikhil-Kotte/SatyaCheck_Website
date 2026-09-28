import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { AudioLines, Fingerprint, ShieldCheck, type LucideIcon } from 'lucide-react';
import { ParticleMorph } from '@/components/three';
import { Eyebrow } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const STAGES: { icon: LucideIcon; label: string; title: string; body: string }[] = [
  {
    icon: AudioLines,
    label: 'Enrol',
    title: 'It starts with a few seconds of your voice.',
    body: 'A family member records a short sample, with consent. Nobody is enrolled without agreeing.',
  },
  {
    icon: Fingerprint,
    label: 'Voiceprint',
    title: 'We turn it into a voiceprint, not a recording.',
    body: "It is stored as numbers that can't be played back, and you can delete it anytime.",
  },
  {
    icon: ShieldCheck,
    label: 'Protected',
    title: 'Every call to your parents is checked against it.',
    body: 'Voice, speech and script are checked during the call, and the warning shows its reason.',
  },
];

/**
 * Apple-style pinned scene: while it holds on screen, the particles morph
 * from a waveform to a voiceprint globe to a shield, and the caption follows.
 * Under reduced motion it becomes a static shield with all three captions.
 */
export const VoiceprintJourney: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(reduce ? 2 : 0);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Hold on each shape for a while, morph in between.
  const morph = useTransform(scrollYProgress, [0, 0.14, 0.4, 0.58, 0.84, 1], [0, 0, 1, 1, 2, 2]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(morph, 'change', (v) => {
    progress.current = v;
    const next = Math.min(2, Math.round(v));
    if (next !== stage) setStage(next);
  });

  if (reduce) {
    return (
      <section className="px-fluid py-20" aria-label="How your voice protects your family">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <ParticleMorph className="absolute inset-0" getProgress={() => 2} />
          </div>
          <ol className="space-y-4">
            {STAGES.map((s) => (
              <li key={s.label} className="liquid-glass rounded-card p-6">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">{s.title}</h3>
                <p className="mt-2 text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const s = STAGES[stage];
  return (
    <section ref={ref} className="relative h-[280vh] w-full" aria-label="How your voice protects your family">
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden px-fluid">
        {/* Colour fields behind the glass */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[18%] h-[42vh] w-[42vh] rounded-full bg-brand/15 blur-[110px]" />
          <motion.div
            className="absolute bottom-[10%] right-[12%] h-[46vh] w-[46vh] rounded-full blur-[120px]"
            animate={{ backgroundColor: stage === 2 ? 'rgb(var(--ok) / 0.18)' : 'rgb(var(--brand-hi) / 0.18)' }}
            transition={{ duration: 1 }}
          />
          <div className="bg-grid mask-radial absolute inset-0 opacity-50" />
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center gap-4 pb-6 pt-24 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12 lg:py-0">
          {/* Text column on desktop; on phones its children stack around the 3D via order. */}
          <div className="contents lg:block">
            <div className="order-1">
              <Eyebrow index="10">Your voice, protected</Eyebrow>
            </div>
            <div className="liquid-glass order-3 rounded-panel p-5 sm:p-8 lg:mt-8">
              <div className="flex flex-wrap items-center gap-1.5">
                {STAGES.map((st, i) => (
                  <span
                    key={st.label}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-500',
                      i === stage ? 'bg-brand-solid text-on-brand' : 'text-fg-subtle'
                    )}
                  >
                    <st.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className={cn(i !== stage && 'hidden sm:inline')}>{st.label}</span>
                  </span>
                ))}
              </div>
              <div className="relative mt-4 min-h-[150px] sm:mt-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    aria-live="polite"
                  >
                    <h2 className="font-display text-[clamp(24px,3vw,44px)] font-semibold leading-[1.06] tracking-[-0.035em] text-fg">
                      {s.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-fg-muted sm:text-lg">{s.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-line/15">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-solid to-brand-hi" style={{ width: bar }} />
              </div>
            </div>
          </div>

          {/* 3D */}
          <div className="relative order-2 mx-auto aspect-square min-h-0 w-full max-w-[min(100%,44svh)] shrink lg:max-h-[min(80svh,720px)] lg:max-w-none">
            <div aria-hidden="true" className="absolute inset-[20%] rounded-full bg-brand/20 blur-[70px]" />
            <ParticleMorph className="absolute inset-0" getProgress={() => progress.current} />
          </div>
        </div>
      </div>
    </section>
  );
};
