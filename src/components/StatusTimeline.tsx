import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { PulseDot } from '@/components/ui/bits';
import { cn } from '@/lib/utils';
import { CONTENT } from '@/content';

export const StatusTimeline: React.FC = () => {
  const { status } = CONTENT;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] });
  // The track fills to the "In progress" node: we are part-way along.
  const fill = useTransform(scrollYProgress, [0, 1], [reduce ? 0.5 : 0, 0.5]);

  return (
    <Section id="timeline" labelledBy="status-heading">
      <SectionHeading id="status-heading" index="06" eyebrow={status.eyebrow} title="Early, and *honest about it*" />

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
