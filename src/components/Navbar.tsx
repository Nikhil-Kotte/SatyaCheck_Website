import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Globe } from 'lucide-react';
import { Logo, ThemeToggle } from '@/components/ui/bits';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/use-language';
import { scrollToHash } from '@/lib/smooth-scroll';
import { cn } from '@/lib/utils';
import { CONTENT } from '@/content';

const LINKS = CONTENT.navigation.links;

/**
 * Tracks which section is under the middle of the viewport. Every section is
 * observed, so sections without a nav link clear the highlight.
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = Array.from(document.querySelectorAll('main section[id], #story-scroll'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { currentLang, liveLanguages, switchLanguage } = useLanguage();
  const isHome = ['/', '/hi', '/te'].includes(location.pathname);
  const { scrollY } = useScroll();
  const active = useActiveSection(isHome);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (!href.startsWith('#')) return;
    e.preventDefault();
    if (isHome) scrollToHash(href);
    else navigate(`/${href}`); // ScrollManager in App scrolls once the page renders.
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.nav
          aria-label="Main"
          initial={reduce ? false : { y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'mx-auto flex max-w-[1240px] items-center justify-between rounded-full border px-3 py-2 transition-[background-color,border-color,box-shadow,max-width] duration-500 sm:pl-5',
            scrolled || open
              ? 'liquid-glass max-w-[1080px]'
              : 'border-transparent bg-transparent'
          )}
        >
          <Link to="/" aria-label="SatyaCheck home" onClick={() => setOpen(false)} className="shrink-0 py-1.5">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
            {LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href} className="relative">
                  <a
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={(e) => go(e, link.href)}
                    onMouseEnter={() => setHovered(link.href)}
                    className={cn(
                      'relative z-10 block rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors',
                      isActive ? 'text-brand' : 'text-fg-muted hover:text-fg'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-brand"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                  {hovered === link.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-brand/[0.08]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {liveLanguages.length > 1 && (
              <label className="relative hidden items-center md:inline-flex">
                <span className="sr-only">Choose language</span>
                <select
                  value={currentLang}
                  onChange={(e) => switchLanguage(e.target.value)}
                  className="h-10 cursor-pointer appearance-none rounded-full border border-line/20 bg-surface/60 pl-3 pr-8 text-xs font-semibold text-fg"
                >
                  {liveLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel}
                    </option>
                  ))}
                </select>
                <Globe className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-brand" aria-hidden="true" />
              </label>
            )}
            <ThemeToggle />
            <Button href={isHome ? '#waitlist' : '/#waitlist'} size="sm" className="hidden h-10 px-5 sm:inline-flex">
              {CONTENT.navigation.ctaText}
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line/20 bg-surface/60 lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <span
                className={cn(
                  'absolute h-[1.5px] w-4 rounded bg-fg transition-transform duration-300',
                  open ? 'rotate-45' : '-translate-y-[4px]'
                )}
              />
              <span
                className={cn(
                  'absolute h-[1.5px] w-4 rounded bg-fg transition-transform duration-300',
                  open ? '-rotate-45' : 'translate-y-[4px]'
                )}
              />
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-canvas/95 px-6 pb-10 pt-28 backdrop-blur-xl short:pt-20 lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={(e) => go(e, link.href)}
                    className="flex items-baseline gap-4 border-b border-line/10 py-4 font-display text-4xl font-semibold tracking-tight text-fg short:py-2.5 short:text-2xl"
                  >
                    <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Link
                  to="/privacy"
                  onClick={() => setOpen(false)}
                  className="block py-4 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted"
                >
                  Privacy policy
                </Link>
              </motion.li>
            </ul>
            <div className="mt-auto pt-6">
              <Button href={isHome ? '#waitlist' : '/#waitlist'} onClick={() => setOpen(false)} size="lg" className="w-full" arrow>
                {CONTENT.navigation.ctaText}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
