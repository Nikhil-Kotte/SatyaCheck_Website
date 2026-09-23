import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Reveal, WordReveal } from '@/components/ui/reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { CONTENT } from '@/content';

// Each member gets a slightly different angle of the brand gradient.
const GRADIENTS = [
  'from-brand-solid to-brand-hi',
  'from-brand-hi to-brand-solid',
  'from-brand-solid via-brand-hi to-brand',
  'from-brand to-brand-solid',
];

function initials(name: string) {
  const clean = name.replace(/[[\]]/g, '').trim();
  if (!clean) return 'SC';
  const parts = clean.split(/\s+/);
  return (parts.length >= 2 ? parts[0][0] + parts[1][0] : clean.slice(0, 2)).toUpperCase();
}

export const TeamSection: React.FC = () => {
  const { team } = CONTENT;

  return (
    <Section id="team" labelledBy="team-heading">
      <div className="mx-auto max-w-[1400px]">
        <WordReveal id="team-heading" text="The *team*" className="mb-12 font-display text-[clamp(32px,3.6vw,56px)] font-semibold tracking-[-0.04em] text-fg" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.members.map((m, i) => (
            <Reveal key={i} delay={i * 0.08} className="h-full">
              <TiltCard max={10} className="rounded-card">
                <article className="flex h-full flex-col rounded-card border border-line/15 bg-surface/80 p-6 transition-colors duration-300 group-hover:border-brand/40">
                  {m.photoUrl?.trim() ? (
                    <img src={m.photoUrl} alt={m.name} loading="lazy" className="h-20 w-20 rounded-2xl object-cover" />
                  ) : (
                    <div
                      className={`grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} font-display text-2xl font-bold text-on-brand shadow-glow`}
                      aria-hidden="true"
                    >
                      {initials(m.name)}
                    </div>
                  )}
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-fg">{m.name}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-brand">{m.role}</p>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-fg-muted">{m.achievement}</p>
                  {m.linkedinUrl?.trim() && (
                    <a
                      href={m.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-brand"
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

        {team.advisors.length > 0 && (
          <div className="mt-16 border-t border-line/15 pt-12">
            <h3 className="mb-8 font-display text-2xl font-semibold tracking-tight text-fg">Advisors</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.advisors.map((a, i) => (
                <div key={i} className="rounded-card border border-line/15 bg-surface/70 p-6">
                  <h4 className="font-display text-lg font-semibold text-fg">{a.name}</h4>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-brand">{a.role}</p>
                  <p className="mt-2 text-sm text-fg-muted">{a.affiliation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};
