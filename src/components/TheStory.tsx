import React from 'react';
import { ArrowUpRight, Award, Medal, Trophy, type LucideIcon } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { LogoMark } from '@/components/ui/bits';
import { TiltCard } from '@/components/ui/tilt-card';
import { CONTENT, STORY_TEXT, STORY_VIDEO_URL, TEAM } from '@/content';

// Each founder gets a slightly different angle of the brand gradient.
const GRADIENTS = [
  'from-brand-solid to-brand-hi',
  'from-brand-hi to-brand-solid',
  'from-brand-solid via-brand-hi to-brand',
  'from-brand to-brand-solid',
];

// Recognition, each with who earned it. Update alongside the pitch deck.
const CREDENTIALS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Award, title: 'Eureka! 2026', detail: 'Selected for the zonal round, E-Cell IIT Bombay' },
  { icon: Trophy, title: '2nd Prize', detail: 'Forge Inspira Hackathon 2026, IIT Hyderabad (Nikhil Kotte)' },
  { icon: Medal, title: 'Silver Medal', detail: 'HackerRank Orchestrate, #93 of 35,712 (Manideep Munjampally)' },
];

function initials(name: string) {
  const clean = name.replace(/[[\]]/g, '').trim();
  if (!clean) return 'SC';
  const parts = clean.split(/\s+/);
  return (parts.length >= 2 ? parts[0][0] + parts[1][0] : clean.slice(0, 2)).toUpperCase();
}

/** Why we're building this, and who is building it, in one section. */
export const TheStory: React.FC = () => (
  <Section id="team" labelledBy="story-heading" className="overflow-hidden">
    <span id="story" className="absolute -top-24" aria-hidden="true" />
    <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[20%] h-[520px] w-[520px] rounded-full bg-brand-hi/[0.12] blur-[140px]" />

    <SectionHeading
      id="story-heading"
      index="12"
      eyebrow={`${CONTENT.theStory.eyebrow} and the team`}
      title="Why we're *building this*"
      lede="Four engineering students in Hyderabad, building the check we wished our own parents had."
    />

    <div className="relative mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
      {/* The story */}
      <Reveal className="h-full">
        <blockquote className="liquid-glass flex h-full flex-col rounded-panel p-7 sm:p-10">
          <span aria-hidden="true" className="-mb-6 font-serif text-[120px] leading-none text-brand/25">
            “
          </span>
          <p className="font-serif text-[clamp(24px,2.3vw,36px)] leading-[1.25] tracking-[-0.01em] text-fg">{STORY_TEXT}</p>
          <footer className="mt-auto flex items-center gap-3 pt-8">
            <LogoMark className="h-9 w-9" />
            <span>
              <span className="block font-display font-semibold text-fg">The founders</span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">Hyderabad, India</span>
            </span>
          </footer>
          {STORY_VIDEO_URL.trim().length > 0 && (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-card bg-night">
              <iframe
                src={STORY_VIDEO_URL}
                title="SatyaCheck pitch"
                className="h-full w-full border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </blockquote>
      </Reveal>

      {/* The team */}
      <div className="grid gap-4 sm:grid-cols-2">
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08} className="h-full">
            <TiltCard max={8} className="rounded-card">
              <article className="liquid-glass flex h-full flex-col rounded-card p-6">
                <div className="flex items-center gap-4">
                  {m.photoUrl?.trim() ? (
                    <img src={m.photoUrl} alt={m.name} loading="lazy" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                  ) : (
                    <div
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} font-display text-lg font-bold text-on-brand shadow-glow`}
                      aria-hidden="true"
                    >
                      {initials(m.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-fg">{m.name}</h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-brand">{m.role}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-fg-muted">{m.achievement}</p>
                {m.linkedinUrl?.trim() && (
                  <a
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-brand"
                    aria-label={`${m.name} on LinkedIn`}
                  >
                    LinkedIn <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>

    {/* Recognition */}
    <div className="relative mx-auto mt-4 grid max-w-[1400px] gap-4 md:grid-cols-3">
      {CREDENTIALS.map((c, i) => (
        <Reveal key={c.title} delay={i * 0.08} className="h-full">
          <div className="liquid-glass flex h-full items-center gap-4 rounded-card p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
              <c.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-semibold tracking-tight text-fg">{c.title}</span>
              <span className="block text-sm leading-snug text-fg-muted">{c.detail}</span>
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);
