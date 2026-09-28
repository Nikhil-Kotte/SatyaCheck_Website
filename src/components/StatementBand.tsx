import React from 'react';
import { X } from 'lucide-react';
import { ScrollWordReveal } from '@/components/motion/scroll-word-reveal';
import { Counter } from '@/components/ui/bits';
import { Reveal } from '@/components/ui/reveal';
import { Eyebrow } from '@/components/ui/section';
import { SpotlightCard } from '@/components/ui/tilt-card';
import { PROBLEM, WHY_NOW } from '@/content';

/**
 * The problem, after the story: the scroll-lit statement, the numbers with
 * their sources, why today's fixes fall short, and why now.
 */
export const StatementBand: React.FC = () => (
  <section id="problem" className="relative w-full scroll-mt-24 px-fluid py-24 lg:py-36" aria-labelledby="problem-heading">
    <div className="mx-auto max-w-[1400px]">
      <Reveal y={12} className="flex justify-center">
        <Eyebrow index="02">The problem</Eyebrow>
      </Reveal>
      <h2 id="problem-heading" className="sr-only">
        {PROBLEM.statement}
      </h2>
      <ScrollWordReveal
        text={PROBLEM.statement}
        className="mx-auto mt-8 max-w-[18ch] justify-center text-center font-display text-[clamp(36px,5.6vw,96px)] font-semibold leading-[1.02] tracking-[-0.045em] text-fg"
        dimOpacity={0.12}
      />
      <Reveal delay={0.1}>
        <p className="type-lede mx-auto mt-8 max-w-2xl text-center text-fg-muted">{PROBLEM.sub}</p>
      </Reveal>

      {/* The numbers */}
      <div className="mt-16 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {PROBLEM.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="h-full">
            <SpotlightCard className={`h-full p-6 sm:p-8 ${i === 0 ? 'border-risk/30' : ''}`}>
              <p className="whitespace-nowrap font-display text-[clamp(34px,3vw,52px)] font-semibold leading-none tracking-[-0.05em] text-fg">
                <Counter
                  to={s.value}
                  prefix={'prefix' in s ? s.prefix : ''}
                  suffix={s.suffix}
                  decimals={'decimals' in s ? s.decimals : 0}
                  className={i < 2 ? 'text-risk' : 'gradient-text'}
                />
              </p>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted sm:text-base">{s.label}</p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle">{s.source}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* Number ≠ Person */}
      <Reveal className="mt-4">
        <div className="relative flex flex-col gap-4 overflow-hidden rounded-card bg-night px-6 py-7 text-white sm:flex-row sm:items-center sm:gap-10 sm:px-10">
          <div aria-hidden="true" className="absolute -left-10 top-1/2 h-40 w-72 -translate-y-1/2 rounded-full bg-rose-500/25 blur-3xl" />
          <p className="relative shrink-0 font-display text-[clamp(30px,3.4vw,52px)] font-bold tracking-[-0.04em] text-rose-400">
            {PROBLEM.band.left}
          </p>
          <p className="relative font-mono text-sm uppercase leading-relaxed tracking-[0.1em] text-white/80 sm:text-base">
            {PROBLEM.band.right}
          </p>
        </div>
      </Reveal>

      {/* Why today's fixes fall short */}
      <Reveal className="mt-16">
        <div className="overflow-hidden rounded-card border border-line/15 bg-surface/70">
          <div className="hidden grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] border-b border-line/15 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-brand sm:grid">
            <span>How it's solved today</span>
            <span>Why that falls short</span>
          </div>
          <ul className="divide-y divide-line/10">
            {PROBLEM.fallsShort.map((row) => (
              <li
                key={row.today}
                className="group grid gap-2 px-6 py-5 transition-colors hover:bg-risk/[0.04] sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center sm:px-8"
              >
                <span className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-fg">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-risk/10 text-risk transition-transform group-hover:rotate-90">
                    <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {row.today}
                </span>
                <span className="pl-9 text-fg-muted sm:pl-0">{row.why}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Why now */}
      <div className="mt-16">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">Why now</p>
        </Reveal>
        <div className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
          {WHY_NOW.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08} className="h-full">
              <div className="h-full rounded-card border-l-2 border-brand bg-surface/70 p-6 transition-transform duration-300 hover:-translate-y-1">
                <p className="font-mono text-sm text-brand">0{i + 1}</p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-fg">{w.title}</h3>
                <p className="mt-2 text-fg-muted">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
