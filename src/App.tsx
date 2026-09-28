import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ToastProvider } from '@/components/motion/toast-stack';
import { ScrollProgress } from '@/components/ui/bits';
import { LanguageProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import { scrollToHash, scrollToTop, useSmoothScroll } from '@/lib/smooth-scroll';
import { useGlassPointer } from '@/lib/use-glass-pointer';

/** Resets scroll on navigation, or jumps to the #hash once the page has rendered. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = window.setTimeout(() => scrollToHash(hash), 120);
      return () => window.clearTimeout(t);
    }
    scrollToTop();
  }, [pathname, hash]);
  return null;
}

export const App: React.FC = () => {
  useSmoothScroll();
  useGlassPointer();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <ScrollManager />
          <ScrollProgress />
          <div className="flex min-h-screen flex-col bg-canvas text-fg">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-solid focus:px-4 focus:py-2 focus:text-on-brand"
            >
              Skip to content
            </a>
            <Navbar />
            <div id="main" className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/hi" element={<LandingPage />} />
                <Route path="/te" element={<LandingPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
