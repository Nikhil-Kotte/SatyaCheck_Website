import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { AlertTriangle, BellRing, Check, Fingerprint, Mic, PhoneCall, PhoneForwarded, ScanSearch, ShieldCheck } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { scrollToY } from '@/lib/smooth-scroll';
import { cn } from '@/lib/utils';
import { USER_FLOW } from '@/content';

type Actor = 'son' | 'caller' | 'core' | 'mom';
type Pt = { x: number; y: number };

// Node centres in stage units (x 0..100, y 0..H), one layout per shape of screen.
const LAYOUTS: Record<'wide' | 'tall', { h: number; pos: Record<Actor, Pt> }> = {
  wide: { h: 62, pos: { son: { x: 13, y: 45 }, caller: { x: 38, y: 11 }, core: { x: 56, y: 42 }, mom: { x: 87, y: 45 } } },
  tall: { h: 134, pos: { son: { x: 23, y: 22 }, caller: { x: 77, y: 22 }, core: { x: 50, y: 59 }, mom: { x: 50, y: 110 } } },
};

// Which connections carry a signal at each step, and the colour it travels in.
const LINKS: { from: Actor; to: Actor; steps: number[]; risk?: number[] }[] = [
  { from: 'son', to: 'core', steps: [0, 3], risk: [3] },
  { from: 'caller', to: 'core', steps: [1, 2] },
  { from: 'core', to: 'mom', steps: [1, 2, 3], risk: [3] },
];

// The camera leans toward whoever is acting in each step.
const CAMERA = [
  { ry: 9, rx: 16 },
  { ry: -4, rx: 20 },
  { ry: 0, rx: 12 },
  { ry: -9, rx: 16 },
];

const ICONS = [Mic, PhoneForwarded, ScanSearch, BellRing];
const HEADLINES = [
  'Rahul records his voice once.',
  'A call claiming to be Rahul reaches Mom through SatyaCheck.',
  'SatyaCheck checks the voice, the speech and the script, live.',
  'Mom sees why it may not be Rahul. Rahul is alerted too.',
];

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

/**
 * The core user flow as a pinned 3D scene. Four actors (Rahul, a caller,
 * SatyaCheck and Mom) sit on a tilted stage; each step of scroll plays the
 * next part of the story on their screens. Under reduced motion it becomes
 * a still stage with step buttons.
 */
export const UserFlow: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <>
      <Section id="flow" labelledBy="flow-heading" className="pb-0 lg:pb-0">
        <SectionHeading
          id="flow-heading"
          index="04"
          eyebrow="The core user flow"
          title="Set up once. *Protected on every call.*"
          lede="Follow one call from start to finish. Rahul enrols his voice, a scammer calls his mother pretending to be him, and SatyaCheck steps in."
          className="mb-0 lg:mb-0"
        />
      </Section>
      {reduce ? <StaticFlow /> : <PinnedFlow />}
    </>
  );
};

