import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Logo, ThemeToggle } from '@/components/ui/bits';
import { CopyButton } from '@/components/motion/copy-button';
import { useLanguage } from '@/lib/use-language';
import { scrollToHash, scrollToY } from '@/lib/smooth-scroll';
import { CONTENT, CONTACT_EMAIL, LINKEDIN_URL } from '@/content';

type FooterLink = { label: string; href: string; route?: boolean; external?: boolean };

export const Footer: React.FC = () => {
  const { liveLanguages, switchLanguage, currentLang } = useLanguage();
  const { pathname } = useLocation();
  const isHome = ['/', '/hi', '/te'].includes(pathname);
  const email = CONTACT_EMAIL.replace(/^\[|\]$/g, '').trim();

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Product',
      links: [
        { label: 'How it works', href: '#how-it-works' },
        { label: 'Demo', href: '#demo' },
        { label: 'For families', href: '#audience' },
        { label: 'For banks', href: '#audience' },
        { label: 'Waitlist', href: '#waitlist' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'The story', href: '#story' },
        { label: 'Team', href: '#team' },
        { label: 'Work with us', href: '#work-with-us' },
        ...(LINKEDIN_URL.trim() ? [{ label: 'LinkedIn', href: LINKEDIN_URL, external: true }] : []),
      ],
    },
    { title: 'Legal', links: [{ label: 'Privacy policy', href: '/privacy', route: true }] },
  ];

  const linkClass = 'inline-block py-2.5 text-fg-muted transition-colors hover:text-brand';

  return (
    <footer className="relative w-full overflow-hidden border-t border-line/10 bg-canvas-2/60 px-fluid pt-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-fg-muted">
              Voice-clone scam protection for families, banks and telcos. Selected for the Eureka! 2026 zonal round, E-Cell IIT Bombay.
            </p>
            {email && <CopyButton value={email} className="mt-6" />}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">{col.title}</p>
                <ul className="space-y-0.5 text-[15px]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.route ? (
                        <Link to={l.href} className={linkClass}>
                          {l.label}
                        </Link>
                      ) : l.external ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                          {l.label}
                        </a>
                      ) : (
                        <a
                          href={isHome ? l.href : `/${l.href}`}
                          onClick={(e) => {
                            if (isHome && scrollToHash(l.href)) e.preventDefault();
                          }}
                          className={linkClass}
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">Languages</p>
              <ul className="space-y-0.5 text-[15px]">
                {liveLanguages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      type="button"
                      onClick={() => switchLanguage(lang.code)}
                      aria-current={lang.code === currentLang ? 'true' : undefined}
                      className={lang.code === currentLang ? 'inline-block py-2.5 text-fg' : linkClass}
                    >
                      {lang.nativeLabel}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line/10 py-8 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>{CONTENT.footer.copyrightText}</p>
          <p>{CONTENT.footer.videoCredit}</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => scrollToY(0)}
              aria-label="Back to top"
              className="grid h-10 w-10 place-items-center rounded-full border border-line/20 bg-surface/60 text-fg transition-colors hover:border-brand/50 hover:text-brand"
            >
              <ArrowUp className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <p
        aria-hidden="true"
        className="pointer-events-none mx-auto -mb-[0.22em] select-none whitespace-nowrap text-center font-display text-[17.5vw] font-bold leading-none tracking-[-0.07em] text-transparent"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgb(var(--brand) / 0.35), rgb(var(--brand) / 0.02) 80%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
      >
        SatyaCheck
      </p>
    </footer>
  );
};
