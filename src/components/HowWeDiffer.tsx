import React from 'react';
import { Check } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { SpotlightCard } from '@/components/ui/tilt-card';
import { COMPETITORS } from '@/content';

/** Side-by-side with the tools people already know, as publicly described. */
export const HowWeDiffer: React.FC = () => (
  <Section id="compare" labelledBy="compare-heading">
    <SectionHeading
      id="compare-heading"
      index="08"
      eyebrow="How we're different"
      title="Others flag scam signals. *We verify the person.*"
      lede="Most tools tell you a call looks suspicious. SatyaCheck checks whether it is really your family member, and quotes the evidence."
    />

    <div className="mx-auto grid max-w-[1400px] gap-4 md:grid-cols-3">
      {COMPETITORS.rows.map((c, i) => (
        <Reveal key={c.name} delay={i * 0.08} className="h-full">
          <SpotlightCard className="flex h-full flex-col p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">Compared with</p>
            <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">{c.name}</h3>
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">Their approach</p>
              <p className="mt-2 text-fg-muted">{c.approach}</p>
            </div>
            <div className="mt-auto pt-6">
              <div className="rounded-2xl border border-brand/25 bg-brand/[0.06] p-4">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  SatyaCheck
                </p>
                <p className="mt-2 font-medium text-fg">{c.edge}</p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
    <p className="mx-auto mt-6 max-w-[1400px] text-xs text-fg-subtle">{COMPETITORS.note}</p>
  </Section>
);
