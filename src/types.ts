export interface TeamMember {
  name: string;
  role: string;
  achievement: string;
  photoUrl?: string;
  linkedinUrl?: string;
}

export interface Advisor {
  name: string;
  role: string;
  affiliation: string;
  photoUrl?: string;
  linkedinUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ResultCardItem {
  id: 'verified' | 'careful' | 'high-risk' | 'unverified';
  status: string;
  description: string;
  cueColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export interface PipelineItem {
  step: string;
  title: string;
  /** The plain question this check answers. */
  question: string;
  description: string;
  status: string;
}

export type StoryTone = 'brand' | 'warn' | 'risk' | 'ok';

export interface StoryStep {
  id: string;
  /** Short chapter name shown beside the step number. */
  label: string;
  headline: string;
  sub: string;
  video: string;
  poster: string;
  alt: string;
  /** Whether the clip carries a soundtrack. Muted clips have no audio track at all. */
  hasAudio: boolean;
  /** Mood colour for the glow behind the video. */
  tone: StoryTone;
}

export interface AudienceTabContent {
  eyebrow?: string;
  headline: string;
  body?: string;
  points: string[];
  buttonText: string;
  diagram?: {
    step1: string;
    step2: string;
    step3: string;
    loopLabel: string;
  };
}

export interface LanguageInfo {
  code: string;
  label: string;
  nativeLabel: string;
  route: string;
  isReady: boolean;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    domain: string;
  };
  navigation: {
    logoText: string;
    links: Array<{ label: string; href: string; isRoute?: boolean }>;
    ctaText: string;
  };
  hero: {
    statusBadge: string;
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    trustLine: string;
  };
  verdictMockup: {
    callerLabel: string;
    callerName: string;
    checkRows: Array<{ label: string; value: string; status: 'weak' | 'detected' | 'scam' }>;
    warningTitle: string;
    evidenceText: string;
    primaryAction: string;
    secondaryAction: string;
    caption: string;
  };
  underTheHood: {
    eyebrow: string;
    headline: string;
    tag: string;
    pipeline: PipelineItem[];
    tintedBandText: string;
  };
  demo: {
    headline: string;
    caption: string;
    videoUrl: string;
    placeholderTitle: string;
    placeholderSub: string;
  };
  familyResults: {
    headline: string;
    cards: ResultCardItem[];
    note: string;
  };
  audience: {
    eyebrow?: string;
    headline: string;
    families: AudienceTabContent;
    banks: AudienceTabContent;
    partners: AudienceTabContent;
  };
  status: {
    eyebrow: string;
    headline: string;
    timeline: Array<{
      state: 'Done' | 'In progress' | 'Next';
      description: string;
    }>;
    closingLine: string;
  };
  privacySummary: {
    headline: string;
    blocks: Array<{ title: string; description: string; icon: string }>;
    ctaLink: string;
    ctaText: string;
  };
  theStory: {
    eyebrow: string;
    headline: string;
    body: string;
    videoUrl?: string;
  };
  team: {
    headline: string;
    members: TeamMember[];
    advisors: Advisor[];
  };
  faq: {
    headline: string;
    items: FaqItem[];
  };
  waitlist: {
    headline: string;
    body: string;
    buttonText: string;
    successMessage: string;
    errorMessage: string;
    consentText: string;
  };
  workWithUs: {
    headline: string;
    body: string;
    email: string;
    whatsappNumber: string;
    phoneNumber: string;
  };
  footer: {
    contactEmail: string;
    linkedinUrl: string;
    copyrightText: string;
    videoCredit: string;
  };
  privacyPage: {
    title: string;
    lastUpdated: string;
    intro: string;
    sections: Array<{
      title: string;
      content: string;
      bullets?: string[];
    }>;
  };
  config: {
    formEndpoint: string;
    analytics: {
      enabled: boolean;
      domain: string;
      scriptUrl: string;
    };
  };
}
