import React from 'react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { LogoMark } from '@/components/ui/bits';
import { CONTENT, STORY_TEXT, STORY_VIDEO_URL } from '@/content';

export const TheStory: React.FC = () => (
  <Section id="story" labelledBy="story-heading" className="pb-0 lg:pb-0">
    <SectionHeading id="story-heading" index="08" eyebrow={CONTENT.theStory.eyebrow} title="Why we're *building this*" />

    <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <Reveal>
        <blockquote className="relative">
          <span aria-hidden="true" className="absolute -left-2 -top-10 font-serif text-[140px] leading-none text-brand/20">
            “
          </span>
          <p className="relative font-serif text-[clamp(26px,2.6vw,40px)] leading-[1.25] tracking-[-0.01em] text-fg">{STORY_TEXT}</p>
          <footer className="mt-8 flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <span>
              <span className="block font-display font-semibold text-fg">The founders</span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">Hyderabad, India</span>
            </span>
          </footer>
        </blockquote>
      </Reveal>

      {STORY_VIDEO_URL.trim().length > 0 && (
        <Reveal delay={0.1}>
          <div className="aspect-video w-full overflow-hidden rounded-panel border border-line/15 bg-night shadow-lift">
            <iframe
              src={STORY_VIDEO_URL}
              title="SatyaCheck pitch"
              className="h-full w-full border-0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Reveal>
      )}
    </div>
  </Section>
);
