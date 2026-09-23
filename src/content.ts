import type { SiteContent, TeamMember, Advisor, StoryStep, PipelineItem, AudienceTabContent } from './types';

/**
 * Single source of truth for all editable content on SatyaCheck (v2).
 * Non-developers can change any copy, links, or placeholders here.
 * Placeholders are clearly marked with brackets or empty strings.
 */

export const DEMO_VIDEO_URL: string = ""; // Set to YouTube / Vimeo embed URL when ready e.g. "https://www.youtube-nocookie.com/embed/..."
export const CONTACT_EMAIL: string = "[contact@satyacheck.in]"; // e.g. "team@satyacheck.in"
export const LINKEDIN_URL: string = ""; // Set to LinkedIn company / founder profile URL e.g. "https://www.linkedin.com/company/satyacheck"
export const FORM_ENDPOINT: string = (import.meta.env.VITE_FORM_ENDPOINT as string) || ""; // Set to your Google Apps Script Web App URL

// Hero screenshot stack: if empty, the site displays the VerdictCard animation instead.
export const HERO_SCREENSHOTS: string[] = []; // e.g. ["/screens/enrolment.webp", "/screens/verdict.webp", "/screens/evidence.webp"]

// Video credit line: scam-safety brand must not pass off generated people as real customers.
export const VIDEO_CREDIT: string = "Story videos are AI-generated illustrations.";

// Story video embed (e.g. Eureka pitch recording). If empty, the video block is hidden.
export const STORY_VIDEO_URL: string = ""; 

// Founder story statement
export const STORY_TEXT: string = "[Two or three sentences from the founders about why this matters to you.]";

// Contact block links: any empty value hides its button automatically
export const WHATSAPP_NUMBER: string = ""; // e.g. "919876543210" (opens https://wa.me/919876543210)
export const PHONE_NUMBER: string = ""; // e.g. "+91 98765 43210" (initiates tel: call)

// Five-step scroll video story. Videos live in public/videos.
// Clips 1, 3 and 4 carry soundtracks made with scratch/story{1,3,4}_audio.py.
// Clips 3 and 5 are the last 10 seconds of the original renders.
// Set hasAudio to false for a clip without sound; the story shows "Silent scene".
export const STORY_STEPS: StoryStep[] = [
  {
    id: "step-1",
    label: "The clone",
    headline: "A few seconds of your son's voice is enough to copy it.",
    sub: "A reel, a voice note, a video. As little as 3 seconds of audio can produce an 85% voice match (McAfee, 2023).",
    video: "/videos/story-1.mp4",
    poster: "/videos/story-1.webp",
    alt: "An abstract visual of a voice waveform being copied into a second waveform.",
    hasAudio: true,
    tone: "brand",
  },
  {
    id: "step-2",
    label: "The call",
    headline: "Then your mother gets a call. He sounds scared.",
    sub: "It is his voice. It might not be him.",
    video: "/videos/story-2.mp4",
    poster: "/videos/story-2.webp",
    alt: "An older woman answers a phone call at home in the evening and looks worried.",
    hasAudio: true,
    tone: "warn",
  },
  {
    id: "step-3",
    label: "The pressure",
    headline: "Then comes the pressure.",
    sub: "\"Don't tell anyone. Send it now.\" A UPI transfer takes seconds and can't be pulled back.",
    video: "/videos/story-3.mp4",
    poster: "/videos/story-3.webp",
    alt: "Hands holding a phone with a payment screen open, hesitating.",
    hasAudio: true,
    tone: "risk",
  },
  {
    id: "step-4",
    label: "The check",
    headline: "SatyaCheck listens with you.",
    sub: "It checks the voice, the speech and the script while the call is still going.",
    video: "/videos/story-4.mp4",
    poster: "/videos/story-4.webp",
    alt: "A phone on a table glowing softly with rings of light during a call.",
    hasAudio: true,
    tone: "brand",
  },
  {
    id: "step-5",
    label: "The relief",
    headline: "And tells you why.",
    sub: "The warning quotes the exact line that matched a known scam. You call your son back. He's fine.",
    video: "/videos/story-5.mp4",
    poster: "/videos/story-5.webp",
    alt: "The woman smiles with relief on a video call with her son.",
    hasAudio: true,
    tone: "ok",
  },
];

