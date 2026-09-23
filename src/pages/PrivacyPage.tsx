import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { Reveal, WordReveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { CONTENT, CONTACT_EMAIL } from '../content';

// TODO(team): review before launch.
export const PrivacyPage: React.FC = () => {
  const { privacyPage } = CONTENT;
  const email = CONTACT_EMAIL.replace(/[[\]]/g, '').trim();

  return (
    <main className="relative px-fluid pb-24 pt-32 sm:pt-40">
      <div aria-hidden="true" className="bg-grid mask-radial pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-60" />
      <div className="relative mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <div className="mt-10 border-b border-line/15 pb-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-line/15 bg-surface/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Data transparency
          </p>
          <WordReveal
            as="h1"
            text={`Privacy *policy*`}
            className="mt-6 font-display text-[clamp(44px,7vw,96px)] font-semibold leading-[0.95] tracking-[-0.05em] text-fg"
          />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">Last updated: {privacyPage.lastUpdated}</p>
        </div>

        <Reveal>
          <p className="mt-10 text-xl leading-relaxed text-fg">{privacyPage.intro}</p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {privacyPage.sections.map((section, i) => (
            <Reveal key={section.title} delay={0.05}>
              <section className="rounded-card border border-line/15 bg-surface/70 p-6 sm:p-8">
                <h2 className="flex items-baseline gap-4 font-display text-2xl font-semibold tracking-tight text-fg">
                  <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                <p className="mt-4 leading-relaxed text-fg-muted">{section.content}</p>
                {section.bullets && (
                  <ul className="mt-5 space-y-2.5">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-fg">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {section.title.toLowerCase().includes('deletion') && email && (
                  <Button
                    href={`mailto:${email}?subject=SatyaCheck data deletion request`}
                    className="mt-6"
                    icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                  >
                    Email a deletion request
                  </Button>
                )}
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
};
