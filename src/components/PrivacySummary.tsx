import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Fingerprint,
  Mic,
  Play,
  ShieldCheck,
  Trash2,
  VolumeX,
  X,
  type LucideIcon,
} from 'lucide-react';
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

// Illustrative values only: what a voiceprint looks like, not a real one.
const NUMBERS = ['0.12', '-0.84', '0.37', '0.05', '-0.61', '0.93', '-0.18', '0.44', '-0.27', '0.71', '0.09', '-0.52'];
const BARS = Array.from({ length: 28 }, (_, i) => 18 + Math.abs(Math.sin(i * 0.8) * Math.cos(i * 0.31)) * 70);

const STEPS = ['Record a short sample', 'Turn it into numbers', 'Delete the recording'];
const TIMINGS = [2000, 2000, 2000, 2800]; // stage 3 holds the finished state

// TODO(team): confirm "No call recordings kept" matches the product before launch. Do not change to "compliant" without legal review.
export const PrivacySummary: React.FC = () => {
  const { privacySummary } = CONTENT;
  const rest = privacySummary.blocks.slice(1);

  return (
    <Section id="privacy" labelledBy="privacy-heading">
      <Aurora flip tone="ok" />
      <SectionHeading
        id="privacy-heading"
        index="11"
        eyebrow="Privacy"
        title="Built to protect privacy, *not collect it*"
        lede="Consent first. Voiceprints, not recordings. Nothing kept from your calls. You stay in control of your family's voice."
      />

      <Reveal className="mx-auto max-w-[1400px]">
        <VoiceprintExplainer />
      </Reveal>

      <div className="mx-auto mt-4 grid max-w-[1400px] gap-4 md:grid-cols-3">
        {rest.map((b, i) => {
          const Icon = ICONS[b.icon] ?? FileText;
          return (
            <Reveal key={b.title} delay={0.08 * (i + 1)} className="h-full">
              <SpotlightCard className="flex h-full items-start gap-4 p-6">
                <IconBadge icon={Icon} />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-fg">{b.title}</h3>
                  <p className="mt-1.5 text-fg-muted">{b.description}</p>
                </div>
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
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line/15 bg-brand/10 text-brand transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
  );
}

/**
 * Shows, rather than tells, what "voiceprint, not recording" means: a sample
 * is recorded, turned into numbers, and the recording is deleted. Then the
 * visitor can try to play the voiceprint back, and nothing plays.
 */
function VoiceprintExplainer() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [stage, setStage] = useState(reduce ? 3 : 0);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (reduce || !inView) return;
    const t = window.setTimeout(() => setStage((s) => (s + 1) % 4), TIMINGS[stage]);
    return () => window.clearTimeout(t);
  }, [stage, inView, reduce]);

  const encoded = stage >= 1;
  const deleted = stage >= 2;

  return (
    <div ref={ref} className="liquid-glass grid gap-8 overflow-hidden rounded-panel p-6 sm:p-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
      {/* Left: the animated sequence */}
      <div className="min-w-0">
        <div className="flex items-start gap-4">
          <IconBadge icon={Fingerprint} />
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Voiceprints, not recordings</h3>
            <p className="mt-1.5 text-fg-muted">Here is exactly what happens to a family member's voice when they enrol.</p>
          </div>
        </div>

        <ol className="mt-7 grid grid-cols-3 gap-2" aria-label="What happens to your voice">
          {STEPS.map((label, i) => {
            const active = reduce || stage === i || (stage === 3 && i === 2);
            const done = reduce || stage > i;
            return (
              <li
                key={label}
                className={cn(
                  'rounded-2xl border px-3 py-2.5 transition-colors duration-500',
                  active ? 'border-brand/40 bg-brand/10' : 'border-line/10 bg-canvas/40'
                )}
              >
                <span className={cn('flex items-center gap-1.5 font-mono text-[11px]', done || active ? 'text-brand' : 'text-fg-subtle')}>
                  {done && !active ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : `0${i + 1}`}
                </span>
                <span className={cn('mt-1 block text-[13px] font-medium leading-snug sm:text-sm', active ? 'text-fg' : 'text-fg-muted')}>{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 grid items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* The recording */}
          <div className="relative overflow-hidden rounded-2xl border border-line/15 bg-canvas/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-fg">
                <Mic className="h-4 w-4 text-brand" aria-hidden="true" />
                Voice recording
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-500',
                  deleted ? 'bg-risk/15 text-risk' : 'bg-brand/10 text-brand'
                )}
              >
                {deleted ? 'Deleted' : stage === 0 ? 'Recording' : 'Temporary'}
              </span>
            </div>
            <div className="relative mt-4 flex h-20 items-center gap-[3px]" aria-hidden="true">
              {BARS.map((h, i) => (
                <motion.span
                  key={i}
                  className="w-full rounded-full bg-brand/70"
                  style={{ height: `${h}%` }}
                  animate={{
                    scaleY: deleted ? 0.08 : stage === 0 && !reduce ? [0.35, 1, 0.5, 1] : 1,
                    opacity: deleted ? 0.25 : 1,
                  }}
                  transition={
                    stage === 0 && !reduce
                      ? { duration: 1.2, delay: i * 0.02, repeat: Infinity, repeatType: 'mirror' }
                      : { duration: 0.6, delay: deleted ? i * 0.012 : 0 }
                  }
                />
              ))}
              <AnimatePresence>
                {deleted && (
                  <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-risk text-canvas shadow-lg">
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center py-1 sm:py-0" aria-hidden="true">
            <span
              className={cn(
                'grid h-10 w-10 rotate-90 place-items-center rounded-full border transition-colors duration-500 sm:rotate-0',
                encoded ? 'border-brand/40 bg-brand-solid text-on-brand' : 'border-line/20 text-fg-subtle'
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          {/* The voiceprint */}
          <div className="rounded-2xl border border-line/15 bg-canvas/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-fg">
                <Fingerprint className="h-4 w-4 text-brand" aria-hidden="true" />
                Voiceprint
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-500',
                  encoded ? 'bg-ok/15 text-ok' : 'bg-line/10 text-fg-subtle'
                )}
              >
                {encoded ? 'Kept' : 'Waiting'}
              </span>
            </div>
            <motion.div
              className="mt-4 grid grid-cols-4 gap-1.5 font-mono text-[11px] text-fg-muted"
              animate={tried && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.45 }}
            >
              {NUMBERS.map((n, i) => (
                <motion.span
                  key={i}
                  className={cn('rounded-md bg-surface px-1 py-1 text-center', i % 5 === 0 && encoded && 'text-brand')}
                  animate={{ opacity: encoded ? 1 : 0.25 }}
                  transition={{ duration: 0.3, delay: encoded && stage === 1 ? i * 0.06 : 0 }}
                >
                  {encoded ? n : '·'}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle">Illustration · numbers are examples</p>
      </div>

      {/* Right: try it, and what we keep */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="rounded-2xl border border-line/15 bg-canvas/50 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Try it</p>
          <p className="mt-2 text-fg">Can anyone turn a voiceprint back into your voice?</p>
          <button
            type="button"
            onClick={() => setTried(true)}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-solid px-5 text-sm font-semibold text-on-brand shadow-glow transition-transform active:scale-[0.97]"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Play the voiceprint
          </button>
          <div className="min-h-[3.5rem]" aria-live="polite">
            <AnimatePresence>
              {tried && (
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-start gap-2 text-sm leading-snug text-fg"
                >
                  <VolumeX className="mt-0.5 h-4 w-4 shrink-0 text-risk" aria-hidden="true" />
                  Nothing plays. A voiceprint is only numbers, so it can't be turned back into your voice.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-2xl border border-ok/25 bg-ok/[0.06] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ok">What we keep</p>
            <ul className="mt-3 space-y-2.5 text-[15px] text-fg">
              <li className="flex gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-ok" strokeWidth={3} aria-hidden="true" />
                The voiceprint, until you delete it
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-risk/25 bg-risk/[0.05] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-risk">What we never keep</p>
            <ul className="mt-3 space-y-2.5 text-[15px] text-fg">
              <li className="flex gap-2">
                <X className="mt-1 h-4 w-4 shrink-0 text-risk" strokeWidth={3} aria-hidden="true" />
                The recording of your sample
              </li>
              <li className="flex gap-2">
                <X className="mt-1 h-4 w-4 shrink-0 text-risk" strokeWidth={3} aria-hidden="true" />
                Audio from your calls
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
