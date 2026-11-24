import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { WordReveal } from '@/components/ui/reveal';
import { Ripples } from '@/components/ui/section';
import { ZoomOnScroll } from '@/components/ui/zoom-on-scroll';
import { Button } from '@/components/ui/button';
import { CONTENT, CONTACT_EMAIL, WHATSAPP_NUMBER, PHONE_NUMBER } from '@/content';

export const WorkWithUs: React.FC = () => {
  const email = CONTACT_EMAIL.replace(/^\[|\]$/g, '').trim();
  const whatsapp = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const phone = PHONE_NUMBER.replace(/[^\d+]/g, '');

  return (
    <section id="work-with-us" className="w-full scroll-mt-24 px-fluid py-24 lg:py-32" aria-labelledby="work-heading">
      <ZoomOnScroll className="mx-auto max-w-[1400px]">
        <div className="tone-lime relative isolate overflow-hidden rounded-[inherit] border-2 border-ink px-6 py-20 text-center sm:px-12 lg:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="bg-dots absolute inset-0 opacity-60" />
            <Ripples className="absolute -bottom-52 -left-40 h-[520px] w-[520px] text-fg opacity-40" />
            <Ripples className="absolute -right-40 -top-52 h-[520px] w-[520px] text-brand opacity-50" />
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted">Pilots · Partnerships · Research</p>
          <WordReveal
            id="work-heading"
            text={`${CONTENT.workWithUs.headline.replace(/ us$/, '')} *us*`}
            className="mx-auto mt-6 font-display text-[clamp(48px,8vw,140px)] font-extrabold leading-[0.95] tracking-[-0.04em] text-fg"
            
          />
          <p className="mx-auto mt-6 max-w-xl text-lg text-fg-muted sm:text-xl">{CONTENT.workWithUs.body}</p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {email && (
              <Button href={`mailto:${email}`} size="lg" icon={<Mail className="h-4 w-4" aria-hidden="true" />} magnetic>
                Email us
              </Button>
            )}
            {whatsapp && (
              <Button
                href={`https://wa.me/${whatsapp}`}
                external
                size="lg"
                variant="secondary"
                icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
              >
                Message on WhatsApp
              </Button>
            )}
            {phone && (
              <Button
                href={`tel:${phone}`}
                size="lg"
                variant="secondary"
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
