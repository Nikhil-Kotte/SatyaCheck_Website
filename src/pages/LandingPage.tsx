import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ScrollVideoStory } from '@/components/motion/scroll-video-story';
import { StatementBand } from '@/components/StatementBand';
import { UnderTheHood } from '@/components/UnderTheHood';
import { UserFlow } from '@/components/UserFlow';
import { HowWeDiffer } from '@/components/HowWeDiffer';
import { DemoSection } from '@/components/DemoSection';
import { FamilyResults } from '@/components/FamilyResults';
import { WhereDoYouFit } from '@/components/WhereDoYouFit';
import { StatusTimeline } from '@/components/StatusTimeline';
import { PrivacySummary } from '@/components/PrivacySummary';
import { VoiceprintJourney } from '@/components/VoiceprintJourney';
import { TheStory } from '@/components/TheStory';
import { FaqSection } from '@/components/FaqSection';
import { WaitlistForm } from '@/components/WaitlistForm';
import { WorkWithUs } from '@/components/WorkWithUs';
import { STORY_STEPS } from '@/content';

export const LandingPage: React.FC = () => (
  <main className="w-full">
    <HeroSection />
    <div id="story-scroll" className="scroll-mt-0">
      <ScrollVideoStory steps={STORY_STEPS} />
    </div>
    <StatementBand />
    <UnderTheHood />
    <UserFlow />
    <DemoSection />
    <FamilyResults />
    <WhereDoYouFit />
    <HowWeDiffer />
    <StatusTimeline />
    <VoiceprintJourney />
    <PrivacySummary />
    <TheStory />
    <FaqSection />
    <WaitlistForm />
    <WorkWithUs />
  </main>
);
