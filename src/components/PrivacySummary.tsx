import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Fingerprint, CheckCircle2, ShieldCheck, FileText, type LucideIcon } from 'lucide-react';
import { Aurora, Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { SpotlightCard } from '@/components/ui/tilt-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CONTENT } from '@/content';

const ICONS: Record<string, LucideIcon> = {
  fingerprint: Fingerprint,
  'check-circle': CheckCircle2,
  'shield-check': ShieldCheck,
  'file-text': FileText,
};

// TODO(team): confirm "No call recordings kept" matches the product before launch. Do not change to "compliant" without legal review.
export const PrivacySummary: React.FC = () => {
  const { privacySummary } = CONTENT;
  const [first, ...rest] = privacySummary.blocks;
  const FirstIcon = ICONS[first.icon] ?? FileText;

  return (
    <Section id="privacy" labelledBy="privacy-heading">
      <Aurora flip tone="ok" />
      <SectionHeading id="privacy-heading" index="11" eyebrow="Privacy" title="Built to protect privacy, *not collect it*" lede="Consent first. Voiceprints, not recordings. Nothing kept from your calls. You stay in control of your family's voice." />

      <div className="mx-auto grid max-w-[1400px] gap-4 lg:grid-cols-3 lg:grid-rows-3">
        {/* Feature card: voice becomes numbers */}
        <Reveal className="lg:col-span-2 lg:row-span-3">
          <SpotlightCard className="h-full p-7 sm:p-10">
            <IconBadge icon={FirstIcon} />
            <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{first.title}</h3>
            <p className="mt-3 max-w-lg text-lg text-fg-muted">{first.description}</p>
            <VoiceprintViz />
          </SpotlightCard>
        </Reveal>

        {rest.map((b, i) => {
          const Icon = ICONS[b.icon] ?? FileText;
          return (
            <Reveal key={b.title} delay={0.08 * (i + 1)}>
              <SpotlightCard className="h-full p-7">
                <IconBadge icon={Icon} />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-fg">{b.title}</h3>
                <p className="mt-2 text-fg-muted">{b.description}</p>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-[1400px]">
        <Button href={privacySummary.ctaLink} variant="secondary" arrow>
          {privacySummary.ctaText}
        </Button>
      </div>
    </Section>
  );
};

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line/15 bg-brand/10 text-brand transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
  );
}

/** Illustrative: a waveform turning into a row of numbers that can't be played back. */
function VoiceprintViz() {
  const reduce = useReducedMotion();
  const bars = Array.from({ length: 40 }, (_, i) => 10 + Math.abs(Math.sin(i * 0.8) * Math.cos(i * 0.31)) * 56);
  const numbers = ['0.12', '-0.84', '0.37', '0.05', '-0.61', '0.93', '-0.18', '0.44', '-0.27', '0.71', '0.09', '-0.52'];
  return (
    <div aria-hidden="true" className="mt-10 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
      <div className="flex h-24 items-center gap-[3px] rounded-2xl border border-line/10 bg-canvas/60 px-4">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="w-full rounded-full bg-brand/70"
            style={{ height: h }}
            initial={reduce ? false : { scaleY: 0.1 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.015, duration: 0.5 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-1 font-mono text-xs text-fg-subtle">
        <span className="h-px w-8 bg-line/30" />
        <span className="rounded-full border border-line/20 px-2 py-1">encode</span>
        <span className="h-px w-8 bg-line/30" />
      </div>
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-line/10 bg-canvas/60 p-3 font-mono text-[11px] text-fg-muted">
        {numbers.map((n, i) => (
          <motion.span
            key={i}
            className={cn('rounded-md bg-surface px-1.5 py-1 text-center', i % 5 === 0 && 'text-brand')}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.05 }}
          >
            {n}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
