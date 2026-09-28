import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { WordReveal } from '@/components/ui/reveal';
import { ZoomOnScroll } from '@/components/ui/zoom-on-scroll';
import { Button } from '@/components/ui/button';
import { CONTENT, CONTACT_EMAIL, WHATSAPP_NUMBER, PHONE_NUMBER } from '@/content';

export const WorkWithUs: React.FC = () => {
  const email = CONTACT_EMAIL.replace(/^\[|\]$/g, '').trim();
  const whatsapp = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const phone = PHONE_NUMBER.replace(/[^\d+]/g, '');

  return (
    <section id="work-with-us" className="w-full scroll-mt-24 px-fluid pb-24 lg:pb-32" aria-labelledby="work-heading">
      <ZoomOnScroll className="mx-auto max-w-[1400px]">
        <div className="relative isolate overflow-hidden bg-night px-6 py-20 text-center text-white sm:px-12 lg:py-28">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-full h-[700px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[#3d4bff]/50 blur-[120px]" />
            <div className="absolute left-1/2 top-full h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[#a58bff]/40 blur-[80px]" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
                maskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 70%)',
              }}
            />
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">Pilots · Partnerships · Research</p>
          <WordReveal
            id="work-heading"
            text={`${CONTENT.workWithUs.headline.replace(/ us$/, '')} *us*`}
            className="mx-auto mt-6 font-display text-[clamp(48px,8vw,140px)] font-semibold leading-[0.95] tracking-[-0.05em] text-white"
            accentClassName="text-[#b9c1ff]"
          />
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70 sm:text-xl">{CONTENT.workWithUs.body}</p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {email && (
              <Button href={`mailto:${email}`} variant="light" size="lg" icon={<Mail className="h-4 w-4" aria-hidden="true" />} magnetic>
                Email us
              </Button>
            )}
            {whatsapp && (
              <Button
                href={`https://wa.me/${whatsapp}`}
                external
                size="lg"
                variant="ghost"
                className="liquid-glass-night text-white hover:bg-transparent hover:text-white"
                icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
              >
                Message on WhatsApp
              </Button>
            )}
            {phone && (
              <Button
                href={`tel:${phone}`}
                size="lg"
                variant="ghost"
                className="liquid-glass-night text-white hover:bg-transparent hover:text-white"
                icon={<Phone className="h-4 w-4" aria-hidden="true" />}
              >
                Call
              </Button>
            )}
          </div>
        </div>
      </ZoomOnScroll>
    </section>
  );
};
