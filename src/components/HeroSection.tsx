import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { AudioWaveform, BellOff, Languages, Radar, Smartphone, Sparkles, UserX } from 'lucide-react';
import { RotatingWord } from '@/components/motion/rotating-word';
import { VerdictCard } from '@/components/motion/verdict-card';
import { Button } from '@/components/ui/button';
import { Marquee, PulseDot } from '@/components/ui/bits';
import { Ripples } from '@/components/ui/section';
import { TiltCard } from '@/components/ui/tilt-card';
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
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.35]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section ref={ref} className="relative isolate w-full overflow-hidden pt-28 sm:pt-32" aria-labelledby="hero-heading">
      {/* Backdrop: dot matrix on paper, fading out toward the copy */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      </div>

      <div className="px-fluid">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Copy */}
          <motion.div style={{ y: copyY }} className="relative z-10 flex flex-col items-start">
            <motion.div {...enter(0.05)}>
              <a
                href="#waitlist"
                onClick={(e) => {
                  if (scrollToHash('#waitlist')) e.preventDefault();
                }}
                className="pop pop-sm pop-press group mb-8 inline-flex items-center gap-3 rounded-lg py-1.5 pl-3 pr-1.5 text-[13px] font-semibold text-fg"
              >
                <PulseDot />
                <span>{hero.statusBadge}</span>
                <span className="hidden rounded-[5px] bg-accent px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-on-accent min-[380px]:inline">
                  Eureka! 2026
                </span>
              </a>
            </motion.div>

            <motion.p {...enter(0.12)} className="mb-5 font-mono text-[12px] font-semibold uppercase tracking-[0.22em] text-brand">
              {hero.eyebrow}
            </motion.p>

            <motion.h1
              id="hero-heading"
              {...enter(0.2)}
              className="font-display text-[clamp(44px,6.1vw,100px)] font-extrabold leading-[0.92] tracking-[-0.045em] text-fg"
            >
              Is that <span className="marker">really</span> your{' '}
              {/* Line breaks keep the rotating word alone on its line, so its reserved width never shows as a gap. */}
              <br />
              <RotatingWord words={['son', 'daughter', 'brother', 'friend']} className="text-brand" />
              <br /> on the phone?
            </motion.h1>

            <motion.p {...enter(0.32)} className="type-lede mt-8 max-w-[560px] border-l-2 border-edge pl-5 text-fg-muted">
              {hero.subheadline}
            </motion.p>

            <motion.div {...enter(0.42)} className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
              <Button href="#waitlist" size="lg" arrow>
                {hero.primaryCta}
              </Button>
              <Button
                href="#story-scroll"
                variant="secondary"
                size="lg"
                icon={
                  <span className="mr-0.5 grid h-6 w-6 place-items-center rounded-md bg-accent text-on-accent">
                    <svg viewBox="0 0 10 10" className="ml-[1px] h-2.5 w-2.5 fill-current" aria-hidden="true">
                      <path d="M2 1l7 4-7 4z" />
                    </svg>
                  </span>
                }
              >
                {hero.secondaryCta}
              </Button>
            </motion.div>

            {/* The three things families ask first */}
            <motion.ul {...enter(0.48)} className="mt-9 flex flex-wrap gap-x-6 gap-y-3" aria-label="Key facts">
              {[
                { icon: UserX, text: 'Caller installs nothing' },
                { icon: Smartphone, text: 'Works on any phone' },
                { icon: BellOff, text: 'Warns, never blocks' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-2 text-[14px] font-semibold text-fg">
                  <span className="grid h-7 w-7 place-items-center rounded-md border-2 border-edge bg-surface">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </motion.ul>

            <motion.div {...enter(0.56)} className="mt-8 flex max-w-xl items-start gap-3 border-t-2 border-edge pt-5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-fg-muted">{hero.trustLine}</p>
            </motion.div>
          </motion.div>

          {/* Stage: a cobalt poster block with the phone on it */}
          <motion.div
            style={{ y: stageY }}
            className="relative mx-auto h-[660px] w-full max-w-[560px] sm:h-[740px] short:h-[440px]"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[32px] border-2 border-ink bg-[#1E2BFA] shadow-[10px_10px_0_0_rgb(var(--pop))]">
              <motion.div style={{ scale: ringScale }} className="absolute inset-[-22%]">
                <Ripples rings={10} className="ring-breathe h-full w-full text-white" />
              </motion.div>
              <div aria-hidden="true" className="bg-hatch absolute -left-2 bottom-10 h-20 w-28 opacity-40 [--line:255_255_255]" />
              <p
                aria-hidden="true"
                className="absolute left-5 top-5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80"
              >
                Live call · Illustration
              </p>
              <span aria-hidden="true" className="absolute right-5 top-5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
                <span className="h-2 w-2 rounded-full bg-lime motion-safe:animate-pulse" />
                Rec
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pt-10 text-white" style={{ perspective: 1200 }}>
              <div className="origin-center scale-[0.9] short:scale-[0.62]">
                {HERO_SCREENSHOTS.length > 0 ? (
                  <ScreenshotStack />
                ) : (
                  <TiltCard max={8} glare={false} className="rounded-[46px]">
                    <VerdictCard />
                  </TiltCard>
                )}
              </div>
            </div>

            <Sticker className="left-[-14px] top-[18%]" rotate={-5} delay={0.9}>
              <Radar className="h-4 w-4" aria-hidden="true" />
              Live call analysis
            </Sticker>
            <Sticker className="right-[-14px] top-[44%]" rotate={4} delay={1.05}>
              <AudioWaveform className="h-4 w-4" aria-hidden="true" />3 checks, 1 answer
            </Sticker>
            <Sticker className="bottom-[16%] left-[-14px]" rotate={3} delay={1.2}>
              <Languages className="h-4 w-4" aria-hidden="true" />
              Hindi, English, Hinglish
            </Sticker>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative mt-20 border-y-2 border-ink bg-ink py-4 text-[#F4F1E8]">
        <Marquee>
          {TICKER.map((t) => (
            <span
              key={t}
              className="mx-6 inline-flex items-center gap-12 whitespace-nowrap font-display text-lg font-bold uppercase tracking-[0.02em]"
            >
              {t}
              <span className="h-2.5 w-2.5 rotate-45 bg-lime" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

/** A lime label stuck onto the edge of the stage, slightly askew. */
function Sticker({
  children,
  className,
  rotate,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  rotate: number;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute z-20 hidden items-center gap-2 whitespace-nowrap rounded-lg border-2 border-ink bg-lime px-3 py-2 text-[13px] font-bold text-ink shadow-[4px_4px_0_0_#0A0B1C] sm:flex ${className}`}
      initial={reduce ? { rotate } : { opacity: 0, scale: 0.6, rotate: rotate * 3 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 16 }}
    >
      {children}
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
            className="absolute w-[76%] overflow-hidden rounded-[28px] border-2 border-ink bg-surface shadow-[8px_8px_0_0_#0A0B1C] transition-transform duration-500 hover:z-10 hover:scale-105"
          >
            <img src={src} alt={`SatyaCheck app screen ${idx + 1}`} className="h-auto w-full object-cover" />
          </div>
        );
      })}
    </div>
  );
}
