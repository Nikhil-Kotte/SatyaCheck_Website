import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CheckCircle2, Play, ShieldAlert, ShieldX } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Skeleton } from '@/components/motion/skeleton';
import { CONTENT } from '@/content';

const SCENARIOS = [
  { icon: CheckCircle2, title: 'A genuine call', result: 'Stays green', tone: 'text-ok', ring: 'border-ok/30 bg-ok/10' },
  { icon: ShieldX, title: 'A cloned voice', result: 'Gets flagged', tone: 'text-risk', ring: 'border-risk/30 bg-risk/10' },
  { icon: ShieldAlert, title: 'A real person reading a scam script', result: 'Gets flagged too', tone: 'text-warn', ring: 'border-warn/30 bg-warn/10' },
];

export const DemoSection: React.FC = () => {
  const { demo } = CONTENT;
  const [loaded, setLoaded] = useState(false);
  const hasVideo = demo.videoUrl.trim().length > 0;
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'center center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.9, 1]);

  return (
    <Section id="demo" labelledBy="demo-heading">
      <SectionHeading id="demo-heading" index="03" eyebrow="Demo" title={`See it *catch a scam*`} lede={demo.caption} />

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
          <div className="relative aspect-video w-full overflow-hidden rounded-[24px] bg-night">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-30 [--line:140_150_255]" />
                <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3d4bff]/30 blur-[90px]" />
                <div className="relative grid h-20 w-20 place-items-center rounded-full bg-white/10 backdrop-blur sm:h-24 sm:w-24">
                  <span className="absolute inset-0 rounded-full border border-white/30 motion-safe:animate-pulse-ring" />
                  <Play className="ml-1 h-8 w-8 fill-white" aria-hidden="true" />
                </div>
                <h3 className="relative mt-6 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{demo.placeholderTitle}</h3>
                <p className="relative mt-3 max-w-md text-sm text-white/65 sm:text-base">{demo.placeholderSub}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

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