// Technical pipeline statuses
// TODO(team): confirm each status matches the product on launch day.
export const PIPELINE: PipelineItem[] = [
  {
    step: "01",
    title: "Voice match.",
    description: "Compares the caller with the family member's enrolled voiceprint.",
    status: "Working",
  },
  {
    step: "02",
    title: "Synthetic speech check.",
    description: "Looks for the acoustic fingerprints of AI-generated voices.",
    status: "In testing",
  },
  {
    step: "03",
    title: "Scam-script match.",
    description: "Matches the conversation against Indian scam scripts in Hindi, English and Hinglish.",
    status: "Working",
  },
  {
    step: "04",
    title: "Fusion and evidence.",
    description: "Combines all three and quotes the matched line as the reason.",
    status: "Working",
  },
];

// Audience chooser panels
export const AUDIENCE_CONTENT: {
  families: AudienceTabContent;
  banks: AudienceTabContent;
  partners: AudienceTabContent;
} = {
  families: {
    headline: "Protect your parents from calls that sound like you.",
    // TODO(team): confirm "free for waitlist families" before launch, or remove that point.
    points: [
      "Enrol your voice once, with consent.",
      "Warnings arrive during the call, with the reason on screen.",
      "Early access is free for waitlist families.",
    ],
    buttonText: "Join the waitlist",
  },
  banks: {
    eyebrow: "The verification layer for voice calls.",
    headline: "Stop fraud before the transfer, inside your own app.",
    body: "Most people who need this will never install a security app. You already reach them. SatyaCheck plugs into your app so customers are protected during the call, not after the complaint.",
    points: [
      "Warnings arrive during the call, before a transfer is approved.",
      "Every alert carries its evidence, useful for your fraud team.",
      "Built for Indian languages and Indian scam patterns.",
    ],
    diagram: {
      step1: "Bank",
      step2: "SatyaCheck",
      step3: "Customers",
      loopLabel: "Fewer fraud cases and complaints",
    },
    buttonText: "Talk to us about a pilot",
  },
  partners: {
    headline: "Help the people you protect spot cloned-voice scams.",
    points: [
      "Pilot SatyaCheck with a community you already support.",
      "Tell us which scam scripts you're seeing, so we can detect them.",
      "Get early access to our findings on Indian voice scams.",
    ],
    buttonText: "Partner with us",
  },
};

export const TEAM: TeamMember[] = [
  {
    name: "[Founder Name]",
    role: "[Founder & AI Audio Lead]",
    achievement: "[One concrete achievement]",
    photoUrl: "",
    linkedinUrl: "",
  },
  {
    name: "[Co-Founder Name]",
    role: "[Co-Founder & Systems Lead]",
    achievement: "[One concrete achievement]",
    photoUrl: "",
    linkedinUrl: "",
  },
  {
    name: "[Team Member Name]",
    role: "[NLP & Scam Detection Lead]",
    achievement: "[One concrete achievement]",
    photoUrl: "",
    linkedinUrl: "",
  },
  {
    name: "[Team Member Name]",
    role: "[Mobile & Telephony Engineer]",
    achievement: "[One concrete achievement]",
    photoUrl: "",
    linkedinUrl: "",
  },
];

export const ADVISORS: Advisor[] = []; // Add advisors when confirmed; only rendered if non-empty

