import React from 'react';
import { ScrollWordReveal } from '@/components/motion/scroll-word-reveal';
import { Counter } from '@/components/ui/bits';
import { Reveal } from '@/components/ui/reveal';
import { SpotlightCard } from '@/components/ui/tilt-card';

const STATS = [
  { value: 3, suffix: ' sec', label: 'of audio can be enough to clone a voice', source: 'McAfee, 2023' },
  { value: 85, suffix: '%', label: 'voice match from that short clip', source: 'McAfee, 2023' },
  { value: 3, suffix: '', label: 'independent checks on every call', source: 'Voice, speech, script' },
  { value: 1, suffix: '', label: 'clear answer, with the reason on screen', source: 'No confusing scores' },
];

/** The page's one scroll-lit statement, followed by the numbers behind it. */
export const StatementBand: React.FC = () => (
  <section className="relative w-full px-fluid py-24 lg:py-36" aria-label="Why caller ID is not enough">
    <ScrollWordReveal
      text="Caller ID checks the number. Your ears check the voice. Scammers now beat both."
      className="mx-auto max-w-[22ch] justify-center text-center font-display text-[clamp(36px,5.6vw,96px)] font-semibold leading-[1.02] tracking-[-0.045em] text-fg"
      dimOpacity={0.12}
    />

    <div className="mx-auto mt-20 grid max-w-[1400px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08}>
          <SpotlightCard className="h-full p-6 sm:p-8">
            <p className="font-display text-[clamp(44px,5vw,76px)] font-semibold leading-none tracking-[-0.05em] text-fg">
              <Counter to={s.value} suffix={s.suffix} className="gradient-text" />
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted sm:text-base">{s.label}</p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">{s.source}</p>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  </section>
);
