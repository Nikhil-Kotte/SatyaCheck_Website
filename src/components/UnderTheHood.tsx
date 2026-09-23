import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Quote } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { PulseDot } from '@/components/ui/bits';
import { SignalField } from '@/components/three';
import { cn } from '@/lib/utils';
import { CONTENT, PIPELINE } from '@/content';

const CYCLE_MS = 5200;
const EASE = [0.22, 1, 0.36, 1] as const;

export const UnderTheHood: React.FC = () => {
  const { underTheHood } = CONTENT;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const auto = inView && !paused && !reduce;

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % PIPELINE.length), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [active, auto]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + PIPELINE.length) % PIPELINE.length;
    setActive(next);
    document.getElementById(`pipe-tab-${next}`)?.focus();
  };

  return (
    <Section id="how-it-works" labelledBy="how-heading">
      <SectionHeading
        id="how-heading"
        index="02"
        eyebrow={underTheHood.eyebrow}
        title="Three checks. *One clear answer.*"
        lede="One fake can fool one check. Fooling all three at once is much harder."
      />

      <Reveal>
        <div
          ref={panelRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative isolate overflow-hidden rounded-panel border border-white/10 bg-night text-white shadow-lift"
        >
          {/* 3D signal field */}
          <div className="relative h-[220px] sm:h-[300px]">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(61,75,255,0.35),transparent_60%)]" />
            <SignalField className="absolute inset-0" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-8">
              <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                <PulseDot />
                Listening pipeline
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8c96ff]" />
                {underTheHood.tag}
              </span>
            </div>
          </div>

          <div className="relative grid gap-8 p-5 pt-0 sm:p-8 sm:pt-0 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:p-12 lg:pt-2">
            {/* Pipeline tabs */}
            {/* TODO(team): confirm each status matches the product on launch day. */}
            <div role="tablist" aria-orientation="vertical" aria-label="Detection pipeline" className="flex flex-col gap-2">
              {PIPELINE.map((row, i) => {
                const selected = i === active;
                const working = row.status === 'Working';
                return (
                  <button
                    key={row.step}
                    id={`pipe-tab-${i}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls="pipe-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-300 sm:p-5',
                      selected ? 'border-white/15 bg-white/[0.06]' : 'border-transparent hover:bg-white/[0.03]'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span className={cn('font-mono text-sm transition-colors', selected ? 'text-[#8c96ff]' : 'text-white/35')}>
                        {row.step}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-display text-lg font-semibold tracking-tight text-white">{row.title.replace(/\.$/, '')}</span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]',
                              working
                                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                                : 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                            )}
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full', working ? 'bg-emerald-400' : 'bg-amber-300')} />
                            {row.status}
                          </span>
                        </div>
                        <p
                          className={cn(
                            'mt-1.5 text-sm leading-relaxed transition-colors',
                            selected ? 'text-white/75' : 'text-white/45'
                          )}
                        >
                          {row.description}
                        </p>
                      </div>
                    </div>
                    {selected && (
                      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
                        <motion.span
                          key={`${active}-${auto}`}
                          className="block h-full bg-gradient-to-r from-[#3d4bff] to-[#a58bff]"
                          initial={{ width: auto ? '0%' : '100%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: auto ? CYCLE_MS / 1000 : 0, ease: 'linear' }}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Visual for the selected check */}
            <div
              id="pipe-panel"
              role="tabpanel"
              aria-labelledby={`pipe-tab-${active}`}
              className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#070920] p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  check_{PIPELINE[active].step}.live
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {active === 0 && <VoiceMatchViz />}
                  {active === 1 && <SyntheticViz />}
                  {active === 2 && <ScriptViz />}
                  {active === 3 && <FusionViz />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Evidence band */}
      <Reveal className="mt-8">
        <div className="relative overflow-hidden rounded-panel border border-line/15 bg-surface/70 p-8 sm:p-12">
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-solid text-on-brand shadow-glow">
              <Quote className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="max-w-4xl font-display text-[clamp(22px,2.4vw,36px)] font-medium leading-[1.25] tracking-[-0.025em] text-fg">
              Every warning tells you why. We quote{' '}
              <span className="relative whitespace-nowrap">
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-[-4px] bottom-[0.08em] -z-0 h-[0.42em] origin-left rounded-sm bg-brand/25"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 1 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                />
                <span className="relative">the exact line</span>
              </span>{' '}
              that matched a known scam, so you can decide for yourself.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

/* ---------- Check visuals (illustrative) ---------- */

function wavePath(seed: number, width = 460, height = 90, points = 90) {
  let d = `M0 ${height / 2}`;
  for (let i = 1; i <= points; i++) {
    const x = (i / points) * width;
    const env = Math.sin((i / points) * Math.PI);
    const y = height / 2 + Math.sin(i * 0.55 + seed) * Math.cos(i * 0.13 + seed * 2) * env * (height * 0.42);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function VizLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('font-mono text-[11px] uppercase tracking-[0.2em] text-white/45', className)}>{children}</p>;
}

function Verdict({ label, value, tone }: { label: string; value: string; tone: 'warn' | 'risk' | 'ok' }) {
  const colors = {
    warn: 'text-amber-200 border-amber-400/30 bg-amber-400/10',
    risk: 'text-rose-300 border-rose-400/30 bg-rose-400/10',
    ok: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  }[tone];
  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-white/70">{label}</span>
      <span className={cn('rounded-full border px-3 py-1 font-display text-sm font-semibold', colors)}>{value}</span>
    </div>
  );
}

function VoiceMatchViz() {
  const reduce = useReducedMotion();
  return (
    <div>
      <VizLabel>Enrolled voiceprint</VizLabel>
      <svg viewBox="0 0 460 90" className="mt-2 h-20 w-full" aria-hidden="true">
        <motion.path
          d={wavePath(1)}
          fill="none"
          stroke="#8c96ff"
          strokeWidth="2"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>
      <VizLabel className="mt-4">Caller</VizLabel>
      <svg viewBox="0 0 460 90" className="mt-2 h-20 w-full" aria-hidden="true">
        <path d={wavePath(1)} fill="none" stroke="rgba(140,150,255,0.18)" strokeWidth="2" strokeDasharray="4 4" />
        <motion.path
          d={wavePath(2.3)}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
        />
      </svg>
      <div className="mt-5">
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          <span>Similarity</span>
          <span>Weak</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
            initial={reduce ? false : { width: '0%' }}
            animate={{ width: '34%' }}
            transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
          />
        </div>
      </div>
      <Verdict label="Does it sound like the enrolled person?" value="Weak match" tone="warn" />
    </div>
  );
}

function SyntheticViz() {
  const reduce = useReducedMotion();
  const cols = 28;
  const rows = 10;
  // Deterministic pseudo-spectrogram with a few "artifact" cells.
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const v = Math.abs(Math.sin(c * 0.7 + r * 1.3) * Math.cos(c * 0.21 - r * 0.4));
    const artifact = (c * 7 + r * 3) % 23 === 0 && r > 1;
    return { v, artifact };
  });
  return (
    <div>
      <VizLabel>Spectral scan</VizLabel>
      <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-2">
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-hidden="true">
          {cells.map((cell, i) => (
            <motion.span
              key={i}
              className={cn('aspect-square rounded-[2px]', cell.artifact ? 'bg-rose-400' : 'bg-[#5f6cff]')}
              style={{ opacity: cell.artifact ? 1 : 0.12 + cell.v * 0.7 }}
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: (i % cols) * 0.02, duration: 0.3 }}
            />
          ))}
        </div>
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            initial={{ left: '-10%' }}
            animate={{ left: '105%' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
      <div className="mt-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-[#5f6cff]" /> Natural speech energy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-rose-400" /> AI fingerprints
        </span>
      </div>
      <Verdict label="Is the speech real?" value="Synthetic detected" tone="risk" />
    </div>
  );
}

const TRANSCRIPT = [
  { who: 'Caller', text: 'Hello? It’s me.' },
  { who: 'Caller', text: 'Papa, I’m in trouble. Don’t tell anyone.' },
  { who: 'Caller', text: 'Don’t tell Papa. Send it now, I’ll explain later.', match: true },
];

function ScriptViz() {
  const reduce = useReducedMotion();
  return (
    <div>
      <VizLabel>Live transcript</VizLabel>
      <ul className="mt-3 space-y-2.5">
        {TRANSCRIPT.map((line, i) => (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.45, duration: 0.4 }}
            className={cn(
              'rounded-xl border px-4 py-3 text-sm leading-relaxed',
              line.match ? 'border-rose-400/40 bg-rose-400/10 text-white' : 'border-white/10 bg-white/[0.03] text-white/70'
            )}
          >
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">{line.who}</span>
            {line.match ? <mark className="rounded bg-rose-400/25 px-1 text-white">{line.text}</mark> : line.text}
          </motion.li>
        ))}
      </ul>
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.4 }}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-rose-200"
      >
        Matched: family emergency script
      </motion.div>
      <Verdict label="Is it a known scam?" value="Script matched" tone="risk" />
    </div>
  );
}

function FusionViz() {
  const reduce = useReducedMotion();
  const inputs = [
    { k: 'Voice', v: 'Weak', c: 'text-amber-200' },
    { k: 'Speech', v: 'Synthetic', c: 'text-rose-300' },
    { k: 'Script', v: 'Matched', c: 'text-rose-300' },
  ];
  return (
    <div>
      <VizLabel>Fusion</VizLabel>
      <div className="relative mt-4 grid grid-cols-[1fr_auto_1.2fr] items-center gap-3">
        <div className="space-y-2">
          {inputs.map((x, i) => (
            <motion.div
              key={x.k}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs"
            >
              <span className="text-white/60">{x.k}</span>
              <span className={cn('font-semibold', x.c)}>{x.v}</span>
            </motion.div>
          ))}
        </div>
        <svg viewBox="0 0 40 120" className="h-28 w-10" aria-hidden="true">
          {[20, 60, 100].map((y, i) => (
            <motion.path
              key={y}
              d={`M0 ${y} C 20 ${y}, 20 60, 40 60`}
              fill="none"
              stroke="#8c96ff"
              strokeWidth="1.5"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
            />
          ))}
        </svg>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-rose-400/40 bg-gradient-to-b from-rose-500/20 to-rose-500/5 p-4 shadow-[0_0_40px_-10px_rgba(244,63,94,0.6)]"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-200">Verdict</p>
          <p className="mt-1 font-display text-2xl font-bold text-white">High risk</p>
          <p className="mt-2 text-xs leading-snug text-white/70">“Send it now, I’ll explain later.”</p>
        </motion.div>
      </div>
      <Verdict label="What your family sees" value="Reason on screen" tone="ok" />
    </div>
  );
}
