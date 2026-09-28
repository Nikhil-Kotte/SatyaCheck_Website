import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CheckCircle2, Play, ShieldAlert, ShieldX } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Skeleton } from '@/components/motion/skeleton';
import { CONTENT, DEMO_TRAILER } from '@/content';

const SCENARIOS = [
  { icon: CheckCircle2, title: 'A genuine call', result: 'Stays green', tone: 'text-ok', ring: 'border-ok/30 bg-ok/10' },
  { icon: ShieldX, title: 'A cloned voice', result: 'Gets flagged', tone: 'text-risk', ring: 'border-risk/30 bg-risk/10' },
  { icon: ShieldAlert, title: 'A real person reading a scam script', result: 'Gets flagged too', tone: 'text-warn', ring: 'border-warn/30 bg-warn/10' },
];

export const DemoSection: React.FC = () => {
  const { demo } = CONTENT;
  const [loaded, setLoaded] = useState(false);
  const hasVideo = demo.videoUrl.trim().length > 0;
  const portrait = usePortraitPhone();
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'center center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.9, 1]);

  return (
    <Section id="demo" labelledBy="demo-heading">
      <SectionHeading id="demo-heading" index="05" eyebrow="Demo" title={`See it *catch a scam*`} lede={demo.caption} />

      <div style={{ perspective: 1600 }}>
        <motion.div
          ref={frameRef}
          style={{ rotateX, scale, transformOrigin: 'center top' }}
          className="relative mx-auto max-w-[1200px] overflow-hidden rounded-panel border border-line/15 bg-surface p-2 shadow-lift"
        >
          <div className="flex items-center gap-1.5 px-4 py-3" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-risk/60" />
            <span className="h-3 w-3 rounded-full bg-warn/60" />
            <span className="h-3 w-3 rounded-full bg-ok/60" />
            <span className="ml-4 rounded-full bg-canvas-2 px-4 py-1 font-mono text-[11px] text-fg-subtle">satyacheck.in/demo</span>
          </div>
          <div className={`relative w-full overflow-hidden rounded-[24px] bg-night ${portrait && !hasVideo ? "mx-auto aspect-[9/16] max-h-[78svh] max-w-[calc(78svh*9/16)]" : "aspect-video"}`}>
            {hasVideo ? (
              <>
                {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
                <iframe
                  src={demo.videoUrl}
                  title="SatyaCheck scam detection demo"
                  loading="lazy"
                  onLoad={() => setLoaded(true)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </>
            ) : (
              <TrailerPlayer vertical={portrait} />
            )}
          </div>
        </motion.div>
      </div>
      {!hasVideo && (
        <p className="mx-auto mt-4 max-w-[1200px] text-center font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle sm:hidden">
          24-second trailer with sound · full demo coming soon
        </p>
      )}

      <div className="mx-auto mt-6 grid max-w-[1200px] gap-3 sm:grid-cols-3">
        {SCENARIOS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="flex h-full items-center gap-4 rounded-card border border-line/15 bg-surface/70 p-5 transition-transform duration-300 hover:-translate-y-1">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${s.ring}`}>
                <s.icon className={`h-5 w-5 ${s.tone}`} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-fg-muted">{s.title}</p>
                <p className={`font-display text-lg font-semibold ${s.tone}`}>{s.result}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

/** The 24-second product trailer, shown until the full demo video is ready. */
/** Phones held upright get the 9:16 trailer; everything else the 16:9 one. */
function usePortraitPhone() {
  const query = '(max-width: 639px) and (orientation: portrait)';
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return match;
}

function TrailerPlayer({ vertical }: { vertical: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const inView = useInView(ref, { amount: 0.3 });

  // Never keep playing (with sound) once the visitor has scrolled away.
  useEffect(() => {
    if (!inView) ref.current?.pause();
  }, [inView]);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    v.currentTime = 0;
    void v.play();
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        key={vertical ? 'v' : 'h'}
        src={vertical ? DEMO_TRAILER.videoVertical : DEMO_TRAILER.video}
        poster={vertical ? DEMO_TRAILER.posterVertical : DEMO_TRAILER.poster}
        preload="metadata"
        playsInline
        controls={started}
        onEnded={() => setStarted(false)}
        aria-label="SatyaCheck trailer: a cloned son's call is checked for identity, synthetic speech and scam intent, and flagged with its reasons, while a bank's genuine automated call is not."
      />
      <AnimatePresence>
        {!started && (
          <motion.button
            type="button"
            onClick={play}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/70 via-transparent to-transparent p-5 text-left text-white sm:p-8"
            aria-label="Play the SatyaCheck trailer with sound"
          >
            {/* Bottom-left, so the poster's "It's his voice. It isn't him." stays readable. */}
            <span className="flex items-center gap-4">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#0B0D2A] shadow-lift transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                <span className="absolute inset-0 rounded-full border border-white/60 motion-safe:animate-pulse-ring" />
                <Play className="ml-1 h-5 w-5 fill-current sm:h-6 sm:w-6" aria-hidden="true" />
              </span>
              <span className="hidden sm:block">
                <span className="block font-display text-lg font-semibold tracking-tight sm:text-2xl">Watch the trailer</span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">24 sec · with sound · full demo coming soon</span>
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
