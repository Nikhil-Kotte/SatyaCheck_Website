import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { AudioWaveform, Languages, Radar, Sparkles } from 'lucide-react';
import { RotatingWord } from '@/components/motion/rotating-word';
import { VerdictCard } from '@/components/motion/verdict-card';
import { Button } from '@/components/ui/button';
import { Marquee, PulseDot } from '@/components/ui/bits';
import { TiltCard } from '@/components/ui/tilt-card';
import { VoiceOrb } from '@/components/three';
import { HERO_SCREENSHOTS } from '@/content';
import { useLanguage } from '@/lib/use-language';
import { scrollToHash } from '@/lib/smooth-scroll';

const EASE = [0.22, 1, 0.36, 1] as const;

// Only terms that appear elsewhere in the site copy.
const TICKER = [
  'Voice match',
  'Synthetic speech check',
  'Scam-script match',
  'Digital arrest',
  'KYC fraud',
  'Family emergency',
  'Hindi',
  'English',
  'Hinglish',
  'Evidence on screen',
];

export const HeroSection: React.FC = () => {
  const { content } = useLanguage();
  const { hero } = content;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.25]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section ref={ref} className="relative isolate w-full overflow-hidden pt-32 sm:pt-40" aria-labelledby="hero-heading">
      {/* Backdrop: engineering grid + slow colour fields */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
        <div className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-brand/[0.13] blur-[120px] motion-safe:animate-float" />
        <div
          className="absolute right-[-10%] top-[20%] h-[640px] w-[640px] rounded-full bg-brand-hi/[0.16] blur-[140px] motion-safe:animate-float"
          style={{ animationDelay: '-3s' }}
        />
      </div>

      <div className="px-fluid">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          {/* Copy */}
          <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10 flex flex-col items-start">
            <motion.div {...enter(0.05)}>
              <a
                href="#waitlist"
                onClick={(e) => {
                  if (scrollToHash('#waitlist')) e.preventDefault();
                }}
                className="glass group mb-8 inline-flex items-center gap-3 rounded-full border border-line/15 py-1.5 pl-3 pr-1.5 text-[13px] font-medium text-fg shadow-card transition-colors hover:border-brand/40"
              >
                <PulseDot />
                <span>{hero.statusBadge}</span>
                <span className="hidden rounded-full bg-brand/10 px-2.5 py-1 font-mono min-[380px]:inline text-[11px] uppercase tracking-[0.15em] text-brand transition-colors group-hover:bg-brand-solid group-hover:text-on-brand">
                  Eureka! 2026
                </span>
              </a>
            </motion.div>

            <motion.p {...enter(0.12)} className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-brand">
              {hero.eyebrow}
            </motion.p>

            <motion.h1
              id="hero-heading"
              {...enter(0.2)}
              className="font-display text-[clamp(44px,6.6vw,108px)] font-semibold leading-[0.95] tracking-[-0.05em] text-fg"
            >
              Is that <span className="font-serif font-normal italic tracking-[-0.02em] text-brand">really</span> your{' '}
              {/* Line breaks keep the rotating word alone on its line, so its reserved width never shows as a gap. */}
              <br />
              <RotatingWord words={['son', 'daughter', 'brother', 'friend']} className="gradient-text" />
              <br /> on the phone?
            </motion.h1>

            <motion.p {...enter(0.32)} className="type-lede mt-8 max-w-[560px] text-fg-muted">
              {hero.subheadline}
            </motion.p>

            <motion.div {...enter(0.42)} className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button href="#waitlist" size="lg" arrow magnetic>
                {hero.primaryCta}
              </Button>
              <Button
                href="#story-scroll"
                variant="secondary"
                size="lg"
                icon={
                  <span className="relative mr-0.5 grid h-6 w-6 place-items-center rounded-full bg-brand-solid text-on-brand">
                    <span className="absolute inset-0 rounded-full bg-brand-solid motion-safe:animate-pulse-ring" />
                    <svg viewBox="0 0 10 10" className="relative ml-[1px] h-2.5 w-2.5 fill-current" aria-hidden="true">
                      <path d="M2 1l7 4-7 4z" />
                    </svg>
                  </span>
                }
              >
                {hero.secondaryCta}
              </Button>
            </motion.div>

            <motion.div {...enter(0.52)} className="mt-12 flex max-w-xl items-start gap-3 border-t border-line/15 pt-6">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-fg-muted">{hero.trustLine}</p>
            </motion.div>
          </motion.div>

          {/* 3D stage */}
          <motion.div style={{ y: stageY }} className="relative mx-auto h-[640px] w-full max-w-[560px] sm:h-[700px] short:h-[440px]">
            <motion.div style={{ scale: orbScale }} className="absolute inset-[-18%] sm:inset-[-12%]">
              {/* CSS glow shows first and stays as the orb's halo */}
              <div aria-hidden="true" className="absolute inset-[22%] rounded-full bg-brand/20 blur-[80px]" />
              <VoiceOrb className="absolute inset-0" />
            </motion.div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={reduce ? false : { opacity: 0, y: 60, rotateX: 25 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
              style={{ perspective: 1200 }}
            >
              {/* Separate wrapper: motion owns this element's transform for the entrance. */}
              <div className="short:scale-[0.62]">
              {HERO_SCREENSHOTS.length > 0 ? (
                <ScreenshotStack />
              ) : (
                <TiltCard max={10} glare={false} className="rounded-[46px]">
                  <VerdictCard />
                  <FloatingChip className="right-[calc(100%-26px)] top-[14%]" depth={60} delay={0.9}>
                    <Radar className="h-4 w-4 text-brand" aria-hidden="true" />
                    Live call analysis
                  </FloatingChip>
                  <FloatingChip className="left-[calc(100%-26px)] top-[40%]" depth={90} delay={1.05}>
                    <AudioWaveform className="h-4 w-4 text-brand" aria-hidden="true" />3 checks, 1 answer
                  </FloatingChip>
                  <FloatingChip className="right-[calc(100%-26px)] bottom-[24%]" depth={40} delay={1.2}>
                    <Languages className="h-4 w-4 text-brand" aria-hidden="true" />
                    Hindi, English, Hinglish
                  </FloatingChip>
                </TiltCard>
              )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative mt-16 border-y border-line/10 bg-surface/40 py-5 backdrop-blur-sm lg:mt-8">
        <Marquee>
          {TICKER.map((t) => (
            <span key={t} className="mx-7 inline-flex items-center gap-7 whitespace-nowrap font-display text-lg font-medium tracking-tight text-fg-muted">
              {t}
              <span className="h-1.5 w-1.5 rotate-45 bg-brand/60" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

function FloatingChip({
  children,
  className,
  depth,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  depth: number;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`glass absolute z-20 hidden items-center gap-2 whitespace-nowrap rounded-full border border-line/15 px-3.5 py-2 text-[13px] font-medium text-fg shadow-lift sm:flex ${className}`}
      style={{ z: depth }}
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
    >
      <span className="flex items-center gap-2 motion-safe:animate-float" style={{ animationDelay: `${-delay * 2}s` }}>
        {children}
      </span>
    </motion.div>
  );
}

function ScreenshotStack() {
  return (
    <div className="relative flex h-[560px] w-full max-w-[380px] items-center justify-center">
      {HERO_SCREENSHOTS.map((src, idx) => {
        const rotations = [-7, 4, -1];
        const xs = [-40, 40, 0];
        const ys = [16, -16, 0];
        return (
          <div
            key={src}
            style={{
              transform: `rotate(${rotations[idx % 3]}deg) translate(${xs[idx % 3]}px, ${ys[idx % 3]}px)`,
              zIndex: idx + 1,
            }}
            className="absolute w-[76%] overflow-hidden rounded-[32px] border border-line/15 bg-surface shadow-lift transition-transform duration-500 hover:z-10 hover:scale-105"
          >
            <img src={src} alt={`SatyaCheck app screen ${idx + 1}`} className="h-auto w-full object-cover" />
          </div>
        );
      })}
    </div>
  );
}
