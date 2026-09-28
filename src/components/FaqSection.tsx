import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BellOff, Fingerprint, Plus, Smartphone, Trash2, UserX, type LucideIcon } from 'lucide-react';
import { Aurora, Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CONTENT } from '@/content';

// The facts families ask about most, each backed by the answers below.
const GOOD_TO_KNOW: { icon: LucideIcon; text: string }[] = [
  { icon: UserX, text: 'The caller installs nothing.' },
  { icon: Smartphone, text: 'Works on any phone, through call forwarding.' },
  { icon: BellOff, text: 'It warns. It never blocks a call.' },
  { icon: Fingerprint, text: 'Voiceprints, never recordings.' },
  { icon: Trash2, text: 'Delete your voiceprint anytime.' },
];

export const FaqSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  const { faq } = CONTENT;
  const reduce = useReducedMotion();

  return (
    <Section id="faq" labelledBy="faq-heading">
      <Aurora tone="brand" />
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="faq-heading" index="13" eyebrow="FAQ" title="Questions, *answered*" className="mb-8 lg:mb-10" />
          <Reveal>
            <div className="liquid-glass rounded-panel p-6 sm:p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Good to know</p>
              <ul className="mt-4 space-y-3.5">
                {GOOD_TO_KNOW.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="pt-1 text-[15px] leading-snug text-fg">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/10 pt-5">
                <p className="text-sm text-fg-muted">Something else? We read every message.</p>
                <Button href="#work-with-us" variant="secondary" size="sm" arrow className="h-11">
                  Contact us
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="divide-y divide-line/15 border-y border-line/15">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.question} delay={i * 0.05}>
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span
                      className={cn(
                        'font-display text-xl font-medium tracking-tight transition-colors sm:text-2xl',
                        isOpen ? 'text-brand' : 'text-fg group-hover:text-brand'
                      )}
                    >
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        'grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300',
                        isOpen ? 'rotate-45 border-transparent bg-brand-solid text-on-brand' : 'border-line/20 text-fg group-hover:border-brand/50'
                      )}
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-lg leading-relaxed text-fg-muted">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
