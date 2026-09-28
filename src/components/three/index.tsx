import { lazy, Suspense, useEffect, useState } from "react";

// three.js is ~150 KB gzipped, so the scenes load in their own chunk after
// the page has painted. Until then (or without WebGL) a CSS glow stands in.
const VoiceOrbImpl = lazy(() => import("./voice-orb"));
const SignalFieldImpl = lazy(() => import("./signal-field"));

function useIdleReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(t);
  }, []);
  return ready;
}

export function VoiceOrb({ className }: { className?: string }) {
  const ready = useIdleReady();
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <VoiceOrbImpl className={className} />
    </Suspense>
  );
}

export function SignalField({ className }: { className?: string }) {
  const ready = useIdleReady();
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <SignalFieldImpl className={className} />
    </Suspense>
  );
}

const ParticleMorphImpl = lazy(() => import("./particle-morph"));

/** Waveform → voiceprint globe → shield. `getProgress` returns 0..2. */
export function ParticleMorph({ className, getProgress }: { className?: string; getProgress: () => number }) {
  const ready = useIdleReady();
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <ParticleMorphImpl className={className} getProgress={getProgress} />
    </Suspense>
  );
}
