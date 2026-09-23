import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToY } from "@/lib/smooth-scroll";
import { EqBars } from "@/components/ui/bits";
import { Eyebrow } from "@/components/ui/section";
import type { StoryStep, StoryTone } from "@/types";

type ScrollVideoStoryProps = {
  steps: StoryStep[];
  className?: string;
};

const TONE_RGB: Record<StoryTone, string> = {
  brand: "var(--brand)",
  warn: "var(--warn)",
  risk: "var(--risk)",
  ok: "var(--ok)",
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** Try to play with sound; if the browser refuses, fall back to muted. */
async function playVideo(v: HTMLVideoElement, withSound: boolean): Promise<boolean> {
  v.muted = !withSound;
  try {
    await v.play();
    return withSound;
  } catch {
    v.muted = true;
    await v.play().catch(() => undefined);
    return false;
  }
}

/**
 * Pinned scroll story. On large screens a phone-sized video sits beside a
 * large headline, and each step of scroll swaps both. Below 1024px it
 * becomes a stacked list; under reduced motion nothing autoplays.
 */
export function ScrollVideoStory({ steps, className }: ScrollVideoStoryProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const [soundOn, setSoundOn] = useState(false);

  if (isDesktop && !reduce) {
    return <PinnedStory steps={steps} className={className} soundOn={soundOn} setSoundOn={setSoundOn} />;
  }
  return <StackedStory steps={steps} className={className} reduce={!!reduce} soundOn={soundOn} setSoundOn={setSoundOn} />;
}

type SoundProps = { soundOn: boolean; setSoundOn: (v: boolean) => void };

function SoundButton({
  soundOn,
  hasAudio,
  onClick,
  className,
}: {
  soundOn: boolean;
  hasAudio: boolean;
  onClick: () => void;
  className?: string;
}) {
  const audible = soundOn && hasAudio;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Turn story sound off" : "Turn story sound on"}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/60",
        className
      )}
    >
      {soundOn ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
      <span className="short:hidden">{!soundOn ? "Tap for sound" : hasAudio ? "Sound on" : "Silent scene"}</span>
      <EqBars active={audible} className={cn(!audible && "opacity-50")} />
    </button>
  );
}

