import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { Counter, PulseDot } from '@/components/ui/bits';
import { cn } from '@/lib/utils';
import { CONTENT, VALIDATION } from '@/content';

export const StatusTimeline: React.FC = () => {
  const { status } = CONTENT;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] });
  // The track fills to the "In progress" node: we are part-way along.
  const fill = useTransform(scrollYProgress, [0, 1], [reduce ? 0.5 : 0, 0.5]);

  return (
    <Section id="timeline" labelledBy="status-heading">
      <SectionHeading id="status-heading" index="09" eyebrow={status.eyebrow} title="Early, and *honest about it*" />

      <div ref={ref} className="relative mx-auto max-w-[1400px]">
        {/* Track (desktop) */}
        <div aria-hidden="true" className="absolute left-[16.66%] right-[16.66%] top-6 hidden h-[2px] bg-line/15 md:block">
          <motion.div className="h-full origin-left bg-gradient-to-r from-brand-solid to-brand-hi" style={{ scaleX: fill }} />
        </div>

        <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
          {status.timeline.map((item, i) => {
            const done = item.state === 'Done';
            const doing = item.state === 'In progress';
            return (
              <Reveal as="li" key={item.state} delay={i * 0.12} className="relative flex flex-col md:items-center">
                <div className="relative z-10 mb-6 flex items-center gap-4 md:flex-col md:gap-0">
                  <span
                    className={cn(
                      'relative grid h-12 w-12 place-items-center rounded-full border-2',
                      done && 'border-transparent bg-brand-solid text-on-brand shadow-glow',
                      doing && 'border-brand bg-canvas text-brand',
                      !done && !doing && 'border-dashed border-line/30 bg-canvas text-fg-subtle'
                    )}
                  >
                    {doing && <span className="absolute inset-0 rounded-full bg-brand/30 motion-safe:animate-pulse-ring" aria-hidden="true" />}
                    {done ? (
                      <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                    ) : doing ? (
                      <PulseDot />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted md:mt-4">
                    {String(i + 1).padStart(2, '0')} · {item.state}
                  </span>
                </div>
                <div
                  className={cn(
                    'h-full w-full rounded-card border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-8',
                    doing ? 'border-brand/40 bg-surface shadow-card' : 'border-line/15 bg-surface/60'
                  )}
                >
                  <p className="text-[17px] leading-relaxed text-fg">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <Validation />

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 rounded-card border border-dashed border-line/25 p-6 sm:flex-row sm:items-center sm:p-8">
          <p className="font-display text-xl font-medium tracking-tight text-fg sm:text-2xl">{status.closingLine}</p>
          <Button href="#work-with-us" variant="secondary" arrow className="shrink-0">
            Ask us
          </Button>
        </Reveal>
      </div>
    </Section>
  );
};

/** What we have tested, including what failed, and what surveys say people want. */
function Validation() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-16 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Tested honestly, limits included */}
      <Reveal className="h-full">
        <div className="h-full rounded-panel border border-white/10 bg-night p-6 text-white sm:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-300">Working system</p>
          <h3 className="mt-3 font-display text-[clamp(24px,2.6vw,38px)] font-semibold leading-tight tracking-[-0.03em]">
            Tested honestly, <span className="font-serif font-normal italic text-[#b9c1ff]">limits included</span>
          </h3>

          <div className="mt-8 space-y-4" role="list" aria-label="Similarity to the enrolled voiceprint">
            {VALIDATION.similarity.map((b, i) => (
              <div key={b.label} role="listitem">
                <div className="flex justify-between text-sm">
                  <span className="text-white/75">{b.label}</span>
                  <span className="font-mono text-white">{b.value.toFixed(2)}</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={cn('h-full rounded-full', i === 1 ? 'bg-gradient-to-r from-rose-500 to-rose-300' : 'bg-gradient-to-r from-[#3d4bff] to-[#a58bff]')}
                    initial={reduce ? false : { width: '0%' }}
                    whileInView={{ width: `${b.value * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 border-l-2 border-rose-400 pl-4 text-[15px] leading-relaxed text-white/85">{VALIDATION.similarityTakeaway}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {VALIDATION.tests.map((t) => (
              <div key={t.value} className={cn('rounded-2xl border-t-2 bg-white/[0.04] p-4', t.tone === 'ok' ? 'border-emerald-400' : 'border-rose-400')}>
                <p className={cn('font-display text-2xl font-bold tracking-tight', t.tone === 'ok' ? 'text-white' : 'text-rose-300')}>{t.value}</p>
                <p className="mt-1 text-sm leading-snug text-white/65">{t.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-white/45">{VALIDATION.similarityNote}</p>
        </div>
      </Reveal>

      {/* What people told surveys */}
      <div className="flex flex-col gap-4">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">Do people want this?</p>
        </Reveal>
        {VALIDATION.surveys.map((sv, i) => (
          <Reveal key={sv.label} delay={i * 0.08} className="flex-1">
            <div className="flex h-full gap-5 rounded-card border-l-2 border-brand bg-surface/70 p-6">
              <p className="shrink-0 font-display text-5xl font-semibold tracking-[-0.05em]">
                <Counter to={sv.value} suffix="%" className="gradient-text" />
              </p>
              <div>
                <p className="text-fg">{sv.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-fg-subtle">{sv.source}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
