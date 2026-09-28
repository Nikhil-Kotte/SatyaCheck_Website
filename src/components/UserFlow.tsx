import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { BellRing, Mic, PhoneForwarded, ScanSearch, type LucideIcon } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { USER_FLOW } from '@/content';

const ICONS: LucideIcon[] = [Mic, PhoneForwarded, ScanSearch, BellRing];

/** Enrol, route, analyse, act: the four steps, joined by a line that draws as you scroll. */
export const UserFlow: React.FC = () => {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.5'] });
  const draw = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <Section id="flow" labelledBy="flow-heading">
      <SectionHeading id="flow-heading" index="04" eyebrow="The core user flow" title="Set up once. *Protected on every call.*" />

      <ol ref={ref} className="relative mx-auto grid max-w-[1400px] gap-10 md:grid-cols-4 md:gap-6">
        {/* Connecting line: horizontal on desktop, vertical on phones */}
        <div aria-hidden="true" className="absolute left-6 right-auto top-6 hidden h-[2px] w-[calc(100%-3rem)] bg-line/15 md:block">
          <motion.div className="h-full origin-left bg-gradient-to-r from-brand-solid to-brand-hi" style={{ scaleX: draw }} />
        </div>
        <div aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-[2px] bg-line/15 md:hidden">
          <motion.div className="h-full origin-top bg-gradient-to-b from-brand-solid to-brand-hi" style={{ scaleY: draw }} />
        </div>

        {USER_FLOW.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <Reveal as="li" key={s.step} delay={i * 0.1} className="relative flex gap-5 md:flex-col md:gap-0">
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-solid text-on-brand shadow-glow">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="md:mt-6">
                <p className="font-mono text-sm text-brand">0{i + 1}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg">{s.step}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-fg-muted">{s.body}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
};
