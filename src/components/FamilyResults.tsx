import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, type LucideIcon } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { cn } from '@/lib/utils';
import { CONTENT } from '@/content';
import type { ResultCardItem } from '@/types';

type Id = ResultCardItem['id'];

const STYLE: Record<Id, { icon: LucideIcon; text: string; bg: string; ring: string; glow: string; caller: string }> = {
  verified: { icon: CheckCircle2, text: 'text-ok', bg: 'bg-ok', ring: 'border-ok/35', glow: 'var(--ok)', caller: 'Rahul (son)' },
  careful: { icon: AlertTriangle, text: 'text-warn', bg: 'bg-warn', ring: 'border-warn/35', glow: 'var(--warn)', caller: 'Rahul (son)' },
  'high-risk': { icon: XCircle, text: 'text-risk', bg: 'bg-risk', ring: 'border-risk/35', glow: 'var(--risk)', caller: 'Rahul (son)' },
  unverified: { icon: HelpCircle, text: 'text-neutral', bg: 'bg-neutral', ring: 'border-neutral/35', glow: 'var(--neutral)', caller: 'Unknown caller' },
};

export const FamilyResults: React.FC = () => {
  const { familyResults } = CONTENT;
  const [active, setActive] = useState<Id>('verified');
  const reduce = useReducedMotion();
  const card = familyResults.cards.find((c) => c.id === active)!;
  const st = STYLE[active];
  const ids = familyResults.cards.map((c) => c.id);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
    const next = ids[(i + dir + ids.length) % ids.length];
    setActive(next);
    document.getElementById(`result-tab-${next}`)?.focus();
  };

  return (
    <Section id="family" labelledBy="family-heading" className="overflow-hidden">
      <SectionHeading
        id="family-heading"
        index="06"
        eyebrow="What your family sees"
        title="Clear answers, *not confusing scores*"
      />

      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Call results"
          aria-orientation="vertical"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {familyResults.cards.map((c, i) => {
            const s = STYLE[c.id];
            const selected = c.id === active;
            return (
              <button
                key={c.id}
                id={`result-tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="result-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(c.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  'group relative shrink-0 rounded-2xl border text-left transition-all duration-300 lg:w-full',
                  'px-4 py-3 lg:px-6 lg:py-5',
                  selected ? cn('bg-surface shadow-card', s.ring) : 'border-line/10 hover:border-line/25 hover:bg-surface/50'
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors',
                      selected ? cn(s.bg, 'text-canvas') : 'bg-canvas-2 text-fg-muted'
                    )}
                  >
                    <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-fg lg:text-2xl">
                    {c.status}
                  </span>
                </span>
                <span
                  className={cn(
                    'hidden overflow-hidden text-fg-muted transition-all duration-500 lg:block',
                    selected ? 'mt-3 max-h-24 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  {c.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Phone */}
        <div className="relative mx-auto">
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
            animate={{ backgroundColor: `rgb(${st.glow} / 0.28)` }}
            transition={{ duration: 0.8 }}
          />
          <TiltCard max={7} className="rounded-[46px]">
            <div className="relative w-[290px] rounded-[46px] bg-[#0B0D2A] p-[10px] shadow-lift ring-1 ring-white/10 sm:w-[320px]">
              <div
                id="result-panel"
                role="tabpanel"
                aria-labelledby={`result-tab-${active}`}
                className="relative flex h-[560px] flex-col items-center overflow-hidden rounded-[37px] bg-surface px-6 pb-8 pt-14 text-center"
              >
                <div className="absolute left-1/2 top-3 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-[#0B0D2A]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">SatyaCheck in-call</p>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight text-fg">{st.caller}</p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="flex flex-1 flex-col items-center"
                    initial={reduce ? false : { opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="relative mt-12 grid h-28 w-28 place-items-center">
                      <span className={cn('absolute inset-0 rounded-full opacity-20 motion-safe:animate-pulse-ring', st.bg)} />
                      <span className={cn('absolute inset-3 rounded-full opacity-15', st.bg)} />
                      <span className={cn('relative grid h-20 w-20 place-items-center rounded-full text-canvas shadow-lg', st.bg)}>
                        <st.icon className="h-10 w-10" aria-hidden="true" />
                      </span>
                    </div>
                    <p className={cn('mt-8 font-display text-3xl font-bold tracking-tight', st.text)}>{card.status}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{card.description}</p>
                    {active === 'high-risk' && (
                      <span className="mt-auto w-full rounded-full bg-brand-solid py-3 font-display text-sm font-semibold text-on-brand">
                        Call them back directly
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      <Reveal className="mx-auto mt-14 max-w-[1400px]">
        <p className="flex items-start gap-3 rounded-2xl border border-dashed border-line/25 p-5 text-fg-muted">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
          {familyResults.note}
        </p>
      </Reveal>
    </Section>
  );
};