export const CONTENT: SiteContent = {
  meta: {
    title: "SatyaCheck: Know if the voice on the phone is real",
    description: "Voice-clone scams target families. SatyaCheck checks the voice, the speech and the script, and warns you during the call.",
    domain: "satyacheck.in",
  },
  navigation: {
    logoText: "SatyaCheck",
    links: [
      { label: "The scam", href: "#story-scroll" },
      { label: "How it works", href: "#how-it-works" },
      { label: "For banks", href: "#audience" },
      { label: "Team", href: "#team" },
      { label: "FAQ", href: "#faq" },
    ],
    ctaText: "Join the waitlist",
  },
  hero: {
    statusBadge: "Early access: waitlist open",
    eyebrow: "Voice-clone scam protection",
    headline: "Is that really your son on the phone?",
    subheadline: "SatyaCheck checks the voice, the speech and what the caller is asking for, then tells your parents whether to trust the call, with the reason on screen.",
    primaryCta: "Join the waitlist",
    secondaryCta: "Watch the story",
    trustLine: "Built by engineering students in Hyderabad. Selected for the Eureka! 2026 zonal round, E-Cell IIT Bombay.",
  },
  verdictMockup: {
    callerLabel: "Incoming call",
    callerName: "Rahul (son)",
    checkRows: [
      { label: "Voice match", value: "Weak", status: "weak" },
      { label: "Synthetic speech", value: "Detected", status: "detected" },
      { label: "Scam script", value: "Family emergency", status: "scam" },
    ],
    warningTitle: "Stop. This may not be Rahul.",
    evidenceText: 'He said "Don\'t tell Papa. Send it now, I\'ll explain later." This matches a known family-emergency scam.',
    primaryAction: "Call Rahul directly",
    secondaryAction: "Report to 1930",
    caption: "Illustrative screen",
  },
  underTheHood: {
    eyebrow: "How it works",
    headline: "Three checks. One clear answer.",
    tag: "Prototype",
    pipeline: PIPELINE,
    tintedBandText: "Every warning tells you why. We quote the exact line that matched a known scam, so you can decide for yourself.",
  },
  demo: {
    headline: "See it catch a scam",
    caption: "A genuine call stays green. A cloned voice gets flagged. A real person reading a scam script gets flagged too.",
    videoUrl: DEMO_VIDEO_URL,
    placeholderTitle: "Demo video coming soon",
    placeholderSub: "We are recording our full end-to-end detection on live telecom audio. Join the waitlist to be notified when it drops.",
  },
  familyResults: {
    headline: "Clear answers, not confusing scores",
    cards: [
      {
        id: "verified",
        status: "Verified",
        description: "This matches the person you enrolled. No scam signs.",
        cueColor: "#15803D", // Green-700
        badgeBg: "rgba(22, 163, 74, 0.10)",
        badgeText: "#15803D",
        borderColor: "rgba(22, 163, 74, 0.25)",
      },
      {
        id: "careful",
        status: "Be careful",
        description: "Something is unusual. Verify before acting.",
        cueColor: "#B45309", // Amber-700
        badgeBg: "rgba(217, 119, 6, 0.10)",
        badgeText: "#B45309",
        borderColor: "rgba(217, 119, 6, 0.25)",
      },
      {
        id: "high-risk",
        status: "High risk",
        description: "Do not send money or share an OTP. Call them back directly.",
        cueColor: "#B91C1C", // Red-700
        badgeBg: "rgba(220, 38, 38, 0.10)",
        badgeText: "#B91C1C",
        borderColor: "rgba(220, 38, 38, 0.25)",
      },
      {
        id: "unverified",
        status: "Unverified",
        description: "We don't know this caller. That doesn't mean they're safe.",
        cueColor: "#4B5563", // Gray-600
        badgeBg: "rgba(107, 114, 128, 0.10)",
        badgeText: "#4B5563",
        borderColor: "rgba(107, 114, 128, 0.25)",
      },
    ],
    note: "We never show green for a stranger, because we haven't verified anyone.",
  },
  audience: {
    headline: "Where do you fit",
    families: AUDIENCE_CONTENT.families,
    banks: AUDIENCE_CONTENT.banks,
    partners: AUDIENCE_CONTENT.partners,
  },
  status: {
    eyebrow: "Status",
    headline: "Early, and honest about it",
    timeline: [
      {
        state: "Done",
        description: "A working prototype that combines all three checks. A fine-tuned voice detector tested on recordings from speakers it never saw in training.",
      },
      {
        state: "In progress",
        description: "Testing on real phone-call audio, which is much harder than studio recordings.",
      },
      {
        state: "Next",
        description: "A pilot with a bank or cyber-crime cell.",
      },
    ],
    closingLine: "We publish our limits as well as our results. Ask us for the numbers.",
  },
  privacySummary: {
    headline: "Built to protect privacy, not collect it",
    blocks: [
      {
        title: "Voiceprints, not recordings",
        description: "An enrolled voice is stored as numbers that can't be played back.",
        icon: "fingerprint",
      },
      {
        title: "Consent first",
        description: "Nobody is enrolled without agreeing, and anyone can delete their voiceprint.",
        icon: "check-circle",
      },
      {
        title: "No call recordings kept",
        description: "Audio is analysed and discarded.",
        icon: "shield-check",
      },
      {
        title: "Designed for India's DPDP Act",
        description: "Built strictly respecting personal data protection principles.",
        icon: "file-text",
      },
    ],
    ctaLink: "/privacy",
    ctaText: "Read our privacy policy",
  },
  theStory: {
    eyebrow: "The story",
    headline: "Why we're building this",
    body: STORY_TEXT,
    videoUrl: STORY_VIDEO_URL,
  },
  team: {
    headline: "The team",
    members: TEAM,
    advisors: ADVISORS,
  },
  faq: {
    headline: "Frequently asked questions",
    items: [
      {
        question: "Does the caller need to install anything?",
        answer: "No. Only the person being protected opts in.",
      },
      {
        question: "Does it work in Hindi and Telugu?",
        answer: "The scam-matching works in Hindi, English and Hinglish today. More languages are planned.",
      },
      {
        question: "Is it available now?",
        answer: "Not yet. Join the waitlist and we'll tell you when pilots open.",
      },
      {
        question: "Will it ever block a real call?",
        answer: "No. SatyaCheck warns; you decide.",
      },
      {
        question: "What happens to my voice data?",
        answer: "It's stored as a voiceprint, never a recording, and you can delete it anytime.",
      },
    ],
  },
  waitlist: {
    headline: "Protect the people who pick up the phone",
    body: "Join the waitlist for early access, or tell us about a parent who almost got scammed. Every story helps us build this right.",
    buttonText: "Join the waitlist",
    successMessage: "You're on the list. Thank you.",
    errorMessage: "Unable to submit your details right now. Please check your connection and try again.",
    consentText: "I agree to be contacted about SatyaCheck and have read the privacy policy.",
  },
  workWithUs: {
    headline: "Work with us",
    body: "Talk to us about pilots, partnerships or research.",
    email: CONTACT_EMAIL,
    whatsappNumber: WHATSAPP_NUMBER,
    phoneNumber: PHONE_NUMBER,
  },
  footer: {
    contactEmail: CONTACT_EMAIL,
    linkedinUrl: LINKEDIN_URL,
    copyrightText: "© 2026 SatyaCheck. Built in Hyderabad.",
    videoCredit: VIDEO_CREDIT,
  },
  privacyPage: {
    title: "Privacy Policy",
    lastUpdated: "September 2026",
    intro: "SatyaCheck is built on the principle that protecting you from scams should never require sacrificing your personal privacy. This policy explains plainly what data we collect on this website, why we collect it, and how you stay in complete control.",
    sections: [
      {
        title: "What we collect on this website",
        content: "We only collect information that you explicitly provide when submitting our waitlist or pilot inquiry forms:",
        bullets: [
          "Your name",
          "Your email address or 10-digit Indian phone number",
          "Your city (optional)",
          "Your role or perspective (parent, son or daughter, bank or organisation, or other)",
          "Your optional personal story or message",
          "For bank and telco pilot inquiries: your organisation name and job role",
        ],
      },
      {
        title: "Why we collect it",
        content: "We collect this information solely to notify you when SatyaCheck pilots and early access invitations open, to understand the scam patterns families face across Indian cities, and to coordinate potential enterprise pilots with interested banks and telcos.",
      },
      {
        title: "Where it is stored",
        content: "Form submissions are stored in a private, encrypted Google Sheet accessible only to the founding engineering team of SatyaCheck with multi-factor authentication. We never sell, rent, or share your contact information with advertisers or third parties.",
      },
      {
        title: "How long we keep it",
        content: "We retain waitlist and pilot inquiry submissions only for the duration of our pre-launch beta and pilot onboarding period, or until you request its deletion.",
      },
      {
        title: "How to ask for deletion",
        content: "You have the right to request deletion of your information at any time. Simply email us at the contact address listed below with your name and submitted email or phone number. We will erase your entry within 48 hours and confirm the deletion to you.",
      },
    ],
  },
  config: {
    formEndpoint: FORM_ENDPOINT,
    analytics: {
      enabled: false,
      domain: "satyacheck.in",
      scriptUrl: "",
    },
  },
};