function PinnedStory({ steps, className, soundOn, setSoundOn }: ScrollVideoStoryProps & SoundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const inView = useInView(sectionRef, { amount: 0.15 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    if (next !== active) setActive(next);
  });

  // Play the active clip from the start, pause the rest, and stop
  // everything when the section scrolls out of view.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView) {
        if (v.paused) v.currentTime = 0;
        void playVideo(v, soundOn && steps[i].hasAudio).then((audible) => {
          if (soundOn && steps[i].hasAudio && !audible) setSoundOn(false);
        });
      } else {
        v.pause();
        v.muted = true;
        if (i !== active) v.currentTime = 0;
      }
    });
    // soundOn is handled synchronously in toggleSound.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inView]);

  // Story-style progress segment for the playing clip.
  useEffect(() => {
    const v = videoRefs.current[active];
    if (!v) return;
    const onTime = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [active]);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    const v = videoRefs.current[active];
    if (v) void playVideo(v, next && steps[active].hasAudio);
  }, [soundOn, setSoundOn, active, steps]);

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    scrollToY(top + ((i + 0.35) / steps.length) * travel);
  };

  const step = steps[active];
  const tone = `rgb(${TONE_RGB[step.tone]})`;

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full", className)}
      style={{ height: `${steps.length * 110}vh` }}
      aria-label="How a voice-clone scam unfolds"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden px-fluid">
        {/* Mood light that follows the story from danger to relief */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-1/2 h-[70vh] w-[70vh] -translate-y-1/2 rounded-full opacity-[0.22] blur-[140px] dark:opacity-30"
          animate={{ backgroundColor: tone }}
          transition={{ duration: 1.2 }}
        />
        <div aria-hidden="true" className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-[minmax(0,1.15fr)_40px_minmax(0,0.85fr)] items-center gap-[clamp(24px,4vw,72px)]">
          {/* Text */}
          <div className="relative">
            <Eyebrow index="01">How the scam unfolds</Eyebrow>

            <div className="relative mt-10 min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  aria-live="polite"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="font-display text-[clamp(64px,7vw,120px)] font-bold leading-none tracking-[-0.06em] text-transparent"
                      style={{ WebkitTextStroke: `1.5px ${tone}` }}
                      aria-hidden="true"
                    >
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]"
                      style={{ color: tone, borderColor: `rgb(${TONE_RGB[step.tone]} / 0.35)` }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <h2 className="mt-6 max-w-[15ch] font-display text-[clamp(40px,4.6vw,80px)] font-semibold leading-[1] tracking-[-0.045em] text-fg">
                    {step.headline}
                  </h2>
                  <p className="type-lede mt-6 max-w-xl text-fg-muted">{step.sub}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Chapter navigation */}
            <ol className="mt-10 flex max-w-xl gap-2" aria-label="Story chapters">
              {steps.map((s, i) => (
                <li key={s.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className="group w-full py-2 text-left"
                  >
                    <span className="block h-[3px] w-full overflow-hidden rounded-full bg-line/15">
                      <span
                        className="block h-full rounded-full transition-[width] duration-500"
                        style={{ width: i <= active ? "100%" : "0%", background: i <= active ? tone : undefined }}
                      />
                    </span>
                    <span
                      className={cn(
                        "mt-2.5 block truncate font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                        i === active ? "text-fg" : "text-fg-subtle group-hover:text-fg-muted"
                      )}
                    >
                      {s.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Progress rail with glowing dot */}
          <div aria-hidden="true" className="relative mx-auto h-[62svh] w-px">
            <div className="absolute inset-0 bg-line/15" />
            <motion.div className="absolute left-0 top-0 w-px" style={{ height: railFill, background: tone }} />
            <motion.div className="absolute left-1/2" style={{ top: railFill }}>
              <span className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl" style={{ background: tone, opacity: 0.35 }} />
              <span
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-canvas"
                style={{ background: tone, boxShadow: `0 0 18px 4px ${tone}` }}
              />
            </motion.div>
            {steps.map((s, i) => (
              <span
                key={s.id}
                className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-line/30"
                style={{ top: `${(i / (steps.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          {/* Video */}
          <div className="relative mx-auto">
            <div
              className="absolute -inset-4 rounded-[52px] opacity-60 blur-2xl transition-colors duration-1000"
              style={{ background: `rgb(${TONE_RGB[step.tone]} / 0.35)` }}
              aria-hidden="true"
            />
            <div className="relative aspect-[9/16] h-[min(78svh,760px)] overflow-hidden rounded-[40px] border border-white/10 bg-[#0B0D2A] shadow-lift">
              {steps.map((s, i) => (
                <video
                  key={s.id}
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out",
                    i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
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

              {/* Story segments */}
              <div className="absolute inset-x-4 top-4 flex gap-1.5" aria-hidden="true">
                {steps.map((s, i) => (
                  <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                    <span
                      className="block h-full rounded-full bg-white"
                      style={{ width: i < active ? "100%" : i === active ? `${progress * 100}%` : "0%" }}
                    />
                  </span>
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 pt-16">
                <SoundButton soundOn={soundOn} hasAudio={step.hasAudio} onClick={toggleSound} />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">AI illustration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedStory({
  steps,
  className,
  reduce,
  soundOn,
  setSoundOn,
}: ScrollVideoStoryProps & SoundProps & { reduce: boolean }) {
  return (
    <section className={cn("w-full px-fluid py-24", className)} aria-label="How a voice-clone scam unfolds">
      <Eyebrow index="01">How the scam unfolds</Eyebrow>
      <ol className="mx-auto mt-12 flex max-w-xl flex-col gap-24 short:max-w-3xl short:gap-16">
        {steps.map((s, i) => (
          <StackedStep
            key={s.id}
            step={s}
            index={i}
            total={steps.length}
            reduce={reduce}
            soundOn={soundOn}
            setSoundOn={setSoundOn}
          />
        ))}
      </ol>
    </section>
  );
}

function StackedStep({
  step,
  index,
  total,
  reduce,
  soundOn,
  setSoundOn,
}: { step: StoryStep; index: number; total: number; reduce: boolean } & SoundProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const tone = `rgb(${TONE_RGB[step.tone]})`;

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    if (inView) {
      void playVideo(v, soundOn && step.hasAudio).then((audible) => {
        if (soundOn && step.hasAudio && !audible) setSoundOn(false);
      });
    } else {
      v.pause();
      v.muted = true;
    }
  }, [inView, reduce, soundOn, step.hasAudio, setSoundOn]);

  return (
    <li className="short:grid short:grid-cols-[auto_1fr] short:items-center short:gap-10">
      <div className="relative mx-auto w-[min(78vw,360px,calc(76svh*9/16))] short:w-[calc(82svh*9/16)]">
        <div className="absolute -inset-3 rounded-[40px] opacity-50 blur-2xl" style={{ background: tone }} aria-hidden="true" />
        <div className="relative aspect-[9/16] overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0D2A] shadow-lift">
          <video
            ref={ref}
            className="h-full w-full object-cover"
            src={step.video}
            poster={step.poster}
            muted
            loop={!reduce}
            playsInline
            controls={reduce}
            preload={reduce ? "none" : "metadata"}
            aria-label={step.alt}
          />
          {!reduce && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-3 pt-12">
              <SoundButton soundOn={soundOn} hasAudio={step.hasAudio} onClick={() => setSoundOn(!soundOn)} />
            </div>
          )}
        </div>
      </div>
      <div>
      <div className="mt-8 flex items-center gap-3 short:mt-0">
        <span className="font-mono text-xs text-fg-subtle">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: tone, borderColor: tone }}>
          {step.label}
        </span>
      </div>
      <h2 className="mt-4 font-display text-[clamp(32px,8vw,48px)] font-semibold leading-[1.02] tracking-[-0.04em] text-fg">{step.headline}</h2>
      <p className="mt-4 text-lg leading-relaxed text-fg-muted">{step.sub}</p>
      </div>
    </li>
  );
}
