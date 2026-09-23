import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Building2, Check, HeartHandshake, Home, ShieldCheck, Smartphone, Users, type LucideIcon } from 'lucide-react';
import { SegmentedToggle } from '@/components/motion/segmented-toggle';
import { PilotModal } from '@/components/PilotModal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AUDIENCE_CONTENT } from '@/content';

type AudienceTab = 'families' | 'banks' | 'partners';

type FlowNode = { icon: LucideIcon; title: string; sub: string; core?: boolean };

const FLOWS: Record<AudienceTab, { nodes: FlowNode[]; loop?: string }> = {
  families: {
    nodes: [
      { icon: Users, title: 'You', sub: 'Enrol your voice once' },
      { icon: ShieldCheck, title: 'SatyaCheck', sub: 'Checks every call', core: true },
      { icon: Home, title: 'Your parents', sub: 'Warned during the call' },
    ],
  },
  banks: {
    nodes: [
      { icon: Building2, title: AUDIENCE_CONTENT.banks.diagram!.step1, sub: 'Mobile app integration' },
      { icon: ShieldCheck, title: AUDIENCE_CONTENT.banks.diagram!.step2, sub: 'Real-time verification layer', core: true },
      { icon: Smartphone, title: AUDIENCE_CONTENT.banks.diagram!.step3, sub: 'Protected before the transfer' },
    ],
    loop: AUDIENCE_CONTENT.banks.diagram!.loopLabel,
  },
  partners: {
    nodes: [
      { icon: HeartHandshake, title: 'Your community', sub: 'People you already support' },
      { icon: ShieldCheck, title: 'SatyaCheck', sub: 'Learns the scripts you see', core: true },
      { icon: Users, title: 'Findings', sub: 'Early access for partners' },
    ],
  },
};

export const WhereDoYouFit: React.FC = () => {
  const [tab, setTab] = useState<AudienceTab>('families');
  const [modal, setModal] = useState<{ open: boolean; type: 'pilot' | 'partner' }>({ open: false, type: 'pilot' });
  const reduce = useReducedMotion();
  const current = AUDIENCE_CONTENT[tab];
  const flow = FLOWS[tab];

  return (
    <Section id="audience" labelledBy="audience-heading">
      <span id="for-banks" className="absolute -top-24" aria-hidden="true" />
      <SectionHeading
        id="audience-heading"
        index="05"
        eyebrow="Where do you fit"
        title="Built for everyone *on the front line*"
        align="center"
      >
        <div className="mt-10 flex justify-center">
          <SegmentedToggle<AudienceTab>
            label="Audience chooser"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'families', label: 'Families' },
              { value: 'banks', label: 'Banks and telcos' },
              { value: 'partners', label: 'Cyber cells and NGOs' },
            ]}
            className="p-1.5 text-[15px] [&_button]:px-5 [&_button]:py-2.5"
          />
        </div>
      </SectionHeading>

      <div className="relative mx-auto max-w-[1300px] overflow-hidden rounded-panel border border-line/15 bg-surface/70 shadow-card">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50 mask-fade-y" />
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid gap-12 p-7 sm:p-12 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:p-16"
          >
            <div>
              {current.eyebrow && (
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">{current.eyebrow}</p>
              )}
              <h3 className="font-display text-[clamp(30px,3.4vw,52px)] font-semibold leading-[1.02] tracking-[-0.04em] text-fg">
                {current.headline}
              </h3>
              {current.body && <p className="mt-6 text-lg leading-relaxed text-fg-muted">{current.body}</p>}
              <ul className="mt-8 space-y-4">
                {current.points.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-solid text-on-brand">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-[17px] leading-relaxed text-fg">{p}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10">
                {tab === 'families' ? (
                  <Button href="#waitlist" size="lg" arrow magnetic>
                    {current.buttonText}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    arrow
                    magnetic
                    onClick={() => setModal({ open: true, type: tab === 'banks' ? 'pilot' : 'partner' })}
                  >
                    {current.buttonText}
                  </Button>
                )}
              </div>
            </div>

            <FlowDiagram nodes={flow.nodes} loop={flow.loop} />
          </motion.div>
        </AnimatePresence>
      </div>

      <PilotModal isOpen={modal.open} onClose={() => setModal((m) => ({ ...m, open: false }))} type={modal.type} />
    </Section>
  );
};

function FlowDiagram({ nodes, loop }: { nodes: FlowNode[]; loop?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex flex-col items-stretch justify-center gap-0" aria-label="How it connects">
      {nodes.map((n, i) => (
        <React.Fragment key={n.title}>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative flex items-center gap-4 rounded-2xl border p-5',
              n.core
                ? 'border-transparent bg-brand-solid text-on-brand shadow-glow'
                : 'border-line/15 bg-surface text-fg'
            )}
          >
            {n.core && (
              <span aria-hidden="true" className="absolute inset-0 rounded-2xl border-2 border-brand motion-safe:animate-ring-soft" />
            )}
            <span
              className={cn(
                'grid h-12 w-12 shrink-0 place-items-center rounded-xl',
                n.core ? 'bg-white/15' : 'bg-brand/10 text-brand'
              )}
            >
              <n.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold tracking-tight">{n.title}</span>
              <span className={cn('block text-sm', n.core ? 'text-white/75' : 'text-fg-muted')}>{n.sub}</span>
            </span>
          </motion.div>
          {i < nodes.length - 1 && <Connector />}
        </React.Fragment>
      ))}
      {loop && (
        <div className="mt-5 flex items-center gap-3 rounded-full border border-dashed border-brand/40 bg-brand/5 px-4 py-2.5">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand motion-safe:animate-spin-slow" aria-hidden="true">
            <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand">{loop}</span>
        </div>
      )}
    </div>
  );
}

/** Vertical link between flow nodes, with signal dots travelling down it. */
function Connector() {
  return (
    <div className="relative mx-auto h-12 w-px bg-gradient-to-b from-line/30 to-line/10" aria-hidden="true">
      {[0, 0.6].map((d) => (
        <span
          key={d}
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_10px_rgb(var(--brand))] motion-safe:animate-flow-dot motion-reduce:hidden"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </div>
  );
}
