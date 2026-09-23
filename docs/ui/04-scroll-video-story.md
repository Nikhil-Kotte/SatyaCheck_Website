# 04. Scroll video story (source)

The eéna-style pinned section: a vertical video card on the left, a large headline on the right, and a glowing cobalt dot travelling down a rail between them. Each step of scroll swaps the video and the headline. Below 1024px, and under reduced motion, it becomes a stacked list (reduced motion shows posters, no autoplay).

Type-checked in strict mode and renders without errors; not yet tested visually in a browser.

## Usage

```tsx
import { ScrollVideoStory } from "@/components/motion/scroll-video-story";
import { STORY_STEPS } from "@/content";

<ScrollVideoStory steps={STORY_STEPS} />
```

## `src/components/motion/scroll-video-story.tsx`

```tsx
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export type StoryStep = {
  id: string;
  headline: string;
  sub: string;
  /** Path to a muted, looping 9:16 MP4, e.g. /videos/scene-1.mp4 */
  video: string;
  /** Poster image shown before the video loads and under reduced motion. */
  poster: string;
  /** Short description of the video for screen readers. */
  alt: string;
};

type ScrollVideoStoryProps = {
  steps: StoryStep[];
  className?: string;
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Full-width scroll story. On large screens the section is pinned: a
 * vertical video card sits on the left, a large headline on the right, and
 * a glowing dot travels down a thin rail between them. Each step of scroll
 * swaps the video and the headline. On small screens, and under reduced
 * motion, it becomes a simple stacked list.
 */
export function ScrollVideoStory({ steps, className }: ScrollVideoStoryProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();

  if (!isDesktop || reduce) {
    return <StackedStory steps={steps} className={className} autoplay={!reduce} />;
  }
  return <PinnedStory steps={steps} className={className} />;
}

function PinnedStory({ steps, className }: ScrollVideoStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    if (next !== active) setActive(next);
  });

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.currentTime = 0;
        void v.play().catch(() => undefined);
      } else {
        v.pause();
      }
    });
  }, [active]);

  const step = steps[active];

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full", className)}
      style={{ height: `${steps.length * 100}vh` }}
      aria-label="How a voice-clone scam unfolds"
    >
      <div className="sticky top-0 flex h-screen w-full items-center px-[clamp(20px,5vw,96px)]">
        <div className="grid w-full grid-cols-[minmax(0,0.8fr)_48px_minmax(0,1.4fr)] items-center gap-[clamp(24px,4vw,72px)]">
          {/* Video card */}
          <div className="relative mx-auto aspect-[9/16] h-[min(78vh,760px)] overflow-hidden rounded-[28px] bg-ink/5 shadow-[0_40px_80px_-30px_rgba(17,17,17,0.35)]">
            {steps.map((s, i) => (
              <video
                key={s.id}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                  i === active ? "opacity-100" : "opacity-0"
                )}
                src={s.video}
                poster={s.poster}
                muted
                loop
                playsInline
                preload={Math.abs(i - active) <= 1 ? "auto" : "none"}
                aria-hidden={i !== active}
                aria-label={s.alt}
              />
            ))}
          </div>

          {/* Progress rail with glowing dot */}
          <div aria-hidden="true" className="relative h-[60vh] w-full">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cobalt/15" />
            <motion.div className="absolute left-1/2" style={{ top: dotTop }}>
              <span className="absolute -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-cobalt/20 blur-xl" />
              <span className="absolute -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cobalt shadow-[0_0_16px_4px_rgba(30,43,250,0.45)]" />
            </motion.div>
          </div>

          {/* Text */}
          <div className="relative min-h-[40vh]">
            <p className="font-display text-sm font-semibold tracking-widest text-cobalt" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                aria-live="polite"
              >
                <h2 className="mt-4 font-display text-[clamp(40px,5.2vw,88px)] font-bold leading-[1.02] tracking-tight text-ink">
                  {step.headline}
                </h2>
                <p className="mt-6 max-w-2xl text-[clamp(17px,1.4vw,22px)] leading-relaxed text-ink-muted">{step.sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedStory({ steps, className, autoplay }: ScrollVideoStoryProps & { autoplay: boolean }) {
  return (
    <section className={cn("w-full px-5 py-16 sm:px-8", className)} aria-label="How a voice-clone scam unfolds">
      <ol className="mx-auto flex max-w-xl flex-col gap-16">
        {steps.map((s, i) => (
          <StackedStep key={s.id} step={s} index={i} total={steps.length} autoplay={autoplay} />
        ))}
      </ol>
    </section>
  );
}

function StackedStep({
  step,
  index,
  total,
  autoplay,
}: {
  step: StoryStep;
  index: number;
  total: number;
  autoplay: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    const v = ref.current;
    if (!v || !autoplay) return;
    if (inView) void v.play().catch(() => undefined);
    else v.pause();
  }, [inView, autoplay]);

  return (
    <li>
      <div className="mx-auto aspect-[9/16] w-[min(72vw,340px)] overflow-hidden rounded-[24px] bg-ink/5 shadow-[0_30px_60px_-30px_rgba(17,17,17,0.35)]">
        {autoplay ? (
          <video
            ref={ref}
            className="h-full w-full object-cover"
            src={step.video}
            poster={step.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={step.alt}
          />
        ) : (
          <img className="h-full w-full object-cover" src={step.poster} alt={step.alt} loading="lazy" />
        )}
      </div>
      <p className="mt-6 font-display text-sm font-semibold tracking-widest text-cobalt">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h2 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tight text-ink">{step.headline}</h2>
      <p className="mt-3 text-lg leading-relaxed text-ink-muted">{step.sub}</p>
    </li>
  );
}
