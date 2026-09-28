import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CONTENT } from '@/content';

export const FaqSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  const { faq } = CONTENT;
  const reduce = useReducedMotion();

  return (
    <Section id="faq" labelledBy="faq-heading">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="faq-heading" index="12" eyebrow="FAQ" title="Questions, *answered*" className="mb-8 lg:mb-10" />
          <Reveal>
            <p className="max-w-sm text-fg-muted">Something we haven't covered? We read every message.</p>
            <Button href="#work-with-us" variant="secondary" arrow className="mt-6">
              Contact us
            </Button>
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