function PinnedFlow() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(3, Math.max(0, Math.floor(p * 4)));
    if (next !== step) setStep(next);
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((i + 0.4) / 4) * (el.offsetHeight - window.innerHeight));
  };

  return (
    <section ref={ref} className="relative h-[400vh] w-full" aria-label="One call, step by step">
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden px-fluid">
        <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center gap-4 pb-5 pt-24 short:grid short:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] short:items-center short:pb-3 short:pt-20 lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-10 lg:py-0">
          {/* Steps: a list on desktop, one caption card on phones */}
          <div className="order-2 short:order-1 lg:order-1">
            <ol className="hidden space-y-2 lg:block" aria-label="Steps">
              {USER_FLOW.map((s, i) => {
                const Icon = ICONS[i];
                const active = i === step;
                return (
                  <li key={s.step}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active ? 'step' : undefined}
                      className={cn(
                        'w-full rounded-card p-4 text-left transition-all duration-500',
                        active ? 'liquid-glass' : 'opacity-60 hover:opacity-90'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            'grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-500',
                            active ? 'bg-brand-solid text-on-brand shadow-glow' : i < step ? 'bg-brand/15 text-brand' : 'bg-line/10 text-fg-subtle'
                          )}
                        >
                          {i < step ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle">Step 0{i + 1}</span>
                          <span className="block font-display text-xl font-semibold tracking-tight text-fg">{s.step}</span>
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.span
                            className="block overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <span className="block pt-3 font-medium text-fg">{HEADLINES[i]}</span>
                            <span className="block pt-1.5 text-[15px] leading-relaxed text-fg-muted">{s.body}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="liquid-glass rounded-panel p-5 lg:hidden">
              <div className="flex items-center gap-1.5">
                {USER_FLOW.map((s, i) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Step ${i + 1}: ${s.step}`}
                    aria-current={i === step ? 'step' : undefined}
                    className={cn(
                      'flex min-h-11 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-500',
                      i === step ? 'bg-brand-solid text-on-brand' : i < step ? 'text-brand' : 'text-fg-subtle'
                    )}
                  >
                    0{i + 1}
                    {i === step && <span>{s.step}</span>}
                  </button>
                ))}
              </div>
              <div className="relative mt-3 min-h-[128px] [@media(max-height:700px)]:min-h-[56px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                    transition={{ duration: 0.4 }}
                    aria-live="polite"
                  >
                    <p className="font-display text-lg font-semibold leading-snug tracking-tight text-fg">{HEADLINES[step]}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-fg-muted [@media(max-height:700px)]:hidden">{USER_FLOW[step].body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-line/15">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-solid to-brand-hi" style={{ width: bar }} />
            </div>
          </div>

          {/* The stage */}
          <div className="order-1 min-h-0 w-full shrink short:order-2 lg:order-2">
            <Stage step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticFlow() {
  const [step, setStep] = useState(3);
  return (
    <section className="px-fluid pb-20 pt-10" aria-label="One call, step by step">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <ol className="space-y-2">
          {USER_FLOW.map((s, i) => (
            <li key={s.step}>
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-pressed={i === step}
                className={cn('w-full rounded-card p-4 text-left', i === step ? 'liquid-glass' : 'opacity-70')}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle">Step 0{i + 1}</span>
                <span className="block font-display text-xl font-semibold text-fg">{s.step}</span>
                <span className="mt-1 block text-fg-muted">{s.body}</span>
              </button>
            </li>
          ))}
        </ol>
        <Stage step={step} still />
      </div>
    </section>
  );
}

/* ------------------------------ Stage ------------------------------ */

function Stage({ step, still = false }: { step: number; still?: boolean }) {
  const wide = useWide();
  const layout = LAYOUTS[wide ? 'wide' : 'tall'];
  const rx = useSpring(CAMERA[step].rx, { stiffness: 60, damping: 18 });
  const ry = useSpring(CAMERA[step].ry, { stiffness: 60, damping: 18 });
  // Phones get half the tilt, so lifted actors never spill into the caption.
  const tilt = wide ? 1 : 0.5;
  useEffect(() => {
    rx.set(still ? 10 * tilt : CAMERA[step].rx * tilt);
    ry.set(still ? 0 : CAMERA[step].ry * tilt);
  }, [step, still, rx, ry, tilt]);

  const at = (a: Actor) => layout.pos[a];

  return (
    <div
      className="relative mx-auto w-full max-w-[min(100%,calc((100svh-340px)*0.74))] md:max-w-none [@media(max-height:700px)_and_(orientation:portrait)]:max-w-[min(100%,calc((100svh-280px)*0.64))] short:max-w-[min(100%,calc((100svh-100px)*1.55))]"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="flow-stage relative w-full [--u:1.9cqw] md:[--u:1.05cqw]"
        style={{ aspectRatio: `100 / ${layout.h}`, containerType: 'inline-size', rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      >
        {/* Floor */}
        <div
          aria-hidden="true"
          className="bg-grid absolute inset-[-6%] rounded-[36px] border border-line/10 bg-surface/30"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Connections */}
        <svg viewBox={`0 0 100 ${layout.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {LINKS.map((l) => {
            const a = at(l.from);
            const b = at(l.to);
            const on = l.steps.includes(step);
            const risk = l.risk?.includes(step);
            const reverse = l.from === 'son' && step === 3; // the alert goes back to Rahul
            const d = reverse ? `M${b.x} ${b.y} L${a.x} ${a.y}` : `M${a.x} ${a.y} L${b.x} ${b.y}`;
            const color = risk ? 'rgb(var(--risk))' : 'rgb(var(--brand))';
            return (
              <g key={`${l.from}-${l.to}`}>
                <path d={d} stroke="rgb(var(--line) / 0.25)" strokeWidth={0.35} strokeDasharray="1 1.2" fill="none" />
                {on && (
                  <>
                    <motion.path
                      d={d}
                      stroke={color}
                      strokeWidth={0.55}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                    {!still &&
                      [0, 0.5].map((delay) => (
                        <circle key={delay} r={1.1} fill={color}>
                          <animateMotion dur="1.6s" begin={`${delay * 1.6}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      ))}
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Actors */}
        <Node pos={at('son')} h={layout.h} lift={step === 0 || step === 3} dim={false}>
          <Phone name="Rahul (son)" tone={step === 3 ? 'risk' : 'brand'}>
            <SonScreen step={step} />
          </Phone>
        </Node>
        <Node pos={at('caller')} h={layout.h} lift={step === 1} dim={step === 0}>
          <Phone name="Unknown number" tone="warn" small>
            <CallerScreen step={step} />
          </Phone>
        </Node>
        <Node pos={at('core')} h={layout.h} lift={step === 2} dim={false}>
          <Core step={step} />
        </Node>
        <Node pos={at('mom')} h={layout.h} lift={step >= 1} dim={step === 0}>
          <Phone name="Mom" tone={step === 3 ? 'risk' : 'brand'}>
            <MomScreen step={step} />
          </Phone>
        </Node>
      </motion.div>
    </div>
  );
}

function Node({ pos, h, lift, dim, children }: { pos: Pt; h: number; lift: boolean; dim: boolean; children: ReactNode }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${pos.x}%`, top: `${(pos.y / h) * 100}%`, x: '-50%', y: '-50%', transformStyle: 'preserve-3d' }}
      animate={{ z: lift ? 70 : 0, opacity: dim ? 0.35 : 1, scale: lift ? 1.04 : 0.96 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Actors ------------------------------ */

const fs = (n: number) => ({ fontSize: `max(var(--fmin), calc(var(--u) * ${n}))` });

function Phone({ name, tone, small = false, children }: { name: string; tone: 'brand' | 'risk' | 'warn'; small?: boolean; children: ReactNode }) {
  const glow = { brand: 'shadow-[0_24px_50px_-18px_rgb(var(--brand)/0.55)]', risk: 'shadow-[0_24px_50px_-14px_rgb(var(--risk)/0.7)]', warn: 'shadow-[0_24px_50px_-18px_rgb(var(--warn)/0.5)]' }[tone];
  return (
    <div
      className={cn('rounded-[calc(var(--u)*2.6)] bg-[#0B0D2A] p-[calc(var(--u)*0.55)] ring-1 ring-white/10 transition-shadow duration-700', glow)}
      style={{ width: `calc(var(--u) * ${small ? 15 : 17})` }}
    >
      <div className="relative flex flex-col overflow-hidden rounded-[calc(var(--u)*2.1)] bg-surface px-[calc(var(--u)*1.1)] pb-[calc(var(--u)*1.2)] pt-[calc(var(--u)*2)]" style={{ height: `calc(var(--u) * ${small ? 17 : 22})` }}>
        <span className="absolute left-1/2 top-[calc(var(--u)*0.6)] h-[calc(var(--u)*0.8)] w-[calc(var(--u)*4.5)] -translate-x-1/2 rounded-full bg-[#0B0D2A]" />
        <p className="truncate text-center font-display font-semibold tracking-tight text-fg" style={fs(1.25)}>
          {name}
        </p>
        <div className="relative mt-[calc(var(--u)*0.8)] flex-1">
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const screen = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
};

function Pill({ tone, children }: { tone: 'brand' | 'risk' | 'ok' | 'warn'; children: ReactNode }) {
  const c = { brand: 'bg-brand/10 text-brand', risk: 'bg-risk/12 text-risk', ok: 'bg-ok/12 text-ok', warn: 'bg-warn/12 text-warn' }[tone];
  return (
    <span className={cn('flex items-center justify-center gap-1 rounded-full px-[calc(var(--u)*0.8)] py-[calc(var(--u)*0.35)] text-center font-medium leading-tight', c)} style={fs(0.95)}>
      {children}
    </span>
  );
}

function Bars({ tone }: { tone: 'brand' | 'risk' | 'warn' }) {
  const c = { brand: 'bg-brand/70', risk: 'bg-risk/70', warn: 'bg-warn/70' }[tone];
  return (
    <span className="flex h-[calc(var(--u)*2.6)] items-center justify-center gap-[calc(var(--u)*0.22)]" aria-hidden="true">
      {Array.from({ length: 11 }, (_, i) => (
        <motion.span
          key={i}
          className={cn('w-[calc(var(--u)*0.32)] rounded-full', c)}
          style={{ height: `${30 + Math.abs(Math.sin(i * 1.3)) * 70}%` }}
          animate={{ scaleY: [0.4, 1, 0.5] }}
          transition={{ duration: 0.8 + (i % 3) * 0.2, repeat: Infinity, repeatType: 'mirror' }}
        />
      ))}
    </span>
  );
}

function SonScreen({ step }: { step: number }) {
  if (step === 0)
    return (
      <motion.div key="rec" {...screen} className="flex h-full flex-col items-center justify-between">
        <span className="relative grid h-[calc(var(--u)*4.2)] w-[calc(var(--u)*4.2)] place-items-center rounded-full bg-brand-solid text-on-brand">
          <span className="absolute inset-0 rounded-full bg-brand-solid/60 motion-safe:animate-pulse-ring" />
          <Mic className="relative h-[calc(var(--u)*1.8)] w-[calc(var(--u)*1.8)]" aria-hidden="true" />
        </span>
        <span className="cq-hide"><Bars tone="brand" /></span>
        <Pill tone="ok">
          <Check className="h-[1em] w-[1em]" strokeWidth={3} aria-hidden="true" /> Consent given
        </Pill>
      </motion.div>
    );
  if (step === 3)
    return (
      <motion.div key="alert" {...screen} className="flex h-full flex-col justify-center gap-[calc(var(--u)*0.8)]">
        <span className="mx-auto grid h-[calc(var(--u)*3.4)] w-[calc(var(--u)*3.4)] place-items-center rounded-full bg-risk text-canvas">
          <BellRing className="h-[calc(var(--u)*1.6)] w-[calc(var(--u)*1.6)]" aria-hidden="true" />
        </span>
        <p className="cq-hide text-center font-semibold leading-tight text-fg" style={fs(1.05)}>
          Someone is calling Mom with your voice
        </p>
        <Pill tone="brand">Call Mom now</Pill>
      </motion.div>
    );
  return (
    <motion.div key="idle" {...screen} className="flex h-full flex-col items-center justify-center gap-[calc(var(--u)*0.8)]">
      <Fingerprint className="h-[calc(var(--u)*3.4)] w-[calc(var(--u)*3.4)] text-brand" aria-hidden="true" />
      <Pill tone="ok">
        <Check className="h-[1em] w-[1em]" strokeWidth={3} aria-hidden="true" /> Voice enrolled
      </Pill>
    </motion.div>
  );
}

function CallerScreen({ step }: { step: number }) {
  if (step === 0)
    return (
      <motion.div key="wait" {...screen} className="flex h-full items-center justify-center">
        <p className="text-center text-fg-subtle" style={fs(1)}>
          Not calling yet
        </p>
      </motion.div>
    );
  return (
    <motion.div key="call" {...screen} className="flex h-full flex-col items-center justify-between">
      <PhoneCall className="h-[calc(var(--u)*2.2)] w-[calc(var(--u)*2.2)] text-warn" aria-hidden="true" />
      <Bars tone="warn" />
      <p className="cq-hide text-center italic leading-tight text-fg" style={fs(0.95)}>
        “Maa, it's me. Send it now.”
      </p>
    </motion.div>
  );
}

function MomScreen({ step }: { step: number }) {
  if (step === 0)
    return (
      <motion.div key="idle" {...screen} className="flex h-full flex-col items-center justify-center gap-[calc(var(--u)*0.8)]">
        <ShieldCheck className="h-[calc(var(--u)*3.4)] w-[calc(var(--u)*3.4)] text-ok" aria-hidden="true" />
        <Pill tone="ok">Protected</Pill>
      </motion.div>
    );
  if (step === 1)
    return (
      <motion.div key="ring" {...screen} className="flex h-full flex-col items-center justify-center gap-[calc(var(--u)*0.8)]">
        <span className="relative grid h-[calc(var(--u)*4)] w-[calc(var(--u)*4)] place-items-center rounded-full bg-ok text-canvas">
          <span className="absolute inset-0 rounded-full bg-ok/60 motion-safe:animate-pulse-ring" />
          <PhoneCall className="relative h-[calc(var(--u)*1.8)] w-[calc(var(--u)*1.8)]" aria-hidden="true" />
        </span>
        <p className="text-center font-semibold text-fg" style={fs(1.05)}>
          Incoming: Rahul?
        </p>
      </motion.div>
    );
  if (step === 2)
    return (
      <motion.div key="check" {...screen} className="flex h-full flex-col items-center justify-center gap-[calc(var(--u)*0.8)]">
        <Bars tone="brand" />
        <p className="text-center font-medium text-brand" style={fs(1)}>
          SatyaCheck is listening…
        </p>
      </motion.div>
    );
  return (
    <motion.div key="warn" {...screen} className="flex h-full flex-col justify-center gap-[calc(var(--u)*0.7)]">
      <div className="rounded-[calc(var(--u)*0.9)] bg-risk/12 p-[calc(var(--u)*0.8)]">
        <p className="flex items-center gap-1 font-display font-bold leading-tight text-risk" style={fs(1.15)}>
          <AlertTriangle className="h-[1em] w-[1em] shrink-0" aria-hidden="true" /> May not be Rahul
        </p>
        <p className="cq-hide mt-[calc(var(--u)*0.4)] leading-snug text-fg" style={fs(0.9)}>
          “Send it now” matches a known scam.
        </p>
      </div>
      <Pill tone="risk">Report to 1930</Pill>
    </motion.div>
  );
}

function Core({ step }: { step: number }) {
  const checks = [
    { label: 'Voice match', short: 'Voice', value: 'Weak', tone: 'text-warn' },
    { label: 'Synthetic', short: 'AI voice', value: 'Detected', shortValue: 'Yes', tone: 'text-risk' },
    { label: 'Scam script', short: 'Script', value: 'Matched', shortValue: 'Scam', tone: 'text-risk' },
  ];
  const status = ['Voiceprint saved', 'Call routed', 'Checking…', 'High risk'][step];
  return (
    <div className="flex flex-col items-center" style={{ width: 'calc(var(--u) * 18)' }}>
      <div className="relative grid h-[calc(var(--u)*7)] w-[calc(var(--u)*7)] place-items-center">
        <span className={cn('absolute inset-0 rounded-full blur-[calc(var(--u)*1.5)] transition-colors duration-700', step === 3 ? 'bg-risk/40' : 'bg-brand/40')} />
        {step === 2 && <span className="absolute inset-0 rounded-full border-2 border-brand motion-safe:animate-pulse-ring" />}
        <span className={cn('relative grid h-full w-full place-items-center rounded-full text-on-brand ring-1 ring-white/20 transition-colors duration-700', step === 3 ? 'bg-risk' : 'bg-brand-solid')}>
          <ShieldCheck className="h-[calc(var(--u)*3.2)] w-[calc(var(--u)*3.2)]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-[calc(var(--u)*0.6)] font-display font-bold tracking-tight text-fg" style={fs(1.3)}>
        SatyaCheck
      </p>
      <div className="liquid-glass mt-[calc(var(--u)*0.6)] w-full rounded-[calc(var(--u)*1.2)] p-[calc(var(--u)*0.8)]">
        <AnimatePresence mode="wait">
          {step === 2 || step === 3 ? (
            <motion.ul key="checks" {...screen} className="space-y-[calc(var(--u)*0.35)]">
              {checks.map((c, i) => (
                <motion.li
                  key={c.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step === 2 ? 0.25 + i * 0.35 : 0 }}
                  className="flex items-center justify-between gap-2"
                  style={fs(0.92)}
                >
                  <span className="text-fg-muted">
                    <span className="md:hidden short:inline">{c.short}</span>
                    <span className="hidden md:inline short:hidden">{c.label}</span>
                  </span>
                  <span className={cn('font-semibold', c.tone)}>
                    <span className="md:hidden short:inline">{c.shortValue ?? c.value}</span>
                    <span className="hidden md:inline short:hidden">{c.value}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p key={status} {...screen} className="text-center font-medium text-fg" style={fs(1)}>
              {status}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
